import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

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
  playerIndex: integer("player_index").notNull(), // 0 for Player 1, 1 for Player 2
  species: text("species").notNull().default(""),
  spriteUrl: text("sprite_url").notNull().default(""),
});