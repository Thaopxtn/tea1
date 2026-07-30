import { getDb } from "@/lib/db";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import Link from "next/link";
import { PlusCircle, FileText, ChevronLeft } from "lucide-react";

export const metadata = {
  title: "Quản lý Blog & SEO - Admin",
  robots: { index: false, follow: false },
};

export default async function AdminBlogPage() {
  const prisma = getDb();
  if (!prisma) return null;

  const articles = await prisma.article.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container mx-auto py-12 px-4 max-w-6xl">
      <div className="mb-6">
        <Link href="/admin" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-green-700 transition-colors">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Quay lại Bảng điều khiển
        </Link>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-serif text-slate-800 flex items-center gap-3">
            <FileText className="w-8 h-8 text-green-700" />
            Quản lý Blog & SEO
          </h1>
          <p className="text-slate-500 mt-2">Tổng số: {articles.length} bài viết</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="flex items-center gap-2 bg-green-700 text-white px-6 py-2.5 rounded-full font-medium hover:bg-green-800 transition-colors shadow-sm"
        >
          <PlusCircle className="w-5 h-5" />
          Bài viết mới
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {articles.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            Chưa có bài viết nào. Hãy tạo bài viết đầu tiên!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-sm text-slate-500 uppercase tracking-wider">
                  <th className="p-4 font-medium">Tiêu đề</th>
                  <th className="p-4 font-medium">Trạng thái</th>
                  <th className="p-4 font-medium">Ngày xuất bản</th>
                  <th className="p-4 font-medium text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {articles.map((article) => (
                  <tr key={article.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4">
                      <div className="font-medium text-slate-800">{article.title}</div>
                      <div className="text-xs text-slate-400 mt-1">{article.slug}</div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        article.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {article.status === 'ACTIVE' ? 'Đã xuất bản' : 'Bản nháp'}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-slate-500">
                      {article.publishedAt ? format(article.publishedAt, "dd/MM/yyyy HH:mm", { locale: vi }) : "—"}
                    </td>
                    <td className="p-4 text-right">
                      <a
                        href={`/blog/${article.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 mr-4"
                      >
                        Xem thử
                      </a>
                      {/* Tạm thời chưa có form Edit riêng, bạn có thể tự mở rộng sau */}
                      <span className="text-sm text-slate-300">Sửa</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
