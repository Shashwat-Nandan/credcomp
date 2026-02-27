import fs from "fs";
import path from "path";
import matter from "gray-matter";

const reviewsDirectory = path.join(process.cwd(), "src/content/reviews");

export interface ReviewFrontmatter {
  author?: string;
  date?: string;
}

export interface CardReview {
  content: string;
  frontmatter: ReviewFrontmatter;
}

export function getCardReview(slug: string): CardReview | null {
  const filePath = path.join(reviewsDirectory, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { content, data } = matter(raw);

  return {
    content,
    frontmatter: {
      author: data.author as string | undefined,
      date: data.date instanceof Date
        ? data.date.toISOString().split("T")[0]
        : (data.date as string | undefined),
    },
  };
}

export function getReviewSlugs(): string[] {
  if (!fs.existsSync(reviewsDirectory)) return [];
  return fs
    .readdirSync(reviewsDirectory)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(".mdx", ""));
}
