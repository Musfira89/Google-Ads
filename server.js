import express from "express";
import bodyParser from "body-parser";
import webhookRoute from "./routes/webhook.js";

const app = express();
app.use(bodyParser.json());

// Routes
app.use("/shopify-webhook", webhookRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server ready on http://localhost:${PORT}`);
});
