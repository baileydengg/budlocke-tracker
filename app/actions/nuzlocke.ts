"use server";

import { db } from "@/db";
import { sessions, pairs, pokemons } from "@/db/schema";
import { nanoid } from "nanoid";
import { redirect } from "next/navigation";
import { eq, and } from "drizzle-orm";

const DEFAULT_ROUTES = [
  "Pallet Town",
  "Route 1",
  "Viridian City",
  "Route 22",
  "Viridian Forest",
  "Pewter City",
];

export async function createNuzlocke(formData: FormData) {
  const title = formData.get("title") as string;
  const game = formData.get("game") as string;

  // 1. Generate a short unique ID (slug)
  const sessionId = nanoid(10);

  // 2. Insert session into the SQLite database
  await db.insert(sessions).values({
    id: sessionId,
    title,
    game,
  });

  // 3. Pre-populate initial route pairs for this session
  for (const routeName of DEFAULT_ROUTES) {
    await db.insert(pairs).values({
      id: nanoid(12),
      sessionId,
      routeName,
      status: "ALIVE",
    });
  }

  // 4. Redirect user to their unique session tracker page
  redirect(`/nuzlocke/${sessionId}`);
}

export async function updatePairStatus(pairId: string, status: "ALIVE" | "DEAD" | "BOXED") {
  await db
    .update(pairs)
    .set({ status })
    .where(eq(pairs.id, pairId));
}

export async function savePokemon(
  pairId: string,
  playerIndex: number,
  species: string,
  nickname: string,
  types: string,
  spriteUrl: string
) {
  const existing = await db.query.pokemons.findFirst({
    where: and(
      eq(pokemons.pairId, pairId),
      eq(pokemons.playerIndex, playerIndex)
    ),
  });

  if (existing) {
    await db
      .update(pokemons)
      .set({ species, nickname, types, spriteUrl })
      .where(eq(pokemons.id, existing.id));
  } else {
    await db.insert(pokemons).values({
      id: nanoid(12),
      pairId,
      playerIndex,
      species,
      nickname,
      types,
      spriteUrl,
    });
  }
}