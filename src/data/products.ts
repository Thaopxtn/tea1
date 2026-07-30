import type { BrewingMethod, Product, ProductVariant } from "@/types/product";

const methods: BrewingMethod[] = [
  {
    name: "Pha bằng ấm",
    vessel: "Ấm gốm 150 ml",
    volumeMl: 150,
    teaGrams: 5,
    temperatureC: 82,
    steepTimes: ["20 giây", "25 giây", "35 giây", "50 giây"],
    infusions: 4,
    note: "Tráng ấm, không cần tráng trà; rót cạn nước sau mỗi lần pha.",
  },
  {
    name: "Pha bằng cốc",
    vessel: "Cốc thủy tinh 300 ml",
    volumeMl: 300,
    teaGrams: 3,
    temperatureC: 80,
    steepTimes: ["2–3 phút"],
    infusions: 2,
    note: "Chừa lại một ít nước ở đáy trước khi châm lần tiếp theo.",
  },
];

const categoryImage: Record<string, string> = {
  "tra-dinh": "/images/catalog-tra-dinh.webp",
  "non-tom": "/images/catalog-tra-non-tom.webp",
  "moc-cau": "/images/catalog-tra-moc-cau.webp",
  "tra-bup": "/images/catalog-tra-bup.webp",
  "uop-sen": "/images/catalog-tra-sen.webp",
  "uop-nhai": "/images/catalog-tra-nhai.webp",
  "tui-loc": "/images/catalog-tra-tui-loc.webp",
  "bo-tra": "/images/catalog-hop-qua.webp",
  "hop-qua": "/images/catalog-hop-qua.webp",
  "tra-cu": "/images/catalog-tra-cu.webp",
};

const categoryDetailImage: Record<string, string> = {
  "tra-dinh": "/images/tra-dinh-thai-nguyen.png",
  "non-tom": "/images/tra-tom-non-thai-nguyen.png",
  "moc-cau": "/images/tra-moc-cau-thai-nguyen.png",
  "tra-bup": "/images/tra-bup-thai-nguyen.png",
  "uop-sen": "/images/tra-still-life.png",
  "uop-nhai": "/images/tra-bup-thai-nguyen.png",
  "tui-loc": "/images/tra-still-life.png",
  "bo-tra": "/images/tra-still-life.png",
  "hop-qua": "/images/tra-still-life.png",
  "tra-cu": "/images/tra-still-life.png",
};

const customProductImage: Record<string, string> = {
  "tra-xanh-uop-hoa-buoi": "/images/tra-hoa-buoi.jpg",
  "tra-tuyet-thai-nguyen": "/images/tra-tuyet-thai-nguyen.jpg",
  "tra-moc-cau-thu-phan": "/images/tra-moc-cau-thu.jpg",
  "loc-tra-gom-moc": "/images/loc-tra-gom.jpg",
  "hop-qua-thuong-tra-mua-xuan": "/images/hop-qua-mua-xuan.jpg",
  "tui-loc-tra-xanh": "/images/tra-tui-loc-hien-dai.jpg",
  "bo-thu-bon-pham-tra": "/images/bo-thu-4-pham-tra.jpg",
  "am-gom-tro-trau": "/images/am-gom-tro-trau.jpg",
};

const productImage = (name: string, category: string, slug: string) => [
  {
    src: customProductImage[slug] ?? categoryImage[category] ?? "/images/tra-still-life.png",
    alt: `${name}: ảnh đại diện sản phẩm`,
    width: 1240,
    height: 1240,
  },
  {
    src: customProductImage[slug] ?? categoryDetailImage[category] ?? "/images/nghe-nhan.png",
    alt: `${name}: góc nhìn cận cảnh`,
    width: 1240,
    height: 1240,
  },
];

const makeVariants = (
  slug: string,
  basePrice: number,
  gift = false,
): ProductVariant[] => {
  const weights = [
    ["Gói thử 20 g", 20, 0.24],
    ["50 g", 50, 0.56],
    ["100 g", 100, 1],
    ["200 g", 200, 1.88],
    ["500 g", 500, 4.4],
  ] as const;

  const variants: ProductVariant[] = weights.map(
    ([label, grams, factor], index) => ({
      id: `${slug}-${grams}`,
      label,
      weightGrams: grams,
      packaging: index >= 3 ? ("hop-thiec" as const) : ("tui-giay" as const),
      price: Math.round((basePrice * factor) / 1000) * 1000,
      stock: index === 4 ? 4 : 18 - index,
    }),
  );

  if (gift) {
    variants.push({
      id: `${slug}-gift`,
      label: "Hộp quà",
      packaging: "hop-qua",
      price: Math.round((basePrice * 2.25) / 1000) * 1000,
      stock: 6,
    });
  }
  return variants;
};

type Seed = {
  name: string;
  slug: string;
  category: string;
  region: string;
  grade: string;
  aroma: string[];
  taste: string[];
  price: number;
  badges?: string[];
  collection?: string;
  gift?: boolean;
  stockStatus?: Product["stockStatus"];
};

const pluckingStandardFor = (category: string) => {
  if (category === "tra-dinh") return "Một tôm (chỉ búp non chưa mở)";
  if (category === "non-tom") return "Một tôm, một lá non";
  if (category === "moc-cau") return "Một tôm, hai lá non";
  if (["bo-tra", "hop-qua"].includes(category)) return "Tùy phẩm trà trong bộ";
  return "Búp và lá non; tiêu chuẩn tùy từng lô";
};

const dryLeafFor = (category: string) => {
  if (category === "tra-dinh") return "Cánh rất nhỏ, săn chắc, thiên thẳng";
  if (category === "non-tom") return "Cánh nhỏ, mảnh, xoăn gọn";
  if (category === "moc-cau") return "Cánh xoăn chắc, cong như móc câu";
  if (["bo-tra", "hop-qua"].includes(category)) return "Tùy phẩm trà trong bộ";
  return "Cánh xoăn, kích thước và độ đồng đều tùy từng lô";
};

const descriptionFor = (seed: Seed) => {
  if (seed.category === "tra-dinh")
    return `${seed.name} được xếp trong nhóm thương mại Trà Đinh, thường chỉ tuyển búp non chưa mở. Cánh thành phẩm nhỏ, săn và cần được pha ở nhiệt độ vừa phải để giữ vị cân bằng.`;
  if (seed.category === "non-tom")
    return `${seed.name} thường được làm từ một búp non và một lá non liền kề. So với Móc Câu, cánh trà thanh hơn và hợp với người thích vị chát dịu, hậu ngọt gọn.`;
  if (seed.category === "moc-cau")
    return `${seed.name} thường dùng một búp cùng hai lá non. Sau khi vò và sao, cánh trà xoăn cong gợi hình móc câu, cho vị rõ và phù hợp để uống hằng ngày.`;
  if (seed.category === "tra-bup")
    return `${seed.name} thuộc nhóm trà xanh truyền thống, có cánh lớn hơn các phẩm tuyển búp. Tiêu chuẩn hái và cảm quan có thể thay đổi theo giống chè, mùa vụ và từng mẻ sao.`;
  if (seed.category === "uop-sen")
    return `${seed.name} kết hợp nền trà xanh với hương sen. Pha bằng nước dịu nhiệt để hương hoa không lấn át vị trà.`;
  if (seed.category === "uop-nhai")
    return `${seed.name} có nền trà xanh và hương nhài thanh sáng, phù hợp khi muốn một chén trà nhẹ nhàng, dễ làm quen.`;
  if (seed.category === "tui-loc")
    return `${seed.name} được chia sẵn theo khẩu phần để pha nhanh bằng cốc, phù hợp tại văn phòng hoặc khi di chuyển.`;
  if (seed.category === "bo-tra")
    return `${seed.name} gom nhiều phẩm trà trong định lượng nhỏ, giúp so sánh dáng cánh, hương và độ đậm trước khi chọn gói lớn.`;
  return `${seed.name} được chuẩn bị như một lựa chọn quà tặng gọn gàng, ưu tiên thông tin phẩm trà rõ và cách pha dễ theo.`;
};

const seeds: Seed[] = [
  {
    name: "Trà Đinh Tân Cương",
    slug: "dinh-ngoc-suong-mai",
    category: "tra-dinh",
    region: "Tân Cương",
    grade: "Trà Đinh",
    aroma: ["cốm non", "hoa cau"],
    taste: ["vị dày", "ngọt thanh"],
    price: 1_280_000,
    badges: ["Tuyển chọn"],
    collection: "cao-cap",
  },
  {
    name: "Trà Đinh Tuyển Búp Tân Cương",
    slug: "dinh-thuong-hang-binh-minh",
    category: "tra-dinh",
    region: "Tân Cương",
    grade: "Trà Đinh",
    aroma: ["cốm", "hạt dẻ"],
    taste: ["đậm", "ngọt sâu"],
    price: 860_000,
    badges: ["Dễ bắt đầu"],
    collection: "cao-cap",
  },
  {
    name: "Trà Nõn Tôm La Bằng",
    slug: "non-tom-suong-nui",
    category: "non-tom",
    region: "La Bằng",
    grade: "Trà Nõn Tôm",
    aroma: ["lá non", "hoa trắng"],
    taste: ["êm", "hậu ngọt"],
    price: 520_000,
    badges: ["Mùa xuân"],
    collection: "vu-moi",
  },
  {
    name: "Trà Nõn Tôm Tân Cương",
    slug: "non-tom-tan-cuong",
    category: "non-tom",
    region: "Tân Cương",
    grade: "Trà Nõn Tôm",
    aroma: ["cốm rang", "mật nhẹ"],
    taste: ["chát dịu", "ngọt bền"],
    price: 580_000,
    badges: ["Dễ bắt đầu"],
  },
  {
    name: "Trà Móc Câu Trại Cài",
    slug: "moc-cau-doi-gio",
    category: "moc-cau",
    region: "Trại Cài",
    grade: "Trà Móc Câu",
    aroma: ["cỏ non", "gỗ ấm"],
    taste: ["đậm vừa", "sạch vị"],
    price: 320_000,
    collection: "hang-ngay",
  },
  {
    name: "Trà Móc Câu Tân Cương",
    slug: "moc-cau-tan-cuong",
    category: "moc-cau",
    region: "Tân Cương",
    grade: "Trà Móc Câu",
    aroma: ["cốm", "hạt rang"],
    taste: ["chát êm", "ngọt nhẹ"],
    price: 360_000,
    badges: ["Dùng hằng ngày"],
  },
  {
    name: "Trà Búp Trại Cài",
    slug: "tra-bup-ban-mai",
    category: "tra-bup",
    region: "Trại Cài",
    grade: "Trà Búp",
    aroma: ["lá xanh", "hương nắng"],
    taste: ["rõ vị", "hậu gọn"],
    price: 220_000,
    collection: "hang-ngay",
  },
  {
    name: "Trà Xanh Trung Du Tân Cương",
    slug: "tan-cuong-trung-du",
    category: "tra-bup",
    region: "Tân Cương",
    grade: "Trà xanh truyền thống",
    aroma: ["cốm nhẹ", "tre non"],
    taste: ["cân bằng", "dễ uống"],
    price: 290_000,
  },
  {
    name: "Trà Xanh La Bằng",
    slug: "la-bang-may-som",
    category: "tra-bup",
    region: "La Bằng",
    grade: "Trà xanh truyền thống",
    aroma: ["hoa rừng", "cốm"],
    taste: ["mềm", "hậu sâu"],
    price: 470_000,
    badges: ["Mùa xuân"],
    collection: "vu-moi",
  },
  {
    name: "Trà Xanh Khe Cốc",
    slug: "trai-cai-moc-vi",
    category: "tra-bup",
    region: "Khe Cốc",
    grade: "Trà xanh truyền thống",
    aroma: ["mộc", "lá non"],
    taste: ["đậm", "ngọt gọn"],
    price: 410_000,
  },
  {
    name: "Trà Búp Khe Cốc",
    slug: "tra-xanh-huu-co",
    category: "tra-bup",
    region: "Khe Cốc",
    grade: "Trà Búp",
    aroma: ["cỏ ngọt", "hoa cỏ"],
    taste: ["thanh", "sạch"],
    price: 450_000,
    badges: ["Dùng hằng ngày"],
  },
  {
    name: "Trà Xanh Ướp Sen",
    slug: "sen-ho-nui-coc",
    category: "uop-sen",
    region: "Núi Cốc",
    grade: "Ướp hương",
    aroma: ["hương sen", "trà xanh"],
    taste: ["mượt", "thanh hoa"],
    price: 620_000,
    badges: ["Ướp hương"],
    gift: true,
  },
  {
    name: "Trà Xanh Ướp Nhài Tân Cương",
    slug: "nhai-som-tan-cuong",
    category: "uop-nhai",
    region: "Tân Cương",
    grade: "Ướp hương",
    aroma: ["hoa nhài", "cốm"],
    taste: ["thanh", "hậu hoa"],
    price: 390_000,
  },
  {
    name: "Túi Lọc Trà Xanh 20 Gói",
    slug: "tui-loc-tra-xanh",
    category: "tui-loc",
    region: "Thái Nguyên",
    grade: "Tiện dụng",
    aroma: ["lá xanh"],
    taste: ["nhẹ", "dễ uống"],
    price: 145_000,
  },
  {
    name: "Bộ Thử Bốn Phẩm Trà",
    slug: "bo-thu-bon-pham-tra",
    category: "bo-tra",
    region: "Thái Nguyên",
    grade: "Bộ thưởng thức",
    aroma: ["cốm", "hoa", "hạt rang"],
    taste: ["từ nhẹ đến đậm"],
    price: 380_000,
    badges: ["Khám phá"],
    gift: true,
  },
  {
    name: "Hộp Quà Sương Trên Đồi",
    slug: "hop-qua-suong-tren-doi",
    category: "hop-qua",
    region: "Tân Cương",
    grade: "Quà biếu",
    aroma: ["cốm non", "hoa sen"],
    taste: ["tinh tế", "hậu dài"],
    price: 780_000,
    badges: ["Quà biếu"],
    collection: "qua-bieu",
    gift: true,
  },
  {
    name: "Hộp Quà Tri Ân",
    slug: "hop-qua-tri-an",
    category: "hop-qua",
    region: "Thái Nguyên",
    grade: "Quà biếu",
    aroma: ["cốm rang", "hoa nhài"],
    taste: ["cân bằng", "dễ thưởng"],
    price: 640_000,
    badges: ["Quà doanh nghiệp"],
    collection: "qua-bieu",
    gift: true,
  },
  {
    name: "Ấm Gốm Tro Trấu 180 ml",
    slug: "am-gom-tro-trau",
    category: "tra-cu",
    region: "Bát Tràng",
    grade: "Trà cụ",
    aroma: ["không áp dụng"],
    taste: ["không áp dụng"],
    price: 690_000,
    badges: ["Thủ công"],
    stockStatus: "low-stock",
  },
  {
    name: "Bộ Chén Men Ngà",
    slug: "bo-chen-men-nga",
    category: "tra-cu",
    region: "Bát Tràng",
    grade: "Trà cụ",
    aroma: ["không áp dụng"],
    taste: ["không áp dụng"],
    price: 520_000,
    badges: ["Thủ công"],
  },
  {
    name: "Khay Tre Thưởng Trà",
    slug: "khay-tre-thuong-tra",
    category: "tra-cu",
    region: "Việt Nam",
    grade: "Trà cụ",
    aroma: ["tre tự nhiên"],
    taste: ["không áp dụng"],
    price: 340_000,
  },
  {
    name: "Trà Đinh Gói Thử",
    slug: "dinh-ngoc-goi-thu",
    category: "tra-dinh",
    region: "Tân Cương",
    grade: "Trà Đinh",
    aroma: ["cốm non", "hoa lan"],
    taste: ["vị dày", "ngọt dài"],
    price: 1_180_000,
    badges: ["Gói thử"],
  },
  {
    name: "Trà Móc Câu La Bằng",
    slug: "moc-cau-sao-tay",
    category: "moc-cau",
    region: "La Bằng",
    grade: "Trà Móc Câu",
    aroma: ["khói rất nhẹ", "cốm"],
    taste: ["đậm vừa", "ấm"],
    price: 350_000,
  },
  {
    name: "Trà Búp Đồng Hỷ",
    slug: "tra-bup-vuon-nha",
    category: "tra-bup",
    region: "Đồng Hỷ",
    grade: "Trà Búp",
    aroma: ["lá xanh", "gạo rang"],
    taste: ["mộc", "hậu ngắn"],
    price: 195_000,
    stockStatus: "low-stock",
  },
  {
    name: "Bình Ủ Trà Du Hành",
    slug: "binh-u-tra-du-hanh",
    category: "tra-cu",
    region: "Việt Nam",
    grade: "Trà cụ",
    aroma: ["không áp dụng"],
    taste: ["không áp dụng"],
    price: 420_000,
    stockStatus: "out-of-stock",
  },
  {
    name: "Trà Xanh Ướp Hoa Bưởi",
    slug: "tra-xanh-uop-hoa-buoi",
    category: "uop-sen",
    region: "Tân Cương",
    grade: "Ướp hương cao cấp",
    aroma: ["hoa bưởi", "cốm"],
    taste: ["thanh", "ngọt sâu"],
    price: 850_000,
    badges: ["Đặc sản"],
    collection: "cao-cap",
  },
  {
    name: "Trà Tuyết Thái Nguyên",
    slug: "tra-tuyet-thai-nguyen",
    category: "non-tom",
    region: "La Bằng",
    grade: "Trà Tuyết",
    aroma: ["sương sớm", "thảo mộc"],
    taste: ["dày dặn", "ngọt dài"],
    price: 1_450_000,
    badges: ["Thượng hạng"],
    collection: "cao-cap",
  },
  {
    name: "Trà Móc Câu Thu Phân",
    slug: "tra-moc-cau-thu-phan",
    category: "moc-cau",
    region: "Tân Cương",
    grade: "Trà Móc Câu",
    aroma: ["lá khô", "hạt rang"],
    taste: ["đậm đà", "hậu trầm"],
    price: 450_000,
    badges: ["Mùa thu"],
    collection: "hang-ngay",
  },
  {
    name: "Lọc Trà Gốm Mộc",
    slug: "loc-tra-gom-moc",
    category: "tra-cu",
    region: "Bát Tràng",
    grade: "Trà cụ",
    aroma: ["không áp dụng"],
    taste: ["không áp dụng"],
    price: 120_000,
    badges: ["Thủ công"],
  },
  {
    name: "Hộp Quà Thưởng Trà Mùa Xuân",
    slug: "hop-qua-thuong-tra-mua-xuan",
    category: "hop-qua",
    region: "Thái Nguyên",
    grade: "Quà biếu",
    aroma: ["hương hoa", "trà xanh"],
    taste: ["tinh tế", "cân bằng"],
    price: 1_250_000,
    badges: ["Quà VIP"],
    collection: "qua-bieu",
    gift: true,
  },
];

export const products: Product[] = seeds.map((seed, index) => {
  const isTeaware = seed.category === "tra-cu";
  return {
    id: `p-${String(index + 1).padStart(3, "0")}`,
    slug: seed.slug,
    sku: `MS-${String(index + 1).padStart(3, "0")}`,
    name: seed.name,
    shortDescription: isTeaware
      ? `${seed.grade} · ${seed.region}`
      : `${seed.aroma.slice(0, 2).join(", ")} · ${seed.taste.slice(0, 2).join(", ")}`,
    description: isTeaware
      ? `${seed.name} được chọn để tạo một bàn trà gọn, bền và dễ dùng mỗi ngày. Thông tin vật liệu và nơi sản xuất được công bố theo hồ sơ của từng lô hàng.`
      : descriptionFor(seed),
    category: seed.category,
    collection: seed.collection,
    region: seed.region,
    teaGarden: isTeaware ? undefined : `Vườn liên kết ${seed.region}`,
    grade: seed.grade,
    harvestSeason: isTeaware ? "Không áp dụng" : "Xuân 2026",
    harvestDate: isTeaware ? undefined : "2026-04-18",
    pluckingStandard: isTeaware
      ? "Không áp dụng"
      : pluckingStandardFor(seed.category),
    cultivar:
      isTeaware || !seed.name.includes("Trung Du") ? undefined : "Trung Du",
    dryLeaf: isTeaware ? "Không áp dụng" : dryLeafFor(seed.category),
    aroma: seed.aroma,
    liquorColor: isTeaware
      ? "Không áp dụng"
      : "Vàng xanh trong (cảm quan tham khảo)",
    taste: seed.taste,
    aftertaste: isTeaware
      ? "Không áp dụng"
      : "Ngọt thanh lưu nhẹ nơi cuống họng",
    caffeineLevel: isTeaware ? "low" : index % 3 === 0 ? "high" : "medium",
    brewingMethods: methods,
    storageInstructions: isTeaware
      ? "Rửa bằng nước ấm, hong khô hoàn toàn trước khi cất."
      : "Đậy kín, tránh ánh sáng, nhiệt và mùi mạnh; dùng muỗng khô.",
    shelfLife: isTeaware ? "Không áp dụng" : "12 tháng từ ngày đóng gói",
    certifications: [],
    badges: seed.badges ?? [],
    variants: isTeaware
      ? [
          {
            id: `${seed.slug}-unit`,
            label: "1 sản phẩm",
            packaging: "hop-thiec",
            price: seed.price,
            stock: seed.stockStatus === "out-of-stock" ? 0 : 7,
          },
        ]
      : makeVariants(seed.slug, seed.price, seed.gift),
    images: productImage(seed.name, seed.category, seed.slug),
    rating: 4.4 + (index % 5) * 0.1,
    reviewCount: 8 + index * 3,
    stockStatus: seed.stockStatus ?? "in-stock",
    featured: index < 12 || Boolean(seed.collection),
    relatedProductIds: [
      `p-${String(((index + 1) % seeds.length) + 1).padStart(3, "0")}`,
      `p-${String(((index + 2) % seeds.length) + 1).padStart(3, "0")}`,
    ],
  };
});

export const categories = [
  {
    slug: "tra-dinh",
    name: "Trà Đinh",
    description:
      "Chỉ tuyển búp non chưa mở; cánh rất nhỏ và săn chắc. Đây là quy ước phẩm trà, không phải tên giống chè.",
    image: "/images/catalog-tra-dinh.webp",
  },
  {
    slug: "non-tom",
    name: "Trà Nõn Tôm",
    description:
      "Thường hái một tôm một lá non; cánh thanh, cân bằng giữa hương và vị.",
    image: "/images/catalog-tra-non-tom.webp",
  },
  {
    slug: "moc-cau",
    name: "Trà Móc Câu",
    description:
      "Thường hái một tôm hai lá; cánh xoăn chắc, cong như móc câu và vị đậm hơn.",
    image: "/images/catalog-tra-moc-cau.webp",
  },
  {
    slug: "tra-bup",
    name: "Trà Búp",
    description:
      "Tên nhóm trà xanh phổ thông; tiêu chuẩn búp và lá non cần xem theo từng lô.",
    image: "/images/catalog-tra-bup.webp",
  },
  {
    slug: "hop-qua",
    name: "Hộp quà",
    description: "Bộ trà trình bày trang nhã cho dịp tri ân.",
    image: "/images/catalog-hop-qua.webp",
  },
  {
    slug: "tra-cu",
    name: "Trà cụ",
    description: "Ấm, chén và dụng cụ cho một bàn trà gọn.",
    image: "/images/catalog-tra-cu.webp",
  },
] as const;
