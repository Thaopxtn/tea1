import { PrismaClient } from "@/generated/prisma";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

const prisma = new PrismaClient();

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props) {
  const article = await prisma.article.findUnique({
    where: { slug: params.slug },
  });

  if (!article) return {};

  return {
    title: article.metaTitle || `${article.title} - Trà Mộc Sương`,
    description: article.metaDescription || article.excerpt,
  };
}

export default async function ArticlePage({ params }: Props) {
  const article = await prisma.article.findUnique({
    where: { slug: params.slug },
  });

  if (!article) {
    notFound();
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {article.featuredImage && (
        <div className="w-full h-[40vh] md:h-[60vh] relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={article.featuredImage} 
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="absolute inset-0 flex items-end justify-center pb-16">
            <div className="container mx-auto px-4 max-w-4xl text-center">
              <h1 className="text-3xl md:text-5xl font-serif text-white leading-tight mb-4">{article.title}</h1>
              {article.publishedAt && (
                <time className="text-white/80">
                  {format(article.publishedAt, "d MMMM, yyyy", { locale: vi })}
                </time>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 mt-12 md:-mt-20 relative z-10">
        <article className="max-w-3xl mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100">
          {!article.featuredImage && (
            <div className="mb-12 text-center">
              <h1 className="text-4xl font-serif text-slate-800 mb-4">{article.title}</h1>
              {article.publishedAt && (
                <time className="text-slate-500">
                  {format(article.publishedAt, "d MMMM, yyyy", { locale: vi })}
                </time>
              )}
            </div>
          )}

          <div 
            className="prose prose-slate prose-lg max-w-none prose-headings:font-serif prose-h2:text-2xl prose-a:text-green-700 hover:prose-a:text-green-800"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </article>
      </div>
    </div>
  );
}
