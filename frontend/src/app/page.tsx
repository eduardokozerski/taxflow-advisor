import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl items-center justify-center p-6">
      <section className="liquid-glass w-full rounded-3xl p-8">
        <h1 className="mb-3 text-3xl font-bold">TaxFlow Advisor</h1>
        <p className="mb-8 text-base text-zinc-700 dark:text-zinc-300">
          Inicie o diagnóstico empresarial e fiscal da sua empresa.
        </p>
        <Link
          href="/qualification"
          className="liquid-button-strong inline-flex rounded-xl px-5 py-3 font-medium no-underline"
        >
          Iniciar análise
        </Link>
      </section>
    </main>
  );
}
