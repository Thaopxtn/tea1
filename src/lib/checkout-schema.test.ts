import { describe, expect, it } from "vitest";

import { checkoutSchema } from "@/lib/checkout-schema";

const valid = {
  fullName: "Nguyễn Minh An",
  phone: "0912345678",
  email: "an@example.com",
  province: "Thái Nguyên",
  district: "Thành phố Thái Nguyên",
  ward: "Tân Cương",
  address: "Xóm Hồng Thái 2",
  note: "",
  payment: "cod" as const,
};

describe("checkout validation", () => {
  it("chấp nhận thông tin giao hàng hợp lệ", () => {
    expect(checkoutSchema.safeParse(valid).success).toBe(true);
  });

  it("từ chối số điện thoại Việt Nam sai", () => {
    expect(checkoutSchema.safeParse({ ...valid, phone: "1234" }).success).toBe(
      false,
    );
  });
});
