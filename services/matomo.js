import fetch from "node-fetch";
import { URLSearchParams } from "url";

const MATOMO_URL = "https://matomo-test.sprsaas.com/matomo.php";
const SITE_ID = "1";
const TOKEN_AUTH = "4e7df3372cd7724ca6a518d4df463660"; 

const sentOrders = new Set();

export const trackPurchaseEvent = async (email, order) => {
  if (!order || !order.name || sentOrders.has(order.name)) return false;
  sentOrders.add(order.name);

  const thankYouUrl = order.order_status_url || "https://45mfgb-2i.myshopify.com";

  const params = new URLSearchParams({
    rec: "1",
    idsite: SITE_ID,
    uid: email,
    e_c: "Funnel",
    e_a: "Purchase",
    url: thankYouUrl,
    action_name: "Order Complete",
    rand: Math.random().toString(),
    ec_id: order.name, // ✅ no %23
    revenue: order.total_price || "0",
    currency: order.currency || "EUR",
  });

  if (TOKEN_AUTH) params.append("token_auth", TOKEN_AUTH); // only if needed

  const url = `${MATOMO_URL}?${params.toString()}&debug=1`;
  console.log("✅ Matomo event sending:", url);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Matomo request failed with status ${response.status} — ${text}`);
    }

    console.log(`✅ Matomo event sent for order ${order.name}`);
    return true;
  } catch (err) {
    console.error("❌ Matomo tracking failed:", err.message);
    return false;
  }
};
