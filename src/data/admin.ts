export type AdminOrder = {
  id: string;
  customer: string;
  channel: string;
  total: string;
  status: "Mới" | "Đang chuẩn bị" | "Đã giao" | "Cần gọi lại";
  updatedAt: string;
};

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  segment: "Khách mới" | "Khách thân thiết" | "Đại lý" | "Admin";
  orders: number;
  totalSpend: string;
  lastSeen: string;
  status: "Hoạt động" | "Cần xác minh" | "Tạm khóa";
};

export const adminMetrics = [
  { label: "Doanh thu hôm nay", value: "18.450.000đ", delta: "+12%" },
  { label: "Đơn chờ xử lý", value: "14", delta: "4 đơn mới" },
  { label: "Sản phẩm sắp hết", value: "6", delta: "Cần nhập kho" },
  { label: "Khách mới", value: "31", delta: "+8 tuần này" },
];

export const adminOrders: AdminOrder[] = [
  {
    id: "MS-2407",
    customer: "Nguyễn Minh Anh",
    channel: "Website",
    total: "1.240.000đ",
    status: "Mới",
    updatedAt: "08:35",
  },
  {
    id: "MS-2406",
    customer: "Công ty An Lạc",
    channel: "Quà tặng",
    total: "8.600.000đ",
    status: "Cần gọi lại",
    updatedAt: "08:12",
  },
  {
    id: "MS-2405",
    customer: "Trần Hoàng",
    channel: "Website",
    total: "680.000đ",
    status: "Đang chuẩn bị",
    updatedAt: "Hôm qua",
  },
  {
    id: "MS-2404",
    customer: "Lê Thanh Hương",
    channel: "Zalo",
    total: "420.000đ",
    status: "Đã giao",
    updatedAt: "Hôm qua",
  },
];

export const adminUsers: AdminUser[] = [
  {
    id: "USR-1024",
    name: "Nguyễn Minh Anh",
    email: "minhanh@example.com",
    segment: "Khách thân thiết",
    orders: 12,
    totalSpend: "7.820.000đ",
    lastSeen: "Hôm nay",
    status: "Hoạt động",
  },
  {
    id: "USR-1023",
    name: "Công ty An Lạc",
    email: "quatang@anlac.example",
    segment: "Đại lý",
    orders: 5,
    totalSpend: "31.400.000đ",
    lastSeen: "Hôm nay",
    status: "Cần xác minh",
  },
  {
    id: "USR-1022",
    name: "Trần Hoàng",
    email: "hoangtran@example.com",
    segment: "Khách mới",
    orders: 1,
    totalSpend: "680.000đ",
    lastSeen: "Hôm qua",
    status: "Hoạt động",
  },
  {
    id: "USR-1001",
    name: "Quản trị Mộc Sương",
    email: "admin@mocsuong.example",
    segment: "Admin",
    orders: 0,
    totalSpend: "0đ",
    lastSeen: "5 phút trước",
    status: "Hoạt động",
  },
];

export const adminTasks = [
  "Đối soát 4 hồ sơ lô trà mới trước khi mở bán",
  "Gọi lại đơn quà tặng doanh nghiệp MS-2406",
  "Cập nhật tồn kho Trà Đinh và Trà Nõn Tôm",
  "Duyệt nội dung hướng dẫn pha trà cho chiến dịch cuối tuần",
];
