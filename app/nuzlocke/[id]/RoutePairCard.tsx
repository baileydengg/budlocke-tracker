"use client";

import { useState } from "react";

interface RoutePairCardProps {
  routeName: string;
}

export default function RoutePairCard({ routeName }: RoutePairCardProps) {
  const [status, setStatus] = useState<"ALIVE" | "DEAD" | "BOXED">("ALIVE");

  // Player 1 state
  const [p1Name, setP1Name] = useState("");
  const [p1Sprite, setP1Sprite] = useState<string | null>(null);

  // Player 2 state
  const [p2Name, setP2Name] = useState("");
  const [p2Sprite, setP2Sprite] = useState<string | null>(null);

  // Helper to fetch sprite from PokeAPI
  const fetchSprite = async (name: string, setSprite: (url: string | null) => void) => {
    if (!name.trim()) return;
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase().trim()}`);
      if (res.ok) {
        const data = await res.json();
        setSprite(data.sprites.front_default);
      } else {
        setSprite(null);
      }
    } catch {
      setSprite(null);
    }
  };

  return (
    <div
      className={`border rounded-xl p-4 transition-all ${
        status === "DEAD"
          ? "bg-slate-900/60 border-red-900/50 grayscale"
          : "bg-slate-800 border-slate-700"
      }`}
    >
      {/* Top Header Row */}
      <div className="flex justify-between items-center mb-4">
        <span className="font-bold text-slate-200">{routeName}</span>

        {/* Status Toggle Buttons */}
        <div className="flex gap-1 text-xs">
          {(["ALIVE", "BOXED", "DEAD"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`px-2.5 py-1 rounded font-semibold transition ${
                status === s
                  ? s === "ALIVE"
                    ? "bg-emerald-600 text-white"
                    : s === "DEAD"
                    ? "bg-red-600 text-white"
                    : "bg-amber-600 text-white"
                  : "bg-slate-900 text-slate-400 hover:text-white"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Linked Players Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Player 1 Card */}
        <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 flex items-center gap-3">
          <div className="w-16 h-16 bg-slate-950 rounded flex items-center justify-center border border-slate-800 shrink-0">
            {p1Sprite ? (
              <img src={p1Sprite} alt={p1Name} className="w-14 h-14 object-contain" />
            ) : (
              <span className="text-[10px] text-slate-600 uppercase font-bold">No Sprite</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Player 1</p>
            <input
              type="text"
              placeholder="e.g. bulbasaur"
              value={p1Name}
              onChange={(e) => setP1Name(e.target.value)}
              onBlur={() => fetchSprite(p1Name, setP1Sprite)}
              className="w-full bg-slate-950 border border-slate-800 text-sm px-2 py-1 rounded text-slate-200 focus:outline-none focus:border-red-500"
            />
          </div>
        </div>

        {/* Player 2 Card */}
        <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 flex items-center gap-3">
          <div className="w-16 h-16 bg-slate-950 rounded flex items-center justify-center border border-slate-800 shrink-0">
            {p2Sprite ? (
              <img src={p2Sprite} alt={p2Name} className="w-14 h-14 object-contain" />
            ) : (
              <span className="text-[10px] text-slate-600 uppercase font-bold">No Sprite</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Player 2</p>
            <input
              type="text"
              placeholder="e.g. charmander"
              value={p2Name}
              onChange={(e) => setP2Name(e.target.value)}
              onBlur={() => fetchSprite(p2Name, setP2Sprite)}
              className="w-full bg-slate-950 border border-slate-800 text-sm px-2 py-1 rounded text-slate-200 focus:outline-none focus:border-red-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}