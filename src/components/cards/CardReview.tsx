import { MDXRemote } from "next-mdx-remote/rsc";
import type { ReviewFrontmatter } from "@/lib/content";

interface CardReviewProps {
  content: string;
  frontmatter: ReviewFrontmatter;
}

export async function CardReview({ content, frontmatter }: CardReviewProps) {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-bold text-[var(--color-primary)]">Expert Review</h2>
      {frontmatter.author && (
        <p className="mt-1 text-sm text-gray-400">
          By {frontmatter.author}
          {frontmatter.date && <> &middot; {frontmatter.date}</>}
        </p>
      )}
      <div className="prose prose-sm mt-4 max-w-none prose-headings:text-[var(--color-primary)] prose-h2:text-lg prose-h3:text-base prose-a:text-[var(--color-accent)] prose-strong:text-gray-900">
        <MDXRemote source={content} />
      </div>
    </section>
  );
}
