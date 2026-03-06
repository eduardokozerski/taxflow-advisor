"use client";

import { FormEvent, Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createAnalysisAction } from "@/store/analysis/actions";
import { selectAnalysisError, selectAnalysisLoading } from "@/store/analysis/selectors";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function FinancialInputPage() {
  return (
    <Suspense fallback={<main className="mx-auto min-h-screen w-full max-w-3xl p-6">Carregando...</main>}>
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
  const companyId = useMemo(() => searchParams.get("companyId") ?? "", [searchParams]);
  const [form, setForm] = useState({
    monthlyRevenue: "",
    employeesCount: "",
    payrollAmount: "",
    taxesPaidAmount: "",
    operationalCostsAmount: ""
  });

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const actionResult = await dispatch(
      createAnalysisAction({
        companyId,
        monthlyRevenue: Number(form.monthlyRevenue),
        employeesCount: Number(form.employeesCount),
        payrollAmount: Number(form.payrollAmount),
        taxesPaidAmount: Number(form.taxesPaidAmount),
        operationalCostsAmount: Number(form.operationalCostsAmount)
      })
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
          <Input
            placeholder="Faturamento mensal"
            type="number"
            min="0"
            step="0.01"
            value={form.monthlyRevenue}
            onChange={(event) => setForm((state) => ({ ...state, monthlyRevenue: event.target.value }))}
            required
          />
          <Input
            placeholder="Número de funcionários"
            type="number"
            min="0"
            step="1"
            value={form.employeesCount}
            onChange={(event) => setForm((state) => ({ ...state, employeesCount: event.target.value }))}
            required
          />
          <Input
            placeholder="Folha salarial"
            type="number"
            min="0"
            step="0.01"
            value={form.payrollAmount}
            onChange={(event) => setForm((state) => ({ ...state, payrollAmount: event.target.value }))}
            required
          />
          <Input
            placeholder="Impostos pagos"
            type="number"
            min="0"
            step="0.01"
            value={form.taxesPaidAmount}
            onChange={(event) => setForm((state) => ({ ...state, taxesPaidAmount: event.target.value }))}
            required
          />
          <Input
            placeholder="Custos operacionais"
            type="number"
            min="0"
            step="0.01"
            value={form.operationalCostsAmount}
            onChange={(event) => setForm((state) => ({ ...state, operationalCostsAmount: event.target.value }))}
            required
          />
          {error ? <p className="text-sm text-red-300">{error}</p> : null}
          <Button type="submit" className="mt-2" disabled={loading || !companyId}>
            {loading ? "Gerando..." : "Gerar diagnóstico"}
          </Button>
        </form>
      </section>
    </main>
  );
}
