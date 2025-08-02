import { getGoogleAccessToken } from "./tokenHelper.js";

const CUSTOMER_ID = "6679475907";
const CONVERSION_ACTION_ID = "7214650491";

export const sendGoogleAdsConversion = async (order) => {
  const gclid = order.gclid;
  const orderName = order.name || "UNKNOWN";
  const value = parseFloat(order.total_price || 0);
  const currency = order.currency || "USD";

  if (!gclid) {
    console.log(`⚠️ GCLID missing → Skipping Google Ads Conversion → Order: #${orderName}`);
    return;
  }

  let ACCESS_TOKEN = "";
  try {
    ACCESS_TOKEN = await getGoogleAccessToken();
  } catch (err) {
    console.error("❌ Failed to get Google access token:", err.message);
    return;
  }

  const payload = {
    conversion_action: `customers/${CUSTOMER_ID}/conversionActions/${CONVERSION_ACTION_ID}`,
    gclid,
    conversion_date_time: new Date().toISOString().replace("Z", "+00:00"),
    conversion_value: value,
    currency_code: currency,
    order_id: orderName,
  };

  try {
    const response = await fetch(
      `https://googleads.googleapis.com/v13/customers/${CUSTOMER_ID}:uploadClickConversions`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json",
          "developer-token": "1TaCBGqU9-bcXgYoASsfRw",
          "login-customer-id": "1914871196", 

        },
        body: JSON.stringify({
          conversions: [payload],
          partial_failure: false,
          validate_only: false,
        }),
      }
    );

    const text = await response.text();
    console.log(`🎯 Google Ads Conversion Hit → Order: #${orderName}, GCLID: ${gclid}, Value: ${value}`);
    console.log("✅ Google Ads conversion response:", text);
  } catch (error) {
    console.error("❌ Google Ads network error:", error.message);
  }
};
