"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createCompanyAction } from "@/store/company/actions";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectCompanyError,
  selectCompanyLoading,
} from "@/store/company/selectors";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const companySizeOptions = ["Micro", "Pequena", "Média", "Grande"] as const;
const businessSectorOptions = [
  "Comércio",
  "Serviços",
  "Indústria",
  "Tecnologia",
  "Saúde",
  "Agronegócio",
  "Construção",
  "Transporte",
  "Educação",
  "Outro",
] as const;

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

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

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
          <select
            value={form.businessSector}
            onChange={(event) =>
              setForm((state) => ({
                ...state,
                businessSector: event.target.value,
              }))
            }
            className="h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40"
            required
          >
            <option value="" disabled>
              Selecione o setor de atuação
            </option>
            {businessSectorOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <select
            value={form.companySize}
            onChange={(event) =>
              setForm((state) => ({
                ...state,
                companySize: event.target.value,
              }))
            }
            className="h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40"
            required
          >
            <option value="" disabled>
              Selecione o porte da empresa
            </option>
            {companySizeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <Button type="submit" className="mt-2" disabled={loading}>
            {loading ? "Salvando..." : "Continuar"}
          </Button>
        </form>
      </section>
    </main>
  );
}
