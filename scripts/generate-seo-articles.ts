import { PrismaClient } from "../src/generated/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";

const prisma = new PrismaClient();

// Yêu cầu: Đặt biến môi trường GEMINI_API_KEY trước khi chạy
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("Lỗi: Không tìm thấy GEMINI_API_KEY. Vui lòng cung cấp API Key.");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// Danh sách chủ đề cơ bản về trà Thái Nguyên
const topics = [
  "Cách pha trà Đinh chuẩn vị",
  "Nguồn gốc trà Thái Nguyên",
  "Phân biệt trà Nõn Tôm và trà Móc Câu",
  "Tác dụng của trà xanh đối với sức khỏe",
  "Nghệ thuật ướp trà sen Hồ Tây",
];

function generateSlug(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

async function generateTopics(count: number) {
  console.log(`Đang sinh ${count} ý tưởng bài viết...`);
  const prompt = `Hãy đóng vai một chuyên gia SEO và chuyên gia về Trà Thái Nguyên. 
Hãy liệt kê ${count} tiêu đề bài viết blog hấp dẫn, chuẩn SEO (mỗi dòng một tiêu đề). 
Các chủ đề xoay quanh: cách pha trà, công dụng trà xanh, phân biệt các loại trà (trà Đinh, Nõn Tôm, Móc Câu), văn hóa thưởng trà, trà ướp hương (nhài, bưởi, sen), trà cụ.
Không đánh số, chỉ xuất text.`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  return text.split("\n").map(t => t.trim()).filter(t => t.length > 5);
}

async function generateArticle(title: string) {
  const prompt = `Bạn là một chuyên gia Content SEO xuất sắc cho website "Trà Mộc Sương" (chuyên bán trà Thái Nguyên cao cấp).
Hãy viết một bài blog chuẩn SEO về chủ đề: "${title}".
Yêu cầu:
- Trả về kết quả dưới định dạng JSON bao gồm: 
  {
    "title": "Tiêu đề tối ưu SEO",
    "excerpt": "Mô tả ngắn (khoảng 150 ký tự)",
    "metaTitle": "Meta title (dưới 60 ký tự)",
    "metaDescription": "Meta description (dưới 150 ký tự)",
    "content": "Nội dung bài viết (khoảng 1000 chữ) bằng HTML (dùng <h2>, <h3>, <p>, <ul>, <li>, không dùng <h1> vì title đã là h1. Bắt buộc có các thẻ in đậm để nhấn mạnh từ khóa)."
  }
Chỉ trả về JSON hợp lệ, không chứa markdown markdown code block \`\`\`json.`;

  const result = await model.generateContent(prompt);
  let text = result.response.text();
  
  // Dọn dẹp kết quả phòng trường hợp AI trả về markdown code block
  text = text.replace(/```json/g, "").replace(/```/g, "").trim();
  
  try {
    return JSON.parse(text);
  } catch (error) {
    console.error(`Lỗi parse JSON cho bài viết "${title}". Bỏ qua.`);
    return null;
  }
}

async function main() {
  console.log("🚀 Bắt đầu quá trình tạo tự động 100 bài viết SEO...");
  
  const autoTopics = await generateTopics(100);
  console.log(`Đã tạo ${autoTopics.length} chủ đề.`);

  let successCount = 0;

  for (let i = 0; i < autoTopics.length; i++) {
    const topic = autoTopics[i];
    console.log(`[${i + 1}/${autoTopics.length}] Đang viết bài: ${topic}`);
    
    const articleData = await generateArticle(topic);
    if (!articleData) continue;

    const slug = generateSlug(articleData.title) + "-" + Date.now().toString().slice(-4);

    try {
      await prisma.article.create({
        data: {
          title: articleData.title,
          slug: slug,
          content: articleData.content,
          excerpt: articleData.excerpt,
          metaTitle: articleData.metaTitle,
          metaDescription: articleData.metaDescription,
          status: "ACTIVE",
          publishedAt: new Date(),
          // Gán ngẫu nhiên 1 ảnh từ bộ sưu tập ảnh cao cấp để làm thumbnail
          featuredImage: `/images/${["tra-hoa-buoi.jpg", "tra-tuyet-thai-nguyen.jpg", "tra-moc-cau-thu.jpg", "loc-tra-gom.jpg", "hop-qua-mua-xuan.jpg"][Math.floor(Math.random() * 5)]}`,
        }
      });
      console.log(`✅ Đã lưu: ${articleData.title}`);
      successCount++;
    } catch (e) {
      console.error(`❌ Lỗi lưu DB bài: ${topic}`, e);
    }
    
    // Tạm dừng 3 giây giữa mỗi request để tránh Rate Limit của API
    await new Promise(r => setTimeout(r, 3000));
  }

  console.log(`\n🎉 Hoàn thành! Đã tạo thành công ${successCount} bài viết chuẩn SEO vào Database.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
