import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

// Session Table
export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(), // unique slug like "9x2k1m8p"
  title: text("title").notNull(),
  game: text("game").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Pair/Route Table
export const pairs = sqliteTable("pairs", {
  id: text("id").primaryKey(),
  sessionId: text("session_id").notNull().references(() => sessions.id, { onDelete: "cascade" }),
  routeName: text("route_name").notNull(),
  status: text("status").notNull().default("ALIVE"), // ALIVE, DEAD, BOXED
});

// Pokemon Table
export const pokemons = sqliteTable("pokemons", {
  id: text("id").primaryKey(),
  pairId: text("pair_id").notNull().references(() => pairs.id, { onDelete: "cascade" }),
  playerIndex: integer("player_index").notNull(),
  species: text("species").notNull().default(""),
  nickname: text("nickname").notNull().default(""), // <-- Added
  types: text("types").notNull().default(""),       // <-- Added (e.g. "fire,flying")
  spriteUrl: text("sprite_url").notNull().default(""),
});

// --- RELATIONS DEFINITIONS ---

export const sessionsRelations = relations(sessions, ({ many }) => ({
  pairs: many(pairs),
}));

export const pairsRelations = relations(pairs, ({ one, many }) => ({
  session: one(sessions, {
    fields: [pairs.sessionId],
    references: [sessions.id],
  }),
  pokemons: many(pokemons), // <-- This links 'pokemons' array to 'pairs'
}));

export const pokemonsRelations = relations(pokemons, ({ one }) => ({
  pair: one(pairs, {
    fields: [pokemons.pairId],
    references: [pairs.id],
  }),
}));