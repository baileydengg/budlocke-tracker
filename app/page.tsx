"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [title, setTitle] = useState("");
  const [game, setGame] = useState("FireRed / LeafGreen");
  const router = useRouter();

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Generate a random unique string ID (e.g., "a8f9-4b2c")
    const uniqueId = Math.random().toString(36).substring(2, 10);

    // 2. Redirect the user to their unique nuzlocke session URL
    router.push(`/nuzlocke/${uniqueId}`);
  };

  return (
    <main className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-700">
        <h1 className="text-3xl font-extrabold text-center text-red-500 mb-2">
          Soul Link Tracker
        </h1>
        <p className="text-slate-400 text-sm text-center mb-6">
          Track paired encounters across your co-op Nuzlocke runs.
        </p>

        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs text-slate-300 font-semibold mb-1">
              Session Title
            </label>
            <input
              type="text"
              placeholder="e.g. Ash & Red's Wedlocke"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-300 font-semibold mb-1">
              Select Game
            </label>
            <select
              value={game}
              onChange={(e) => setGame(e.target.value)}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-red-500"
            >
              <option value="FireRed / LeafGreen">FireRed / LeafGreen</option>
              <option value="HeartGold / SoulSilver">HeartGold / SoulSilver</option>
              <option value="Emerald">Emerald</option>
              <option value="Platinum">Platinum</option>
              <option value="Scarlet / Violet">Scarlet / Violet</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-4 rounded-lg transition"
          >
            Create New Nuzlocke
          </button>
        </form>
      </div>
    </main>
  );
}