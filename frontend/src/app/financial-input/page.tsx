"use client";

import { FormEvent, Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createAnalysisAction } from "@/store/analysis/actions";
import {
  selectAnalysisError,
  selectAnalysisLoading,
} from "@/store/analysis/selectors";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const formatCurrencyInput = (value: string) => {
  const digitsOnly = value.replace(/\D/g, "");

  if (!digitsOnly) {
    return "";
  }

  return new Intl.NumberFormat("pt-BR").format(Number(digitsOnly));
};

const parseCurrencyInput = (value: string) => {
  const digitsOnly = value.replace(/\D/g, "");

  if (!digitsOnly) {
    return 0;
  }

  return Number(digitsOnly);
};

export default function FinancialInputPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto min-h-screen w-full max-w-3xl p-6">
          Carregando...
        </main>
      }
    >
      <FinancialInputContent />
    </Suspense>
  );
}

function FinancialInputContent() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const loading = useAppSelector(selectAnalysisLoading);
  const error = useAppSelector(selectAnalysisError);
  const companyId = useMemo(
    () => searchParams.get("companyId") ?? "",
    [searchParams],
  );
  const [form, setForm] = useState({
    monthlyRevenue: "",
    employeesCount: "",
    payrollAmount: "",
    taxesPaidAmount: "",
    operationalCostsAmount: "",
  });

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const actionResult = await dispatch(
      createAnalysisAction({
        companyId,
        monthlyRevenue: parseCurrencyInput(form.monthlyRevenue),
        employeesCount: Number(form.employeesCount),
        payrollAmount: parseCurrencyInput(form.payrollAmount),
        taxesPaidAmount: parseCurrencyInput(form.taxesPaidAmount),
        operationalCostsAmount: parseCurrencyInput(form.operationalCostsAmount),
      }),
    );

    if (createAnalysisAction.fulfilled.match(actionResult)) {
      router.push(`/results/${actionResult.payload.id}`);
    }
  };

  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl p-6">
      <section className="liquid-glass rounded-3xl p-8">
        <h1 className="mb-2 text-2xl font-bold">Dados financeiros</h1>
        <p className="mb-8 text-zinc-700 dark:text-zinc-300">
          Preencha os indicadores para gerar a análise completa.
        </p>
        <form className="grid gap-4" onSubmit={onSubmit}>
          <div className="relative">
            <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-zinc-500">
              R$
            </span>
            <Input
              placeholder="Faturamento mensal"
              type="text"
              inputMode="numeric"
              className="pl-10"
              value={form.monthlyRevenue}
              onChange={(event) =>
                setForm((state) => ({
                  ...state,
                  monthlyRevenue: formatCurrencyInput(event.target.value),
                }))
              }
              required
            />
          </div>
          <Input
            placeholder="Número de funcionários"
            type="number"
            min="0"
            step="1"
            value={form.employeesCount}
            onChange={(event) =>
              setForm((state) => ({
                ...state,
                employeesCount: event.target.value,
              }))
            }
            required
          />
          <div className="relative">
            <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-zinc-500">
              R$
            </span>
            <Input
              placeholder="Folha salarial"
              type="text"
              inputMode="numeric"
              className="pl-10"
              value={form.payrollAmount}
              onChange={(event) =>
                setForm((state) => ({
                  ...state,
                  payrollAmount: formatCurrencyInput(event.target.value),
                }))
              }
              required
            />
          </div>
          <div className="relative">
            <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-zinc-500">
              R$
            </span>
            <Input
              placeholder="Impostos pagos"
              type="text"
              inputMode="numeric"
              className="pl-10"
              value={form.taxesPaidAmount}
              onChange={(event) =>
                setForm((state) => ({
                  ...state,
                  taxesPaidAmount: formatCurrencyInput(event.target.value),
                }))
              }
              required
            />
          </div>
          <div className="relative">
            <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-zinc-500">
              R$
            </span>
            <Input
              placeholder="Custos operacionais"
              type="text"
              inputMode="numeric"
              className="pl-10"
              value={form.operationalCostsAmount}
              onChange={(event) =>
                setForm((state) => ({
                  ...state,
                  operationalCostsAmount: formatCurrencyInput(
                    event.target.value,
                  ),
                }))
              }
              required
            />
          </div>
          <Button
            type="submit"
            className="mt-2"
            disabled={loading || !companyId}
          >
            {loading ? "Gerando..." : "Gerar diagnóstico"}
          </Button>
        </form>
      </section>
    </main>
  );
}
