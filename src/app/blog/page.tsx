import Link from "next/link";
import { PrismaClient } from "@/generated/prisma";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

const prisma = new PrismaClient();

export const metadata = {
  title: "Blog & Kiến thức Trà - Trà Mộc Sương",
  description: "Khám phá thế giới trà Thái Nguyên, cách pha trà chuẩn vị và những câu chuyện văn hóa thưởng trà.",
};

export default async function BlogPage() {
  const articles = await prisma.article.findMany({
    where: { status: "ACTIVE" },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <div className="container mx-auto px-4 py-16 mt-20">
      <div className="max-w-3xl mx-auto mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-serif text-slate-800 mb-6">Chuyện Của Trà</h1>
        <p className="text-slate-600">
          Khám phá những kiến thức chuyên sâu về trà Thái Nguyên, nghệ thuật pha trà và các câu chuyện văn hóa thưởng trà từ Trà Mộc Sương.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.length === 0 ? (
          <div className="col-span-full text-center py-20 text-slate-500">
            Đang cập nhật các bài viết mới... (Hãy chạy script generate-seo-articles để có dữ liệu)
          </div>
        ) : (
          articles.map((article) => (
            <article key={article.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-100 flex flex-col">
              <Link href={`/blog/${article.slug}`} className="block relative aspect-video overflow-hidden bg-slate-100">
                {article.featuredImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={article.featuredImage}
                    alt={article.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">No Image</div>
                )}
              </Link>
              <div className="p-6 flex-1 flex flex-col">
                <time className="text-sm text-slate-400 mb-3 block">
                  {article.publishedAt ? format(article.publishedAt, "d MMMM, yyyy", { locale: vi }) : "Đang cập nhật"}
                </time>
                <h2 className="text-xl font-medium text-slate-800 mb-3 group-hover:text-green-700 transition-colors">
                  <Link href={`/blog/${article.slug}`}>{article.title}</Link>
                </h2>
                <p className="text-slate-600 text-sm line-clamp-3 mb-6 flex-1">
                  {article.excerpt}
                </p>
                <Link href={`/blog/${article.slug}`} className="text-green-700 font-medium text-sm inline-flex items-center group-hover:underline">
                  Đọc tiếp &rarr;
                </Link>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
