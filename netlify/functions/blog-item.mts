import type { Config, Context } from "@netlify/functions";
import { eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { blogPosts } from "../../db/schema.js";

export default async (req: Request, context: Context) => {
  const id = Number(context.params.id);
  if (!Number.isInteger(id)) {
    return Response.json({ error: "Invalid blog post id." }, { status: 400 });
  }

  if (req.method === "DELETE") {
    const [deleted] = await db.delete(blogPosts).where(eq(blogPosts.id, id)).returning();
    if (!deleted) {
      return Response.json({ error: "Blog post not found." }, { status: 404 });
    }
    return new Response(null, { status: 204 });
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config: Config = {
  path: "/api/blogs/:id",
  method: ["DELETE"],
};
