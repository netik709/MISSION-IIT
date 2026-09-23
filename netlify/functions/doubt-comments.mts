import type { Config, Context } from "@netlify/functions";
import { eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { comments, doubts } from "../../db/schema.js";

export default async (req: Request, context: Context) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const doubtId = Number(context.params.id);
  if (!Number.isInteger(doubtId)) {
    return Response.json({ error: "Invalid doubt id." }, { status: 400 });
  }

  const { text } = await req.json();
  if (typeof text !== "string" || !text.trim()) {
    return Response.json({ error: "Comment text is required." }, { status: 400 });
  }

  const [doubt] = await db.select({ id: doubts.id }).from(doubts).where(eq(doubts.id, doubtId));
  if (!doubt) {
    return Response.json({ error: "Doubt not found." }, { status: 404 });
  }

  const [comment] = await db
    .insert(comments)
    .values({ doubtId, text: text.trim() })
    .returning();
  return Response.json(comment, { status: 201 });
};

export const config: Config = {
  path: "/api/doubts/:id/comments",
  method: ["POST"],
};
