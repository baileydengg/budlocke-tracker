"use client";

import { useState } from "react";
import { updatePairStatus, savePokemon } from "@/app/actions/nuzlocke";

interface PokemonData {
  playerIndex: number;
  species: string;
  nickname: string;
  types: string;
  spriteUrl: string;
}

interface RoutePairCardProps {
  pairId: string;
  routeName: string;
  initialStatus: "ALIVE" | "DEAD" | "BOXED";
  initialPokemons?: PokemonData[];
}

export default function RoutePairCard({
  pairId,
  routeName,
  initialStatus,
  initialPokemons = [],
}: RoutePairCardProps) {
  const [status, setStatus] = useState<"ALIVE" | "DEAD" | "BOXED">(initialStatus);

  const initialP1 = initialPokemons.find((p) => p.playerIndex === 0);
  const initialP2 = initialPokemons.find((p) => p.playerIndex === 1);

  // Player 1 state
  const [p1Species, setP1Species] = useState(initialP1?.species || "");
  const [p1Nickname, setP1Nickname] = useState(initialP1?.nickname || "");
  const [p1Types, setP1Types] = useState<string[]>(initialP1?.types ? initialP1.types.split(",") : []);
  const [p1Sprite, setP1Sprite] = useState<string | null>(initialP1?.spriteUrl || null);

  // Player 2 state
  const [p2Species, setP2Species] = useState(initialP2?.species || "");
  const [p2Nickname, setP2Nickname] = useState(initialP2?.nickname || "");
  const [p2Types, setP2Types] = useState<string[]>(initialP2?.types ? initialP2.types.split(",") : []);
  const [p2Sprite, setP2Sprite] = useState<string | null>(initialP2?.spriteUrl || null);

  const handleStatusChange = async (newStatus: "ALIVE" | "DEAD" | "BOXED") => {
    setStatus(newStatus);
    await updatePairStatus(pairId, newStatus);
  };

  const handleFetchAndSave = async (
    playerIndex: number,
    species: string,
    nickname: string,
    currentTypes: string[],
    setSprite: (url: string | null) => void,
    setTypes: (types: string[]) => void
  ) => {
    if (!species.trim()) return;

    let spriteUrl = "";
    let fetchedTypes = currentTypes;

    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${species.toLowerCase().trim()}`);
      if (res.ok) {
        const data = await res.json();
        spriteUrl = data.sprites.front_default || "";
        fetchedTypes = data.types.map((t: { type: { name: string } }) => t.type.name);
        setSprite(spriteUrl);
        setTypes(fetchedTypes);
      }
    } catch {
      // Keep existing values on error
    }

    await savePokemon(
      pairId,
      playerIndex,
      species,
      nickname,
      fetchedTypes.join(","),
      spriteUrl
    );
  };

  return (
    <div
      className={`border rounded-xl p-4 transition-all ${
        status === "DEAD"
          ? "bg-slate-900/60 border-red-900/50 grayscale"
          : "bg-slate-800 border-slate-700"
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <span className="font-bold text-slate-200">{routeName}</span>
        <div className="flex gap-1 text-xs">
          {(["ALIVE", "BOXED", "DEAD"] as const).map((s) => (
            <button
              key={s}
              onClick={() => handleStatusChange(s)}
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Player 1 Card */}
        <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 flex items-center gap-3">
          <div className="w-16 h-16 bg-slate-950 rounded flex flex-col items-center justify-center border border-slate-800 shrink-0">
            {p1Sprite ? (
              <img src={p1Sprite} alt={p1Species} className="w-14 h-14 object-contain" />
            ) : (
              <span className="text-[10px] text-slate-600 uppercase font-bold">No Sprite</span>
            )}
          </div>
          <div className="flex-1 min-w-0 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Player 1</span>
              <div className="flex gap-1">
                {p1Types.map((t) => (
                  <span key={t} className="text-[9px] px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded font-semibold uppercase">
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <input
              type="text"
              placeholder="Species (e.g. Charizard)"
              value={p1Species}
              onChange={(e) => setP1Species(e.target.value)}
              onBlur={() => handleFetchAndSave(0, p1Species, p1Nickname, p1Types, setP1Sprite, setP1Types)}
              className="w-full bg-slate-950 border border-slate-800 text-xs px-2 py-1 rounded text-slate-200 focus:outline-none focus:border-red-500"
            />
            <input
              type="text"
              placeholder="Nickname"
              value={p1Nickname}
              onChange={(e) => setP1Nickname(e.target.value)}
              onBlur={() => handleFetchAndSave(0, p1Species, p1Nickname, p1Types, setP1Sprite, setP1Types)}
              className="w-full bg-slate-950 border border-slate-800 text-xs px-2 py-1 rounded text-slate-400 focus:outline-none focus:border-red-500 italic"
            />
          </div>
        </div>

        {/* Player 2 Card */}
        <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 flex items-center gap-3">
          <div className="w-16 h-16 bg-slate-950 rounded flex flex-col items-center justify-center border border-slate-800 shrink-0">
            {p2Sprite ? (
              <img src={p2Sprite} alt={p2Species} className="w-14 h-14 object-contain" />
            ) : (
              <span className="text-[10px] text-slate-600 uppercase font-bold">No Sprite</span>
            )}
          </div>
          <div className="flex-1 min-w-0 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Player 2</span>
              <div className="flex gap-1">
                {p2Types.map((t) => (
                  <span key={t} className="text-[9px] px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded font-semibold uppercase">
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <input
              type="text"
              placeholder="Species (e.g. Blastoise)"
              value={p2Species}
              onChange={(e) => setP2Species(e.target.value)}
              onBlur={() => handleFetchAndSave(1, p2Species, p2Nickname, p2Types, setP2Sprite, setP2Types)}
              className="w-full bg-slate-950 border border-slate-800 text-xs px-2 py-1 rounded text-slate-200 focus:outline-none focus:border-red-500"
            />
            <input
              type="text"
              placeholder="Nickname"
              value={p2Nickname}
              onChange={(e) => setP2Nickname(e.target.value)}
              onBlur={() => handleFetchAndSave(1, p2Species, p2Nickname, p2Types, setP2Sprite, setP2Types)}
              className="w-full bg-slate-950 border border-slate-800 text-xs px-2 py-1 rounded text-slate-400 focus:outline-none focus:border-red-500 italic"
            />
          </div>
        </div>
      </div>
    </div>
  );
}