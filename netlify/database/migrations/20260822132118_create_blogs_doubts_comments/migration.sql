CREATE TABLE "blog_posts" (
	"id" serial PRIMARY KEY,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "comments" (
	"id" serial PRIMARY KEY,
	"doubt_id" integer NOT NULL,
	"author" text DEFAULT 'Anonymous' NOT NULL,
	"text" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "doubts" (
	"id" serial PRIMARY KEY,
	"name" text NOT NULL,
	"subject" text NOT NULL,
	"question" text NOT NULL,
	"answer" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_doubt_id_doubts_id_fkey" FOREIGN KEY ("doubt_id") REFERENCES "doubts"("id") ON DELETE CASCADE;