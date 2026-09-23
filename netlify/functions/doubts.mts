import type { Config } from "@netlify/functions";
import { asc, desc } from "drizzle-orm";
import { db } from "../../db/index.js";
import { comments, doubts } from "../../db/schema.js";

export default async (req: Request) => {
  if (req.method === "GET") {
    const [allDoubts, allComments] = await Promise.all([
      db.select().from(doubts).orderBy(desc(doubts.createdAt)),
      db.select().from(comments).orderBy(asc(comments.createdAt)),
    ]);

    const commentsByDoubt = new Map<number, typeof allComments>();
    for (const comment of allComments) {
      const list = commentsByDoubt.get(comment.doubtId) ?? [];
      list.push(comment);
      commentsByDoubt.set(comment.doubtId, list);
    }

    const result = allDoubts.map((doubt) => ({
      ...doubt,
      comments: commentsByDoubt.get(doubt.id) ?? [],
    }));

    return Response.json(result);
  }

  if (req.method === "POST") {
    const { name, subject, question } = await req.json();
    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof subject !== "string" ||
      !subject.trim() ||
      typeof question !== "string" ||
      !question.trim()
    ) {
      return Response.json({ error: "Name, subject, and question are required." }, { status: 400 });
    }

    const [doubt] = await db
      .insert(doubts)
      .values({ name: name.trim(), subject: subject.trim(), question: question.trim() })
      .returning();
    return Response.json({ ...doubt, comments: [] }, { status: 201 });
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config: Config = {
  path: "/api/doubts",
  method: ["GET", "POST"],
};
