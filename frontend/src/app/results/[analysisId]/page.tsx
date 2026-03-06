"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import {
  getAnalysisByIdAction,
  recalculateAnalysisByIdAction,
} from "@/store/analysis/actions";
import {
  selectAnalysisError,
  selectAnalysisLoading,
  selectAnalysisRecalculateLoading,
  selectCurrentAnalysis,
} from "@/store/analysis/selectors";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { MarketComparisonChart } from "@/components/marketComparisonChart";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const percentFormatter = new Intl.NumberFormat("pt-BR", {
  maximumFractionDigits: 2,
});

const formatTaxRegime = (regime: string) => {
  const labels: Record<string, string> = {
    simplesNacional: "Simples Nacional",
    lucroPresumido: "Lucro Presumido",
    lucroReal: "Lucro Real",
  };

  return labels[regime] ?? regime;
};

export default function ResultsPage() {
  const dispatch = useAppDispatch();
  const params = useParams<{ analysisId: string }>();
  const analysis = useAppSelector(selectCurrentAnalysis);
  const loading = useAppSelector(selectAnalysisLoading);
  const recalculateLoading = useAppSelector(selectAnalysisRecalculateLoading);
  const error = useAppSelector(selectAnalysisError);

  useEffect(() => {
    if (params.analysisId) {
      void dispatch(getAnalysisByIdAction(params.analysisId));
    }
  }, [dispatch, params.analysisId]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const onRecalculateAnalysis = async () => {
    if (!params.analysisId) {
      return;
    }

    await dispatch(recalculateAnalysisByIdAction(params.analysisId));
  };

  const onDownloadReport = () => {
    const filePath = analysis?.report?.filePath;

    if (!filePath) {
      toast.error("Relatório indisponível no momento");
      return;
    }

    window.open(filePath, "_blank", "noopener,noreferrer");
  };

  const benchmarkSources =
    analysis?.marketBenchmark?.dataset?.metadata?.sources;
  const benchmarkSourceLabel =
    analysis?.marketBenchmark?.dataset?.metadata?.source;

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl p-6">
      <section className="liquid-glass rounded-3xl p-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">Resultado do diagnóstico</h1>
            <p className="text-zinc-700 dark:text-zinc-300">
              Comparativo fiscal e financeiro da empresa.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onRecalculateAnalysis}
              disabled={recalculateLoading}
            >
              {recalculateLoading ? "Reprocessando..." : "Reprocessar análise"}
            </Button>
            <Link href="/qualification" className="no-underline">
              <Button variant="outline">Nova análise</Button>
            </Link>
          </div>
        </div>

        {loading ? <p>Carregando análise...</p> : null}

        {analysis ? (
          <div className="grid gap-6">
            <div className="grid gap-4 md:grid-cols-3">
              <article className="liquid-chip rounded-2xl p-4">
                <p className="text-sm">Score de eficiência</p>
                <p className="text-2xl font-bold">
                  {analysis.scoreResult?.scoreValue ?? 0}
                </p>
                <p className="text-sm uppercase">
                  {analysis.scoreResult?.classification ?? "-"}
                </p>
              </article>
              <article className="liquid-chip rounded-2xl p-4">
                <p className="text-sm">Carga tributária</p>
                <p className="text-2xl font-bold">
                  {percentFormatter.format(
                    analysis.financialMetrics?.effectiveTaxRate ?? 0,
                  )}
                  %
                </p>
              </article>
              <article className="liquid-chip rounded-2xl p-4">
                <p className="text-sm">Margem operacional</p>
                <p className="text-2xl font-bold">
                  {percentFormatter.format(
                    analysis.financialMetrics?.operationalMargin ?? 0,
                  )}
                  %
                </p>
              </article>
            </div>

            <section className="liquid-glass rounded-2xl p-5">
              <h2 className="mb-4 text-xl font-semibold">
                Comparativo com mercado
              </h2>
              {analysis.marketBenchmark ? (
                <MarketComparisonChart benchmark={analysis.marketBenchmark} />
              ) : null}
            </section>

            <section className="grid gap-4 lg:grid-cols-2">
              <article className="liquid-glass rounded-2xl p-5">
                <h2 className="mb-3 text-lg font-semibold">
                  Simulação tributária
                </h2>
                <div className="grid gap-3">
                  {analysis.taxSimulations.map((item) => (
                    <div
                      key={item.regime}
                      className="liquid-chip rounded-xl p-3"
                    >
                      <p className="font-medium">
                        {formatTaxRegime(item.regime)}
                      </p>
                      <p>
                        Alíquota estimada: {item.rateMin}% - {item.rateMax}%
                      </p>
                      <p>
                        Imposto mensal:{" "}
                        {currencyFormatter.format(item.monthlyTaxEstimate)}
                      </p>
                    </div>
                  ))}
                </div>
                {benchmarkSources && benchmarkSources.length > 0 ? (
                  <div className="mt-4 grid gap-2 rounded-xl border border-zinc-200/50 p-3 text-sm dark:border-zinc-700/50">
                    <p className="font-medium">
                      Fonte de dados de mercado:{" "}
                      {benchmarkSourceLabel ?? "Base externa"}
                    </p>
                    {benchmarkSources.map((source) => (
                      <a
                        key={source.url}
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline decoration-zinc-400 underline-offset-2"
                      >
                        {source.dataset}
                        {source.updatedAt ? ` (${source.updatedAt})` : ""}
                      </a>
                    ))}
                  </div>
                ) : null}
              </article>

              <article className="liquid-glass rounded-2xl p-5">
                <h2 className="mb-3 text-lg font-semibold">
                  Serviços recomendados
                </h2>
                <div className="grid gap-2">
                  {(analysis.recommendedServices ?? []).map((service) => (
                    <span
                      key={service}
                      className="liquid-chip inline-flex rounded-xl px-3 py-2"
                    >
                      {service}
                    </span>
                  ))}
                </div>
                <div className="mt-5">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onDownloadReport}
                    disabled={!analysis.report?.filePath}
                  >
                    Baixar relatório
                  </Button>
                </div>
              </article>
            </section>
          </div>
        ) : null}
      </section>
    </main>
  );
}
