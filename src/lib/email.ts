import "server-only";

type OrderEmail = {
  orderId: string;
  email?: string;
  customerName: string;
  total: number;
};

async function sendEmailWebhook(payload: unknown) {
  const endpoint = process.env.EMAIL_WEBHOOK_URL;
  if (!endpoint) return { sent: false, mode: "disabled" as const };

  const url = new URL(endpoint);
  if (process.env.NODE_ENV === "production" && url.protocol !== "https:") {
    throw new Error("EMAIL_WEBHOOK_URL phải dùng HTTPS trong production.");
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(process.env.EMAIL_WEBHOOK_TOKEN
        ? { authorization: `Bearer ${process.env.EMAIL_WEBHOOK_TOKEN}` }
        : {}),
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(8_000),
  });
  if (!response.ok) throw new Error("Email webhook rejected the request.");
  return { sent: true, mode: "webhook" as const };
}

export async function sendOrderConfirmation(order: OrderEmail) {
  if (!order.email) return { sent: false, mode: "disabled" as const };
  return sendEmailWebhook({
    template: "order-confirmation",
    to: order.email,
    data: order,
  });
}

export async function sendContactRequest(data: {
  name: string;
  email: string;
  phone: string;
  message: string;
}) {
  return sendEmailWebhook({ template: "contact-request", data });
}

export async function subscribeNewsletter(email: string) {
  return sendEmailWebhook({
    template: "newsletter-subscribe",
    data: { email },
  });
}
