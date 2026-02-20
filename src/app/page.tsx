export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 px-6 py-16">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-widest text-slate-500">Quem Votar</p>
        <h1 className="text-3xl font-semibold text-slate-900">
          Compatibilidade politica, sem pedido de voto.
        </h1>
        <p className="text-sm text-slate-600">
          Esta e a base tecnica do MVP. O fluxo do eleitor e do candidato sera
          implementado nas proximas fases.
        </p>
      </header>
      <section className="rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-medium text-slate-900">Proximo passo</h2>
        <p className="mt-2 text-sm text-slate-600">
          Configure o banco, rode as migracoes e habilite o onboarding.
        </p>
      </section>
    </main>
  );
}
