import type { Config, Context } from "@netlify/functions";
import { eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { doubts } from "../../db/schema.js";

export default async (req: Request, context: Context) => {
  const id = Number(context.params.id);
  if (!Number.isInteger(id)) {
    return Response.json({ error: "Invalid doubt id." }, { status: 400 });
  }

  if (req.method === "PATCH") {
    const { answer } = await req.json();
    if (typeof answer !== "string" || !answer.trim()) {
      return Response.json({ error: "Answer is required." }, { status: 400 });
    }

    const [updated] = await db
      .update(doubts)
      .set({ answer: answer.trim() })
      .where(eq(doubts.id, id))
      .returning();
    if (!updated) {
      return Response.json({ error: "Doubt not found." }, { status: 404 });
    }
    return Response.json(updated);
  }

  if (req.method === "DELETE") {
    const [deleted] = await db.delete(doubts).where(eq(doubts.id, id)).returning();
    if (!deleted) {
      return Response.json({ error: "Doubt not found." }, { status: 404 });
    }
    return new Response(null, { status: 204 });
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config: Config = {
  path: "/api/doubts/:id",
  method: ["PATCH", "DELETE"],
};
