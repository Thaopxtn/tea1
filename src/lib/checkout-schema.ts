import { z } from "zod";

export const checkoutSchema = z.object({
  fullName: z.string().trim().min(2, "Vui lòng nhập họ và tên."),
  phone: z
    .string()
    .trim()
    .regex(/^(0|\+84)(3|5|7|8|9)\d{8}$/, "Số điện thoại Việt Nam chưa hợp lệ."),
  email: z.string().trim().email("Email chưa hợp lệ.").or(z.literal("")),
  province: z.string().min(2, "Vui lòng nhập tỉnh/thành."),
  district: z.string().min(2, "Vui lòng nhập quận/huyện."),
  ward: z.string().min(2, "Vui lòng nhập phường/xã."),
  address: z.string().trim().min(6, "Vui lòng nhập địa chỉ cụ thể."),
  note: z.string().max(500, "Ghi chú tối đa 500 ký tự.").optional(),
  payment: z.enum(["cod", "vnpay", "momo"]),
});

export type CheckoutValues = z.infer<typeof checkoutSchema>;
