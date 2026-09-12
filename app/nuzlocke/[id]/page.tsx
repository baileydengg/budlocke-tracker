import { db } from "@/db";
import { sessions, pairs, pokemons } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import RoutePairCard from "./RoutePairCard";

export default async function NuzlockeTrackerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session = await db.query.sessions.findFirst({
    where: eq(sessions.id, id),
  });

  if (!session) {
    notFound();
  }

  // Fetch pairs and include nested pokemons
  const sessionPairs = await db.query.pairs.findMany({
    where: eq(pairs.sessionId, id),
    with: {
      pokemons: true,
    },
  });

  return (
    <main className="min-h-screen bg-slate-900 text-white p-6 max-w-4xl mx-auto">
      <header className="flex justify-between items-center border-b border-slate-700 pb-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-red-500">{session.title}</h1>
          <p className="text-xs text-slate-400">
            Game:{" "}
            <span className="text-slate-200 font-semibold">{session.game}</span>{" "}
            • ID:{" "}
            <span className="text-yellow-400 font-mono">{session.id}</span>
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
          {sessionPairs.map((pair) => (
            <RoutePairCard
              key={pair.id}
              pairId={pair.id}
              routeName={pair.routeName}
              initialStatus={pair.status as "ALIVE" | "DEAD" | "BOXED"}
              initialPokemons={pair.pokemons}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
