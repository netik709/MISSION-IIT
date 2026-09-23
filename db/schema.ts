import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";

export const blogPosts = pgTable("blog_posts", {
  id: serial().primaryKey(),
  title: text().notNull(),
  content: text().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const doubts = pgTable("doubts", {
  id: serial().primaryKey(),
  name: text().notNull(),
  subject: text().notNull(),
  question: text().notNull(),
  answer: text(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const comments = pgTable("comments", {
  id: serial().primaryKey(),
  doubtId: integer("doubt_id")
    .notNull()
    .references(() => doubts.id, { onDelete: "cascade" }),
  author: text().notNull().default("Anonymous"),
  text: text().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
