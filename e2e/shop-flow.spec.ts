import { expect, test } from "@playwright/test";

test("luồng chọn sản phẩm và không tràn ngang", async ({ page }) => {
  test.setTimeout(60_000);
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-hydrated", "true", {
    timeout: 20_000,
  });
  await expect(
    page.getByRole("heading", { name: /Gói hương sớm Thái Nguyên/ }),
  ).toBeVisible();
  const desktopMenu = page.getByRole("button", { name: /Khám phá trà/ });
  if (await desktopMenu.isVisible()) {
    await desktopMenu.click();
    const menuLink = page
      .locator("#mega-menu")
      .getByRole("link", { name: "Trà Nõn Tôm" });
    await expect(menuLink).toBeVisible();
    await menuLink.click();
  } else {
    const mobileTrigger = page.getByRole("button", { name: "Mở điều hướng" });
    await mobileTrigger.tap();
    const drawer = page.getByRole("dialog");
    await expect(drawer).toBeVisible();
    await drawer.getByText("Phẩm trà", { exact: true }).click();
    await drawer.getByRole("link", { name: "Trà Nõn Tôm" }).click();
  }
  await expect(page).toHaveURL(/danh-muc\/non-tom/, { timeout: 20_000 });

  await expect(page.locator(".filter-layout")).toHaveAttribute(
    "data-interactive",
    "true",
    { timeout: 20_000 },
  );
  const firstProduct = page.locator(".product-card h3 a").first();
  await firstProduct.click();
  await expect(page).toHaveURL(/san-pham\//, { timeout: 20_000 });
  await expect(page.locator(".purchase-panel h1")).toBeVisible({
    timeout: 20_000,
  });
  await page.locator(".variant-grid button:not([disabled])").first().click();
  await page.getByRole("button", { name: "Thêm vào giỏ" }).click();
  await page.getByLabel(/Giỏ hàng có/).click();
  await expect(page.getByRole("heading", { name: /Giỏ trà/ })).toBeVisible();

  const viewportWidth = await page.evaluate(
    () => document.documentElement.clientWidth,
  );
  const scrollWidth = await page.evaluate(
    () => document.documentElement.scrollWidth,
  );
  expect(scrollWidth).toBeLessThanOrEqual(viewportWidth + 1);
});

test("responsive không tràn ngang ở các breakpoint yêu cầu", async ({
  page,
}) => {
  test.setTimeout(90_000);
  await page.goto("/");
  for (const width of [360, 390, 430, 768, 1024, 1280, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    const dimensions = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      scroll: document.documentElement.scrollWidth,
    }));
    expect(dimensions.scroll, `tràn ngang tại ${width}px`).toBeLessThanOrEqual(
      dimensions.viewport + 1,
    );
  }
});
