import { prisma } from "../../lib/prisma.js";

type BenchmarkResult = {
  taxRateCompany: number;
  taxRateMarket: number;
  payrollRateCompany: number;
  payrollRateMarket: number;
  marginCompany: number;
  marginMarket: number;
};

type BenchmarkBaseline = {
  taxRate: number;
  payrollRate: number;
  margin: number;
};

type SourceInfo = {
  url: string;
  dataset: string;
  updatedAt: string | null;
};

type IbgeActivityMetrics = {
  activityCode: string;
  activityName: string;
  payrollRate: number;
  margin: number;
};

type RealMarketBaseline = {
  matchedSector: string;
  matchedIndustry: string;
  values: BenchmarkBaseline;
  sourceInfo: SourceInfo[];
};

const sectorAliases: Record<string, string[]> = {
  comercio: ["comercio", "varejo", "atacado", "ecommerce", "loja"],
  servicos: ["servico", "consultoria", "agencia", "escritorio"],
  industria: ["industria", "fabrica", "manufatura", "metalurgica", "textil"],
  tecnologia: ["tecnologia", "software", "ti", "saas", "dados", "startup"],
  saude: ["saude", "clinica", "hospital", "medico", "odonto", "laboratorio"],
  agronegocio: ["agro", "agric", "pecu", "rural"],
  construcao: ["construcao", "engenharia", "obra", "imobili"],
  transporte: ["transporte", "logistica", "frete", "entrega"],
  educacao: ["educacao", "escola", "ensino", "curso", "faculdade"],
};

const normalizeText = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const matchSector = (businessSector: string) => {
  const normalized = normalizeText(businessSector);

  for (const [sector, aliases] of Object.entries(sectorAliases)) {
    if (aliases.some((alias) => normalized.includes(alias))) {
      return sector;
    }
  }

  return "default";
};

const displayLabelBySector: Record<string, string> = {
  comercio: "Comércio",
  servicos: "Serviços",
  industria: "Indústria",
  tecnologia: "Tecnologia",
  saude: "Saúde",
  agronegocio: "Agronegócio",
  construcao: "Construção",
  transporte: "Transporte",
  educacao: "Educação",
  default: "Multissetorial",
};

const ibgeActivityKeywordsBySector: Record<string, string[]> = {
  servicos: [
    "serviços profissionais",
    "serviços prestados às famílias",
    "serviços técnico-profissionais",
    "serviços",
  ],
  tecnologia: [
    "tecnologia da informação",
    "serviços de informação e comunicação",
    "telecomunicações",
    "agências de notícias",
  ],
  transporte: [
    "transporte",
    "logística",
    "armazenamento",
    "entrega",
    "correio",
  ],
  educacao: ["ensino continuado", "ensino"],
  saude: ["serviços técnico-profissionais", "serviços"],
  default: ["total"],
};

const round1 = (value: number) => Math.round(value * 10) / 10;
const round2 = (value: number) => Math.round(value * 100) / 100;

const cacheTtlMs = 1000 * 60 * 60 * 12;
let marketDataCache: {
  expiresAt: number;
  data: {
    activities: IbgeActivityMetrics[];
    taxRate: number;
    sourceInfo: SourceInfo[];
  };
} | null = null;

const parseNumericValue = (value: string) => {
  const normalized = value.replace(/\./g, "").replace(",", ".").trim();
  const parsed = Number(normalized);
  if (!Number.isFinite(parsed)) {
    return null;
  }
  return parsed;
};

const calculateRate = (numerator: number, denominator: number) => {
  if (denominator <= 0) {
    return 0;
  }
  return round1((numerator / denominator) * 100);
};

const pickMarketActivity = (
  matchedSector: string,
  activities: IbgeActivityMetrics[],
) => {
  const preferredKeywords = ibgeActivityKeywordsBySector[matchedSector] ?? [];
  const fallbackKeywords = ibgeActivityKeywordsBySector.default;
  const orderedKeywords = [...preferredKeywords, ...fallbackKeywords];

  const ranked = activities.map((activity) => {
    const normalizedName = normalizeText(activity.activityName);
    const score = orderedKeywords.reduce((acc, keyword, index) => {
      if (!normalizedName.includes(normalizeText(keyword))) {
        return acc;
      }
      return acc + (orderedKeywords.length - index);
    }, 0);

    return {
      activity,
      score,
    };
  });

  ranked.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return b.activity.margin - a.activity.margin;
  });

  return ranked[0]?.activity ?? null;
};

const buildMarketBaseline = async (
  businessSector: string,
): Promise<RealMarketBaseline> => {
  if (marketDataCache && marketDataCache.expiresAt > Date.now()) {
    const matchedSector = matchSector(businessSector);
    const matchedActivity = pickMarketActivity(
      matchedSector,
      marketDataCache.data.activities,
    );

    if (!matchedActivity) {
      throw new Error("Não foi possível obter benchmark do setor no IBGE");
    }

    return {
      matchedSector,
      matchedIndustry: matchedActivity.activityName,
      values: {
        taxRate: marketDataCache.data.taxRate,
        payrollRate: matchedActivity.payrollRate,
        margin: matchedActivity.margin,
      },
      sourceInfo: marketDataCache.data.sourceInfo,
    };
  }

  const ibgeUrl =
    "https://apisidra.ibge.gov.br/values/t/2577/n1/1/v/643,673,1242/p/last%201/c12355/all";
  const worldBankUrl =
    "https://api.worldbank.org/v2/country/BRA/indicator/GC.TAX.TOTL.GD.ZS?format=json&per_page=60";

  const [ibgeResponse, worldBankResponse] = await Promise.all([
    fetch(ibgeUrl),
    fetch(worldBankUrl),
  ]);

  if (!ibgeResponse.ok || !worldBankResponse.ok) {
    throw new Error("Falha ao consultar fontes brasileiras de benchmark");
  }

  const ibgeRows = (await ibgeResponse.json()) as Array<Record<string, string>>;
  const worldBankPayload = (await worldBankResponse.json()) as [
    unknown,
    Array<{ date: string; value: number | null }>,
  ];

  const groupedByActivity: Record<
    string,
    {
      activityCode: string;
      activityName: string;
      revenue: number | null;
      payroll: number | null;
      addedValue: number | null;
    }
  > = {};

  for (const row of ibgeRows.slice(1)) {
    const activityCode = row.D4C;
    const activityName = row.D4N;
    const variableCode = row.D2C;
    const value = parseNumericValue(row.V);

    if (!activityCode || !activityName || !variableCode || value === null) {
      continue;
    }

    if (!groupedByActivity[activityCode]) {
      groupedByActivity[activityCode] = {
        activityCode,
        activityName,
        revenue: null,
        payroll: null,
        addedValue: null,
      };
    }

    if (variableCode === "643") {
      groupedByActivity[activityCode].revenue = value;
    }
    if (variableCode === "673") {
      groupedByActivity[activityCode].payroll = value;
    }
    if (variableCode === "1242") {
      groupedByActivity[activityCode].addedValue = value;
    }
  }

  const activities = Object.values(groupedByActivity)
    .filter((entry) => {
      return (
        entry.revenue !== null &&
        entry.revenue > 0 &&
        entry.payroll !== null &&
        entry.addedValue !== null
      );
    })
    .map((entry) => {
      const revenue = entry.revenue ?? 0;
      const payroll = entry.payroll ?? 0;
      const addedValue = entry.addedValue ?? 0;
      return {
        activityCode: entry.activityCode,
        activityName: entry.activityName,
        payrollRate: calculateRate(payroll, revenue),
        margin: calculateRate(addedValue, revenue),
      };
    });

  const matchedSector = matchSector(businessSector);
  const matchedActivity = pickMarketActivity(matchedSector, activities);

  if (!matchedActivity) {
    throw new Error("Não foi possível obter benchmark do setor no IBGE");
  }

  const worldBankValues = worldBankPayload[1] ?? [];
  const latestTaxObservation = worldBankValues.find(
    (item) => item.value !== null && Number.isFinite(item.value),
  );

  if (!latestTaxObservation || latestTaxObservation.value === null) {
    throw new Error("Não foi possível obter carga tributária do Brasil");
  }

  const period = ibgeRows[1]?.D3N ?? null;
  const sourceInfo: SourceInfo[] = [
    {
      url: "https://sidra.ibge.gov.br/tabela/2577",
      dataset:
        "IBGE SIDRA 2577 - Receita operacional, valor adicionado e salários",
      updatedAt: period,
    },
    {
      url: worldBankUrl,
      dataset: "Banco Mundial - Tax revenue (% of GDP) para o Brasil",
      updatedAt: latestTaxObservation.date,
    },
  ];

  const taxRate = round2(latestTaxObservation.value);

  marketDataCache = {
    data: {
      activities,
      taxRate,
      sourceInfo,
    },
    expiresAt: Date.now() + cacheTtlMs,
  };

  return {
    matchedSector,
    matchedIndustry: matchedActivity.activityName,
    values: {
      taxRate,
      payrollRate: matchedActivity.payrollRate,
      margin: matchedActivity.margin,
    },
    sourceInfo,
  };
};

const buildBenchmark = (
  effectiveTaxRate: number,
  payrollRate: number,
  operationalMargin: number,
  marketBaseline: BenchmarkBaseline,
): BenchmarkResult => {
  return {
    taxRateCompany: effectiveTaxRate,
    taxRateMarket: marketBaseline.taxRate,
    payrollRateCompany: payrollRate,
    payrollRateMarket: marketBaseline.payrollRate,
    marginCompany: operationalMargin,
    marginMarket: marketBaseline.margin,
  };
};

export const marketBenchmarkService = {
  async recalculateByAnalysisId(analysisId: string) {
    const analysis = await prisma.analysis.findUnique({
      where: { id: analysisId },
      include: {
        company: true,
        financialMetrics: true,
      },
    });

    if (!analysis || !analysis.financialMetrics) {
      return null;
    }

    const marketBaseline = await buildMarketBaseline(
      analysis.company.businessSector,
    );
    const benchmark = buildBenchmark(
      analysis.financialMetrics.effectiveTaxRate,
      analysis.financialMetrics.payrollRate,
      analysis.financialMetrics.operationalMargin,
      marketBaseline.values,
    );

    return prisma.marketBenchmark.upsert({
      where: { analysisId: analysis.id },
      update: {
        sectorReference: `${displayLabelBySector[marketBaseline.matchedSector]} • ${marketBaseline.matchedIndustry}`,
        taxRateCompany: benchmark.taxRateCompany,
        taxRateMarket: benchmark.taxRateMarket,
        payrollRateCompany: benchmark.payrollRateCompany,
        payrollRateMarket: benchmark.payrollRateMarket,
        marginCompany: benchmark.marginCompany,
        marginMarket: benchmark.marginMarket,
        dataset: {
          taxRate: {
            company: benchmark.taxRateCompany,
            market: benchmark.taxRateMarket,
          },
          payrollRate: {
            company: benchmark.payrollRateCompany,
            market: benchmark.payrollRateMarket,
          },
          margin: {
            company: benchmark.marginCompany,
            market: benchmark.marginMarket,
          },
          metadata: {
            methodology: "ibge-sidra-2577-plus-brazil-tax-revenue",
            source: "IBGE SIDRA + Banco Mundial (Brasil)",
            matchedSector: marketBaseline.matchedSector,
            matchedIndustry: marketBaseline.matchedIndustry,
            inputSector: analysis.company.businessSector,
            inputCompanySize: analysis.company.companySize,
            sources: marketBaseline.sourceInfo,
          },
        },
      },
      create: {
        analysisId: analysis.id,
        sectorReference: `${displayLabelBySector[marketBaseline.matchedSector]} • ${marketBaseline.matchedIndustry}`,
        taxRateCompany: benchmark.taxRateCompany,
        taxRateMarket: benchmark.taxRateMarket,
        payrollRateCompany: benchmark.payrollRateCompany,
        payrollRateMarket: benchmark.payrollRateMarket,
        marginCompany: benchmark.marginCompany,
        marginMarket: benchmark.marginMarket,
        dataset: {
          taxRate: {
            company: benchmark.taxRateCompany,
            market: benchmark.taxRateMarket,
          },
          payrollRate: {
            company: benchmark.payrollRateCompany,
            market: benchmark.payrollRateMarket,
          },
          margin: {
            company: benchmark.marginCompany,
            market: benchmark.marginMarket,
          },
          metadata: {
            methodology: "ibge-sidra-2577-plus-brazil-tax-revenue",
            source: "IBGE SIDRA + Banco Mundial (Brasil)",
            matchedSector: marketBaseline.matchedSector,
            matchedIndustry: marketBaseline.matchedIndustry,
            inputSector: analysis.company.businessSector,
            inputCompanySize: analysis.company.companySize,
            sources: marketBaseline.sourceInfo,
          },
        },
      },
    });
  },

  async getByAnalysisId(analysisId: string) {
    return prisma.marketBenchmark.findUnique({
      where: { analysisId },
    });
  },
};
