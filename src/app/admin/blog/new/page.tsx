"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Loader2, Save } from "lucide-react";
import { toast } from "sonner";

export default function NewArticlePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    metaTitle: "",
    metaDescription: "",
    featuredImage: "",
    status: "ACTIVE", // Mặc định publish ngay
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    // Auto generate slug from title
    const slug = title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
      
    setFormData({ ...formData, title, slug });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/admin/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Có lỗi xảy ra");

      toast.success("Tạo bài viết thành công!");
      router.push("/admin/blog");
      router.refresh();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Có lỗi xảy ra");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      <div className="mb-6">
        <Link href="/admin/blog" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-green-700 transition-colors">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Quay lại danh sách
        </Link>
      </div>

      <h1 className="text-3xl font-serif text-slate-800 mb-8">Viết bài mới</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Tiêu đề bài viết *</label>
            <input required type="text" value={formData.title} onChange={handleTitleChange} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-green-600 focus:ring-1 focus:ring-green-600 outline-none transition-all text-lg font-medium" placeholder="Nhập tiêu đề..." />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Đường dẫn (Slug) *</label>
            <input required type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-green-600 focus:ring-1 focus:ring-green-600 outline-none transition-all text-slate-500 font-mono text-sm" placeholder="duong-dan-bai-viet" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Mô tả ngắn (Excerpt)</label>
            <textarea value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-green-600 focus:ring-1 focus:ring-green-600 outline-none transition-all min-h-[80px]" placeholder="Đoạn giới thiệu ngắn xuất hiện ở trang danh sách..." />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Nội dung (HTML/Markdown cơ bản) *</label>
            <textarea required value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full px-4 py-4 rounded-lg border border-slate-200 focus:border-green-600 focus:ring-1 focus:ring-green-600 outline-none transition-all min-h-[400px] font-mono text-sm" placeholder="<p>Nhập nội dung bài viết...</p>" />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Link Ảnh Đại Diện (URL)</label>
            <input type="text" value={formData.featuredImage} onChange={e => setFormData({...formData, featuredImage: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-green-600 focus:ring-1 focus:ring-green-600 outline-none transition-all" placeholder="/images/tra-hoa-buoi.jpg" />
            <p className="text-xs text-slate-500">Ví dụ: /images/tra-hoa-buoi.jpg hoặc một đường link URL đầy đủ.</p>
          </div>
        </div>

        {/* SEO Settings */}
        <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 space-y-6">
          <h2 className="text-xl font-medium text-slate-800">Cấu hình SEO</h2>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Meta Title</label>
            <input type="text" value={formData.metaTitle} onChange={e => setFormData({...formData, metaTitle: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-green-600 focus:ring-1 focus:ring-green-600 outline-none transition-all" placeholder="Để trống sẽ lấy theo Tiêu đề bài viết" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Meta Description</label>
            <textarea value={formData.metaDescription} onChange={e => setFormData({...formData, metaDescription: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-green-600 focus:ring-1 focus:ring-green-600 outline-none transition-all min-h-[80px]" placeholder="Để trống sẽ lấy theo Mô tả ngắn" />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-green-800 text-white px-8 py-3 rounded-full font-medium hover:bg-green-900 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {loading ? "Đang lưu..." : "Lưu & Xuất bản"}
          </button>
        </div>
      </form>
    </div>
  );
}
