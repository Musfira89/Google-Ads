import express from "express";
import fetch from "node-fetch";
import { trackPurchaseEvent } from "../services/matomo.js";
import { sendGoogleAdsConversion } from "../services/googleAds.js";

const router = express.Router();

const SHOPIFY_STORE = "45mfgb-2i";
const ACCESS_TOKEN = "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";

router.post("/", async (req, res) => {
  const order = req.body;
  const orderId = order?.id;

  if (!orderId) return res.status(400).send("Order ID missing");

  try {
    const shopifyRes = await fetch(
      `https://${SHOPIFY_STORE}.myshopify.com/admin/api/2024-07/orders/${orderId}.json`,
      {
        headers: {
          "X-Shopify-Access-Token": ACCESS_TOKEN,
          "Content-Type": "application/json",
        },
      }
    );

    if (!shopifyRes.ok) {
      const errorText = await shopifyRes.text();
      throw new Error(`Shopify API error ${shopifyRes.status}: ${errorText}`);
    }

    const { order: fullOrder } = await shopifyRes.json();
    const email = fullOrder?.email || "guest@example.com";

    // Extract GCLID from order note
    const note = fullOrder?.note || "";
    const gclidMatch = note.match(/gclid=([a-zA-Z0-9-_]+)/);
    fullOrder.gclid = gclidMatch ? gclidMatch[1] : null;

    // Fire both events simultaneously
    const [matomoResult, googleResult] = await Promise.allSettled([
      trackPurchaseEvent(email, fullOrder),
      sendGoogleAdsConversion(fullOrder),
    ]);

    if (matomoResult.status === "rejected")
      console.error("❌ Matomo error:", matomoResult.reason?.message);

    if (googleResult.status === "rejected")
      console.error("❌ Google Ads error:", googleResult.reason?.message);

      console.log(`✅ All tracking completed → Order #${fullOrder.name}, Email: ${email}, GCLID: ${fullOrder.gclid || "N/A"}`);
      res.status(200).send("Tracked");
  
  } catch (err) {
    console.error("❌ Tracking failed:", err.message);
    res.status(500).send("Error tracking");
  }
});

export default router;
