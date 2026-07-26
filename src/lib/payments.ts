import "server-only";

import { createHmac } from "node:crypto";

export type PaymentProvider = "vnpay" | "momo";

type PaymentRequest = {
  orderId: string;
  amount: number;
  returnUrl: string;
  ipAddress: string;
};

const requireHttps = (raw: string, allowedSuffixes: string[]) => {
  const url = new URL(raw);
  if (process.env.NODE_ENV === "production" && url.protocol !== "https:") {
    throw new Error("Cổng thanh toán phải dùng HTTPS.");
  }
  if (
    !allowedSuffixes.some(
      (suffix) =>
        url.hostname === suffix || url.hostname.endsWith(`.${suffix}`),
    )
  ) {
    throw new Error("Tên miền cổng thanh toán không được phép.");
  }
  return url;
};

const formatVnpDate = (date: Date) => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";
  return `${get("year")}${get("month")}${get("day")}${get("hour")}${get("minute")}${get("second")}`;
};

const encodeQuery = (entries: Array<[string, string]>) =>
  entries
    .sort(([left], [right]) => left.localeCompare(right))
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value).replaceAll("%20", "+")}`,
    )
    .join("&");

export function createVnpayUrl(request: PaymentRequest) {
  const terminalCode = process.env.VNPAY_TMN_CODE;
  const secret = process.env.VNPAY_HASH_SECRET;
  if (!terminalCode || !secret) throw new Error("VNPay chưa được cấu hình.");

  const endpoint = requireHttps(
    process.env.VNPAY_PAYMENT_URL ??
      "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
    ["vnpayment.vn", "vnpay.vn"],
  );
  const createdAt = new Date();
  const expiresAt = new Date(createdAt.getTime() + 15 * 60 * 1000);
  const entries: Array<[string, string]> = [
    ["vnp_Amount", String(request.amount * 100)],
    ["vnp_Command", "pay"],
    ["vnp_CreateDate", formatVnpDate(createdAt)],
    ["vnp_CurrCode", "VND"],
    ["vnp_ExpireDate", formatVnpDate(expiresAt)],
    ["vnp_IpAddr", request.ipAddress],
    ["vnp_Locale", "vn"],
    ["vnp_OrderInfo", `Thanh toan don hang ${request.orderId}`],
    ["vnp_OrderType", "other"],
    ["vnp_ReturnUrl", request.returnUrl],
    ["vnp_TmnCode", terminalCode],
    ["vnp_TxnRef", request.orderId],
    ["vnp_Version", "2.1.0"],
  ];
  const query = encodeQuery(entries);
  const secureHash = createHmac("sha512", secret).update(query).digest("hex");
  endpoint.search = `${query}&vnp_SecureHash=${secureHash}`;
  return endpoint.toString();
}

export async function createMomoUrl(request: PaymentRequest) {
  const partnerCode = process.env.MOMO_PARTNER_CODE;
  const accessKey = process.env.MOMO_ACCESS_KEY;
  const secretKey = process.env.MOMO_SECRET_KEY;
  if (!partnerCode || !accessKey || !secretKey)
    throw new Error("MoMo chưa được cấu hình.");

  const endpoint = requireHttps(
    process.env.MOMO_PAYMENT_URL ??
      "https://test-payment.momo.vn/v2/gateway/api/create",
    ["momo.vn"],
  );
  const ipnUrl = process.env.MOMO_IPN_URL
    ? new URL(process.env.MOMO_IPN_URL).toString()
    : new URL("/api/payments/momo/ipn", request.returnUrl).toString();
  if (
    process.env.NODE_ENV === "production" &&
    new URL(ipnUrl).protocol !== "https:"
  ) {
    throw new Error("MoMo IPN phải dùng HTTPS.");
  }
  const requestId = `${request.orderId}-${crypto.randomUUID()}`;
  const orderInfo = `Thanh toan don hang ${request.orderId}`;
  const requestType = "payWithMethod";
  const extraData = "";
  const rawSignature = [
    `accessKey=${accessKey}`,
    `amount=${request.amount}`,
    `extraData=${extraData}`,
    `ipnUrl=${ipnUrl}`,
    `orderId=${request.orderId}`,
    `orderInfo=${orderInfo}`,
    `partnerCode=${partnerCode}`,
    `redirectUrl=${request.returnUrl}`,
    `requestId=${requestId}`,
    `requestType=${requestType}`,
  ].join("&");
  const signature = createHmac("sha256", secretKey)
    .update(rawSignature)
    .digest("hex");

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      partnerCode,
      partnerName: "Trà Mộc Sương",
      storeId: partnerCode,
      requestId,
      amount: request.amount,
      orderId: request.orderId,
      orderInfo,
      redirectUrl: request.returnUrl,
      ipnUrl,
      lang: "vi",
      requestType,
      extraData,
      signature,
    }),
    signal: AbortSignal.timeout(10_000),
  });
  const result = (await response.json()) as {
    resultCode?: number;
    payUrl?: string;
  };
  if (!response.ok || result.resultCode !== 0 || !result.payUrl) {
    throw new Error("MoMo từ chối yêu cầu thanh toán.");
  }
  return requireHttps(result.payUrl, ["momo.vn"]).toString();
}
