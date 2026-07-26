export type AnalyticsEvent =
  | "view_home"
  | "view_collection"
  | "view_product"
  | "search"
  | "apply_filter"
  | "select_variant"
  | "add_to_cart"
  | "remove_from_cart"
  | "add_to_wishlist"
  | "begin_checkout"
  | "add_shipping_info"
  | "add_payment_info"
  | "purchase"
  | "newsletter_signup"
  | "contact_wholesale";

type SafePayload = Record<string, string | number | boolean | undefined>;

export const track = (event: AnalyticsEvent, payload: SafePayload = {}) => {
  if (typeof window === "undefined") return;
  if (process.env.NEXT_PUBLIC_ANALYTICS_DEBUG === "true") {
    console.info("[analytics]", event, payload);
  }
  window.dispatchEvent(
    new CustomEvent("mocsuong:analytics", { detail: { event, payload } }),
  );
};
