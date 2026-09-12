import RoutePairCard from "./RoutePairCard";

const SAMPLE_ROUTES = [
  "Pallet Town",
  "Route 1",
  "Viridian Forest",
  "Route 22",
  "Pewter City",
];

export default async function NuzlockeTrackerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-slate-900 text-white p-6 max-w-4xl mx-auto">
      <header className="flex justify-between items-center border-b border-slate-700 pb-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-red-500">Soul Link Session</h1>
          <p className="text-xs text-slate-400">
            Unique Link ID:{" "}
            <span className="text-yellow-400 font-mono">{id}</span>
          </p>
        </div>
        <div className="bg-slate-800 px-3 py-1.5 rounded text-xs text-slate-300 border border-slate-700">
          Share this URL with your partner!
        </div>
      </header>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-200">
          Encounter Routes
        </h2>
        <div className="space-y-4">
          {SAMPLE_ROUTES.map((route) => (
            <RoutePairCard key={route} routeName={route} />
          ))}
        </div>
      </section>
    </main>
  );
}
