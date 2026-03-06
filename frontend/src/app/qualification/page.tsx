"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createCompanyAction } from "@/store/company/actions";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectCompanyError,
  selectCompanyLoading,
} from "@/store/company/selectors";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function QualificationPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const loading = useAppSelector(selectCompanyLoading);
  const error = useAppSelector(selectCompanyError);
  const [form, setForm] = useState({
    legalName: "",
    businessSector: "",
    companySize: "",
  });

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const actionResult = await dispatch(createCompanyAction(form));

    if (createCompanyAction.fulfilled.match(actionResult)) {
      router.push(`/financial-input?companyId=${actionResult.payload.id}`);
    }
  };

  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl p-6">
      <section className="liquid-glass rounded-3xl p-8">
        <h1 className="mb-2 text-2xl font-bold">Qualificação da empresa</h1>
        <p className="mb-8 text-zinc-700 dark:text-zinc-300">
          Informe os dados cadastrais para iniciar o diagnóstico.
        </p>
        <form className="grid gap-4" onSubmit={onSubmit}>
          <Input
            placeholder="Razão social"
            value={form.legalName}
            onChange={(event) =>
              setForm((state) => ({ ...state, legalName: event.target.value }))
            }
            required
          />
          <Input
            placeholder="Setor de atuação"
            value={form.businessSector}
            onChange={(event) =>
              setForm((state) => ({
                ...state,
                businessSector: event.target.value,
              }))
            }
            required
          />
          <Input
            placeholder="Porte da empresa"
            value={form.companySize}
            onChange={(event) =>
              setForm((state) => ({
                ...state,
                companySize: event.target.value,
              }))
            }
            required
          />
          {error ? <p className="text-sm text-red-300">{error}</p> : null}
          <Button type="submit" className="mt-2" disabled={loading}>
            {loading ? "Salvando..." : "Continuar"}
          </Button>
        </form>
      </section>
    </main>
  );
}
