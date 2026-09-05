import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllJournalEntries, getJournalEntryBySlug } from "@/data/journal";
import JournalClientWrapper from "../JournalClientWrapper";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const entries = getAllJournalEntries();
  return entries.map((entry) => ({
    slug: entry.slug,
  }));
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = getJournalEntryBySlug(slug);

  if (!entry) {
    return {
      title: "Article Not Found — A Collection of Unsaid Things",
    };
  }

  return {
    title: `${entry.title} — The Journal`,
    description: entry.subtitle || entry.excerpt,
    openGraph: {
      title: entry.title,
      description: entry.subtitle,
      type: "article",
      publishedTime: entry.date,
      authors: ["A Collection of Unsaid Things"],
    },
  };
}

export default async function JournalArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const entry = getJournalEntryBySlug(slug);

  if (!entry) {
    notFound();
  }

  return <JournalClientWrapper initialSlug={slug} />;
}
