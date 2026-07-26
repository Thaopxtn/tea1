import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { TeaFinder } from "@/components/home/tea-finder";

describe("TeaFinder", () => {
  it("hoàn tất năm câu hỏi và trả về gợi ý", () => {
    render(<TeaFinder />);
    [
      "Nhẹ, thanh",
      "Ngọt sâu",
      "Hằng ngày",
      "Dưới 400.000đ",
      "Mới bắt đầu",
    ].forEach((label) =>
      fireEvent.click(screen.getByRole("button", { name: label })),
    );
    expect(screen.getByText("Bốn lựa chọn dành cho bạn")).toBeInTheDocument();
    expect(screen.getAllByRole("article")).toHaveLength(4);
  });
});
