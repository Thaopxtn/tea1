import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { DemoForm } from "@/components/content/demo-form";
import { DemoOrders } from "@/components/content/demo-orders";
import { JsonLd } from "@/components/seo/json-ld";
import { brandConfig } from "@/config/brand";

type ContentPage = {
  title: string;
  eyebrow: string;
  intro: string;
  sections: Array<{
    heading: string;
    paragraphs: string[];
    bullets?: string[];
  }>;
  form?: "login" | "register" | "contact" | "address";
  orders?: boolean;
  faq?: Array<{ question: string; answer: string }>;
  article?: boolean;
};

const pages: Record<string, ContentPage> = {
  "gioi-thieu": {
    title: "Một thương hiệu trà được xây từ sự minh bạch.",
    eyebrow: "Về Mộc Sương",
    intro:
      "Mộc Sương là dự án giới thiệu chè đặc sản Thái Nguyên theo hướng rõ ràng và dễ hiểu. Mỗi sản phẩm được trình bày bằng vùng nguyên liệu, phẩm trà, gợi ý cảm quan và cách pha.",
    sections: [
      {
        heading: "Điều chúng tôi giữ",
        paragraphs: [
          "Tên vùng, mùa vụ, tiêu chuẩn hái và cách pha phải dễ kiểm tra. Cảm nhận hương vị được viết như cảm nhận, không biến thành lời hứa y khoa.",
        ],
        bullets: [
          "Nội dung tiếng Việt nguyên bản",
          "Hình ảnh nguyên bản, không sao chép từ thương hiệu khác",
          "Không dùng đánh giá giả để thuyết phục người mua",
        ],
      },
      {
        heading: "Điều cần hoàn thiện trước khi hoạt động chính thức",
        paragraphs: [
          "Thông tin pháp lý, ảnh chụp thật, hồ sơ lô trà, tồn kho, thanh toán và vận chuyển cần được kết nối với dữ liệu đã xác minh.",
        ],
      },
    ],
  },
  "vung-che": {
    title: "Bốn vùng chè, bốn sắc độ của đất.",
    eyebrow: "Vùng chè Thái Nguyên",
    intro:
      "Tân Cương, La Bằng, Trại Cài và Khe Cốc (Vô Tranh) được cổng thông tin tỉnh giới thiệu là “Tứ đại danh trà” của Thái Nguyên. Thông tin của từng lô sản phẩm vẫn cần hồ sơ đối soát riêng.",
    sections: [
      {
        heading: "Tân Cương",
        paragraphs: [
          "Chè Tân Cương nổi bật với hương cốm non, vị chát nhẹ, hậu ngọt sâu và nước vàng ánh xanh trong. Chỉ dẫn địa lý Tân Cương bao gồm Phúc Xuân, Phúc Trìu và Tân Cương.",
        ],
        bullets: [
          "Địa hình đồi thấp",
          "Sương sớm và độ ẩm",
          "Nghề sao chè theo mẻ",
        ],
      },
      {
        heading: "La Bằng, Trại Cài và Khe Cốc",
        paragraphs: [
          "La Bằng được mô tả với nét đậm đà, mộc mạc; Trại Cài nổi bật ở sự cân bằng chát, đắng, ngọt và hương. Khe Cốc thuộc Vô Tranh là vùng còn lại trong nhóm bốn vùng trà tiêu biểu.",
        ],
      },
    ],
  },
  "vung-che/tan-cuong": {
    title: "Tân Cương — nơi sương gặp búp chè.",
    eyebrow: "Tổng quan vùng trà",
    intro:
      "Tân Cương là vùng chè được bảo hộ chỉ dẫn địa lý. Trà mang chỉ dẫn địa lý này được mô tả với cánh khô xanh tự nhiên, xoăn chắc; nước pha xanh vàng, trong sáng. Thông tin vườn cụ thể cần được xác nhận theo từng lô.",
    sections: [
      {
        heading: "Nhịp mùa xuân",
        paragraphs: [
          "Búp non được theo dõi theo lô thu hái. Thời tiết và nguồn nước có thể làm thay đổi hương, vị giữa các mùa.",
        ],
        bullets: [
          "Ghi ngày hái",
          "Ghi tiêu chuẩn búp",
          "Ghi người phụ trách mẻ sao",
        ],
      },
    ],
  },
  "vung-che/la-bang": {
    title: "La Bằng — đậm đà và mộc mạc.",
    eyebrow: "Tổng quan vùng trà",
    intro: "Một cách kể vùng chè bình tĩnh, không dùng mỹ từ thay cho dữ liệu.",
    sections: [
      {
        heading: "Hồ sơ cần đối soát",
        paragraphs: [
          "Tên vườn, tọa độ, giống chè và quy trình canh tác chỉ được công bố khi có nguồn xác nhận.",
        ],
      },
    ],
  },
  "vung-che/trai-cai": {
    title: "Trại Cài — vị trà cân bằng.",
    eyebrow: "Tổng quan vùng trà",
    intro:
      "Thiết kế trang vùng giúp liên kết sản phẩm theo nơi trồng và cảm quan.",
    sections: [
      {
        heading: "Cách dùng hồ sơ vùng",
        paragraphs: [
          "Người mua có thể so sánh vùng, phẩm cấp và cách pha trước khi quyết định.",
        ],
      },
    ],
  },
  "vung-che/khe-coc": {
    title: "Khe Cốc — vùng trà của Vô Tranh.",
    eyebrow: "Tổng quan vùng trà",
    intro:
      "Khe Cốc thuộc xã Vô Tranh và được giới thiệu trong nhóm bốn vùng trà tiêu biểu của Thái Nguyên. Nội dung từng lô trên website không được hiểu là chứng nhận vùng hay chứng nhận canh tác.",
    sections: [
      {
        heading: "Hồ sơ vùng và hồ sơ lô",
        paragraphs: [
          "Mọi tuyên bố canh tác cần hồ sơ đối soát, thời hạn và đơn vị xác nhận cụ thể.",
        ],
      },
    ],
  },
  "cau-chuyen-nghe-nhan": {
    title: "Lửa vừa tay, hương vừa tới.",
    eyebrow: "Câu chuyện nghệ nhân",
    intro:
      "Sao chè là chuỗi quyết định về nhiệt, thời gian và cảm nhận của người làm trà. Trang này tập trung vào công việc thực tế, không gắn thêm giải thưởng hay danh hiệu chưa được kiểm chứng.",
    sections: [
      {
        heading: "Một mẻ trà nhỏ",
        paragraphs: [
          "Người làm trà theo dõi độ mềm của lá, mùi hương và nhiệt chảo qua từng nhịp đảo. Công cụ có thể thay đổi, nhưng mục tiêu vẫn là ổn định mẻ trà.",
        ],
        bullets: ["Làm héo", "Diệt men", "Vò tạo hình", "Sao sấy"],
      },
      {
        heading: "Ghi tên người làm",
        paragraphs: [
          "Khi có dữ liệu thật, mỗi hồ sơ sản phẩm nên ghi cơ sở, người phụ trách và ngày chế biến với sự đồng thuận rõ ràng.",
        ],
      },
    ],
  },
  "huong-dan-pha-tra": {
    title: "Pha trà xanh bằng những biến số dễ nhớ.",
    eyebrow: "Hướng dẫn pha",
    intro:
      "Bắt đầu với nước 80–85°C, 5 g trà cho 150 ml và lần pha đầu khoảng 20 giây. Sau đó điều chỉnh theo nước và khẩu vị.",
    sections: [
      {
        heading: "Pha bằng ấm",
        paragraphs: [
          "Làm nóng ấm, cho trà, rót nước và rót cạn sau mỗi lần. Tăng dần thời gian 20, 25, 35 và 50 giây.",
        ],
        bullets: ["Ấm 150 ml", "5 g trà", "80–85°C", "4–5 lần pha"],
      },
      {
        heading: "Pha bằng cốc",
        paragraphs: [
          "Dùng 3 g trà cho cốc 300 ml, châm nước 80°C và chờ 2–3 phút. Chừa lại một ít nước trước khi châm lần hai.",
        ],
      },
      {
        heading: "Khi nước trà bị đỏ",
        paragraphs: [
          "Giảm nhiệt độ, rút ngắn thời gian và bảo quản trà kín hơn. Nước quá nóng hoặc trà tiếp xúc ẩm, oxy lâu có thể làm màu và vị thay đổi.",
        ],
      },
    ],
  },
  "kien-thuc-tra": {
    title: "Ghi chép để hiểu trà trước khi chọn.",
    eyebrow: "Kiến thức trà",
    intro:
      "Các bài viết ngắn tập trung vào phân loại, pha, bảo quản, chọn quà và văn hóa thưởng trà Việt Nam.",
    sections: [
      {
        heading: "Bắt đầu từ phẩm trà",
        paragraphs: [
          "Trà Đinh, Trà Nõn Tôm và Trà Móc Câu là các phẩm trà thường được phân biệt bằng tiêu chuẩn hái và hình dáng cánh; đây không phải tên giống chè.",
        ],
        bullets: [
          "Phân biệt phẩm trà",
          "Pha trà không đỏ nước",
          "Bảo quản sau khi mở",
          "Chọn trà làm quà",
          "Văn hóa thưởng trà",
        ],
      },
    ],
  },
  "kien-thuc-tra/phan-biet-tra-dinh-non-tom-moc-cau": {
    title: "Phân biệt Trà Đinh, Trà Nõn Tôm và Trà Móc Câu.",
    eyebrow: "Ghi chép 01",
    intro:
      "Tên phẩm trà nên đi cùng tiêu chuẩn hái và hình dáng cánh, không chỉ dựa vào giá.",
    article: true,
    sections: [
      {
        heading: "Nhìn vào búp",
        paragraphs: [
          "Theo quy ước phẩm trà phổ biến: Trà Đinh chỉ tuyển búp non chưa mở; Trà Nõn Tôm thường dùng một tôm một lá non; Trà Móc Câu thường dùng một tôm hai lá và có cánh cong như móc câu. Tiêu chuẩn thực tế vẫn cần được ghi theo từng lô.",
        ],
      },
      {
        heading: "So bằng cùng một cách pha",
        paragraphs: [
          "Giữ lượng trà, nhiệt độ và thời gian giống nhau để nhận ra khác biệt về hương, độ chát, độ dày và hậu vị.",
        ],
      },
    ],
  },
  "kien-thuc-tra/pha-tra-xanh-khong-do-nuoc": {
    title: "Cách pha trà xanh không bị đỏ nước.",
    eyebrow: "Ghi chép 02",
    intro: "Nước quá nóng và thời gian ngâm dài là hai nguyên nhân dễ gặp.",
    article: true,
    sections: [
      {
        heading: "Ba điều chỉnh nhỏ",
        paragraphs: [
          "Hạ nước về khoảng 80–85°C, rót cạn sau mỗi lần và dùng ấm sạch không ám mùi.",
        ],
        bullets: ["Nước vừa nhiệt", "Thời gian ngắn", "Trà được giữ kín"],
      },
    ],
  },
  "kien-thuc-tra/bao-quan-tra": {
    title: "Bảo quản trà sau khi mở túi.",
    eyebrow: "Ghi chép 03",
    intro: "Trà xanh nhạy với ẩm, oxy, nhiệt, ánh sáng và mùi mạnh.",
    article: true,
    sections: [
      {
        heading: "Một hộp nhỏ, kín và khô",
        paragraphs: [
          "Chia trà thành lượng dùng ngắn hạn, ép bớt không khí trong túi và luôn dùng muỗng khô. Tránh mở hộp ngay sau khi chuyển từ nơi quá lạnh ra môi trường ẩm.",
        ],
      },
    ],
  },
  "chinh-sach-giao-hang": {
    title: "Chính sách giao hàng.",
    eyebrow: "Chính sách mua hàng",
    intro:
      "Phí và thời gian giao hàng được xác nhận theo địa chỉ nhận, giá trị đơn và năng lực của đơn vị vận chuyển.",
    sections: [
      {
        heading: "Phí và thời gian dự kiến",
        paragraphs: [
          "Đơn từ 600.000đ được miễn phí vận chuyển; đơn dưới ngưỡng áp dụng phí theo khu vực. Thời gian dự kiến 2–4 ngày làm việc sau khi xác nhận.",
        ],
        bullets: [
          "Xác nhận đơn trước khi giao",
          "Không giao dịch thanh toán thật",
          "Liên hệ khi kiện hàng có vấn đề",
        ],
      },
    ],
  },
  "chinh-sach-doi-tra": {
    title: "Chính sách đổi trả.",
    eyebrow: "Chính sách mua hàng",
    intro: "Áp dụng cho sản phẩm lỗi, giao sai hoặc hư hỏng do vận chuyển.",
    sections: [
      {
        heading: "Điều kiện cơ bản",
        paragraphs: [
          "Liên hệ trong 7 ngày kể từ khi nhận hàng, giữ bao bì và cung cấp ảnh tình trạng sản phẩm để được hỗ trợ đối soát.",
        ],
      },
    ],
  },
  "chinh-sach-bao-mat": {
    title: "Chính sách bảo mật.",
    eyebrow: "Chính sách mua hàng",
    intro:
      "Mộc Sương chỉ thu thập dữ liệu cần thiết để xử lý đơn hàng, phản hồi liên hệ, gửi thư khi có đồng ý và bảo vệ hệ thống.",
    sections: [
      {
        heading: "Dữ liệu và mục đích sử dụng",
        paragraphs: [
          "Thông tin nhận hàng, liên hệ và chi tiết đơn được dùng để xác nhận, giao hàng, hỗ trợ và đáp ứng nghĩa vụ kế toán hoặc pháp luật. Giỏ hàng và danh sách yêu thích được lưu trên thiết bị của bạn.",
          "Thông tin thanh toán nhạy cảm được nhập trên hệ thống của VNPay hoặc MoMo; website chỉ nhận kết quả giao dịch đã được ký từ cổng thanh toán.",
        ],
      },
      {
        heading: "Lưu giữ và quyền của bạn",
        paragraphs: [
          "Dữ liệu chỉ được giữ trong thời gian cần cho mục đích đã nêu và nghĩa vụ áp dụng. Bạn có thể yêu cầu xem, chỉnh sửa hoặc xóa dữ liệu qua trang liên hệ; một số hồ sơ giao dịch có thể phải được lưu theo quy định.",
        ],
      },
    ],
  },
  "dieu-khoan": {
    title: "Điều khoản sử dụng.",
    eyebrow: "Điều khoản sử dụng",
    intro:
      "Việc đặt hàng chỉ được xác nhận khi hệ thống tạo mã đơn và đội ngũ vận hành xác nhận khả năng cung ứng.",
    sections: [
      {
        heading: "Phạm vi giao dịch",
        paragraphs: [
          "Không gửi thông tin thẻ qua biểu mẫu liên hệ. Thanh toán trực tuyến chỉ diễn ra trên trang bảo mật của VNPay hoặc MoMo.",
        ],
      },
    ],
  },
  "lien-he": {
    title: "Trò chuyện về trà và quà tặng.",
    eyebrow: "Liên hệ",
    intro:
      [brandConfig.hotline, brandConfig.email, brandConfig.address]
        .filter(Boolean)
        .join(" · ") ||
      "Gửi yêu cầu qua biểu mẫu; đội ngũ Mộc Sương sẽ phản hồi theo kênh bạn cung cấp.",
    form: "contact",
    sections: [
      {
        heading: "Tư vấn số lượng lớn",
        paragraphs: [
          "Hãy cho biết dịp tặng, số lượng, ngân sách và thời gian mong muốn để nhận tư vấn phù hợp.",
        ],
      },
    ],
  },
  faq: {
    title: "Câu hỏi thường gặp.",
    eyebrow: "Hỗ trợ",
    intro:
      "Câu trả lời ngắn cho những điểm dễ vướng khi chọn, pha và bảo quản trà.",
    faq: [
      {
        question: "Nên bắt đầu với phẩm trà nào?",
        answer:
          "Móc Câu hoặc Trà Búp dễ tiếp cận; Trà Nõn Tôm phù hợp khi muốn cánh trà thanh và vị êm hơn.",
      },
      {
        question: "Đơn hàng được xác nhận như thế nào?",
        answer:
          "Sau khi hệ thống tạo mã đơn, đội ngũ vận hành sẽ xác nhận tồn kho, giao hàng và phương thức thanh toán trước khi xử lý.",
      },
      {
        question: "Website có dùng đánh giá giả không?",
        answer:
          "Không. Các điểm số và nhận xét giả đã được loại bỏ; nội dung lựa chọn trà được trình bày dưới dạng gợi ý cảm quan.",
      },
      {
        question: "Hình ảnh sản phẩm có sao chép từ nơi khác không?",
        answer:
          "Không. Hình ảnh chủ đạo được tạo riêng cho dự án và không sử dụng logo hay bao bì của thương hiệu khác.",
      },
    ],
    sections: [],
  },
  "tai-khoan/dang-nhap": {
    title: "Đăng nhập tài khoản.",
    eyebrow: "Tài khoản",
    intro:
      "Form kiểm tra email và mật khẩu, nhưng không gửi dữ liệu hoặc tạo phiên đăng nhập thật.",
    form: "login",
    sections: [],
  },
  "tai-khoan/dang-ky": {
    title: "Tạo tài khoản.",
    eyebrow: "Tài khoản",
    intro: "Dùng thông tin giả để thử giao diện. Mật khẩu không được lưu.",
    form: "register",
    sections: [],
  },
  "tai-khoan": {
    title: "Không gian tài khoản.",
    eyebrow: "Tài khoản",
    intro:
      "Đi tới đơn hàng hoặc địa chỉ được lưu cục bộ. Không có xác thực máy chủ.",
    sections: [
      {
        heading: "Quản lý cục bộ",
        paragraphs: [
          "Đơn thử nghiệm được lưu trong bộ nhớ trình duyệt; biểu mẫu địa chỉ chỉ mô phỏng trạng thái thành công và không lưu dữ liệu nhạy cảm.",
        ],
        bullets: [
          "Đơn hàng thử nghiệm",
          "Địa chỉ giao nhận",
          "Danh sách yêu thích",
        ],
      },
    ],
  },
  "tai-khoan/don-hang": {
    title: "Đơn hàng thử nghiệm.",
    eyebrow: "Tài khoản",
    intro: "Danh sách chỉ gồm các đơn thử nghiệm đã tạo trên thiết bị này.",
    orders: true,
    sections: [],
  },
  "tai-khoan/dia-chi": {
    title: "Địa chỉ giao nhận.",
    eyebrow: "Tài khoản",
    intro:
      "Biểu mẫu kiểm tra thông tin nhập vào nhưng chưa lưu địa chỉ; không nhập dữ liệu cá nhân nhạy cảm.",
    form: "address",
    sections: [],
  },
};

const paths = Object.keys(pages);

export function generateStaticParams() {
  return paths.map((path) => ({ slug: path.split("/") }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const key = slug.join("/");
  const page = pages[key];
  if (!page) return {};
  const privatePage = key.startsWith("tai-khoan");
  return {
    title: page.title.replace(/\.$/, ""),
    description: page.intro,
    alternates: { canonical: `/${key}` },
    robots: privatePage ? { index: false, follow: false } : undefined,
  };
}

export default async function ContentRoute({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const key = slug.join("/");
  const page = pages[key];
  if (!page) notFound();
  const faqSchema = page.faq
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: page.faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      }
    : null;
  const articleSchema = page.article
    ? {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: page.title,
        inLanguage: "vi-VN",
        author: { "@type": "Organization", name: brandConfig.name },
      }
    : null;

  return (
    <>
      <div className="content-page">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Trang chủ</Link>
          <span aria-hidden="true">/</span>
          <span>{page.eyebrow}</span>
        </nav>
        <p className="eyebrow">{page.eyebrow}</p>
        <h1>{page.title}</h1>
        <div className="prose">
          <p className="lead">{page.intro}</p>
          {page.sections.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {section.bullets ? (
                <ul>
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
          {page.faq ? (
            <div className="faq-list">
              {page.faq.map((item) => (
                <details key={item.question}>
                  <summary>{item.question}</summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          ) : null}
          {page.form ? <DemoForm mode={page.form} /> : null}
          {page.orders ? <DemoOrders /> : null}
        </div>
      </div>
      {faqSchema ? <JsonLd data={faqSchema} /> : null}
      {articleSchema ? <JsonLd data={articleSchema} /> : null}
    </>
  );
}
