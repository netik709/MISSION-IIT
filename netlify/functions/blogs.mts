import type { Config } from "@netlify/functions";
import { desc } from "drizzle-orm";
import { db } from "../../db/index.js";
import { blogPosts } from "../../db/schema.js";

export default async (req: Request) => {
  if (req.method === "GET") {
    const posts = await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
    return Response.json(posts);
  }

  if (req.method === "POST") {
    const { title, content } = await req.json();
    if (typeof title !== "string" || !title.trim() || typeof content !== "string" || !content.trim()) {
      return Response.json({ error: "Title and content are required." }, { status: 400 });
    }

    const [post] = await db
      .insert(blogPosts)
      .values({ title: title.trim(), content: content.trim() })
      .returning();
    return Response.json(post, { status: 201 });
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config: Config = {
  path: "/api/blogs",
  method: ["GET", "POST"],
};
