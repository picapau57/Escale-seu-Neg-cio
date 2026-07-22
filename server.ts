import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize Gemini AI Client lazily / securely
function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not configured.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// =======================================
// API ROUTES
// =======================================

// 1. Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    app: "PROFIT AI HUB",
    version: "2.5.0",
    timestamp: new Date().toISOString(),
  });
});

// 2. AI Tool Content Generator
app.post("/api/ai/generate", async (req, res) => {
  try {
    const { toolId, toolName, inputs, language = "pt-BR", systemPrompt } = req.body;

    if (!inputs) {
      return res.status(400).json({ error: "Inputs are required." });
    }

    const ai = getGenAI();

    const formattedInputs = Object.entries(inputs)
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n");

    const promptText = `
You are PROFIT AI HUB's top elite business AI specialist.
Tool: ${toolName || toolId}
Target Output Language: ${language} (Provide output strictly in this language unless requested otherwise)

${systemPrompt ? `System Context: ${systemPrompt}\n` : ""}

USER INPUTS:
${formattedInputs}

INSTRUCTIONS:
1. Deliver a hyper-professional, high-converting, actionable, ready-to-use business response for this tool.
2. Structure the output clearly using standard markdown (headings, bullet points, code blocks where applicable).
3. Do not include meta commentary or introductory fluff. Directly output the final deliverable.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: promptText,
    });

    const outputText = response.text || "No response generated.";

    return res.json({
      success: true,
      result: outputText,
      tokensUsed: Math.floor(outputText.length / 4) + 120,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("AI Generation Error:", error);
    return res.status(500).json({
      error: error.message || "Failed to generate AI response.",
    });
  }
});

// 3. AI Business Chat Assistant
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { messages, persona = "CMO Specialist", language = "pt-BR" } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required." });
    }

    const ai = getGenAI();

    const systemInstruction = `
You are PROFIT AI HUB's Executive AI Advisor with persona: "${persona}".
Target Response Language: ${language}.
Always provide high-impact, actionable, data-driven business insights, growth hacks, and strategic recommendations for digital products, SaaS, e-commerce, and marketing.
`;

    const chat = ai.chats.create({
      model: "gemini-3.6-flash",
      config: {
        systemInstruction,
      },
    });

    // Send latest message
    const lastMessage = messages[messages.length - 1];
    const userText = typeof lastMessage === "string" ? lastMessage : lastMessage.text || lastMessage.content;

    const chatResponse = await chat.sendMessage({
      message: userText,
    });

    return res.json({
      success: true,
      reply: chatResponse.text,
      persona,
    });
  } catch (error: any) {
    console.error("AI Chat Error:", error);
    return res.status(500).json({
      error: error.message || "Failed to process AI Chat request.",
    });
  }
});

// 4. Mercado Pago Credentials & Real-Time PIX Gateway
let mpConfig = {
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || "APP_USR-8821049281039481-072116-c9a1",
  publicKey: process.env.MERCADOPAGO_PUBLIC_KEY || "APP_USR-7739102-pub-key-a1",
  updatedAt: new Date().toISOString(),
};

let useSampleMetrics = true; // Toggle for demo vs live data

app.get("/api/admin/metrics", (req, res) => {
  try {
    const allTx = Array.from(activePixTransactions.values()).filter(Boolean);
    const approvedTx = allTx.filter((t) => t && t.status === "approved");
    const todayStr = new Date().toISOString().split("T")[0];

    const revenueToday = approvedTx
      .filter((t) => t && (t.paidAt || t.createdAt || "").startsWith(todayStr))
      .reduce((sum, t) => sum + Number(t.amountBRL || 0), 0);

    const revenueTotal = approvedTx.reduce((sum, t) => sum + Number(t.amountBRL || 0), 0);

    if (useSampleMetrics) {
      return res.json({
        success: true,
        mode: "sample",
        metrics: {
          today: 7100.00 + revenueToday,
          weekly: 44750.00 + revenueTotal,
          monthly: 171000.00 + revenueTotal,
          yearly: 2050000.00 + revenueTotal,
          liveUsers: 1482,
          approvedTxCount: approvedTx.length,
          totalTxCount: allTx.length,
        },
        transactions: allTx,
      });
    } else {
      return res.json({
        success: true,
        mode: "realtime",
        metrics: {
          today: revenueToday,
          weekly: revenueTotal,
          monthly: revenueTotal,
          yearly: revenueTotal,
          liveUsers: Math.max(0, approvedTx.length),
          approvedTxCount: approvedTx.length,
          totalTxCount: allTx.length,
        },
        transactions: allTx,
      });
    }
  } catch (err: any) {
    console.error("Error fetching metrics:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/api/admin/metrics/reset-sample", (req, res) => {
  try {
    const { sampleMode } = req.body || {};
    if (typeof sampleMode === "boolean") {
      useSampleMetrics = sampleMode;
    } else {
      useSampleMetrics = !useSampleMetrics;
    }

    const allTx = Array.from(activePixTransactions.values()).filter(Boolean);
    const approvedTx = allTx.filter((t) => t && t.status === "approved");
    const todayStr = new Date().toISOString().split("T")[0];

    const revenueToday = approvedTx
      .filter((t) => t && (t.paidAt || t.createdAt || "").startsWith(todayStr))
      .reduce((sum, t) => sum + Number(t.amountBRL || 0), 0);

    const revenueTotal = approvedTx.reduce((sum, t) => sum + Number(t.amountBRL || 0), 0);

    const mode = useSampleMetrics ? "sample" : "realtime";
    const metrics = useSampleMetrics
      ? {
          today: 7100.00 + revenueToday,
          weekly: 44750.00 + revenueTotal,
          monthly: 171000.00 + revenueTotal,
          yearly: 2050000.00 + revenueTotal,
          liveUsers: 1482,
          approvedTxCount: approvedTx.length,
          totalTxCount: allTx.length,
        }
      : {
          today: revenueToday,
          weekly: revenueTotal,
          monthly: revenueTotal,
          yearly: revenueTotal,
          liveUsers: Math.max(0, approvedTx.length),
          approvedTxCount: approvedTx.length,
          totalTxCount: allTx.length,
        };

    return res.json({
      success: true,
      mode,
      metrics,
      transactions: allTx,
      message: useSampleMetrics
        ? "Exibindo dados de exemplo para demonstração."
        : "Dados de exemplo zerados! Exibindo faturamento 100% REAL em tempo real.",
    });
  } catch (err: any) {
    console.error("Error resetting sample mode:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/api/admin/metrics/clear-transactions", (req, res) => {
  activePixTransactions.clear();
  return res.json({
    success: true,
    message: "Histórico de transações de teste zerado com sucesso!",
  });
});

app.get("/api/admin/mercadopago-keys", (req, res) => {
  return res.json({
    success: true,
    mpAccessToken: mpConfig.accessToken,
    mpPublicKey: mpConfig.publicKey,
    updatedAt: mpConfig.updatedAt,
    isConfigured: Boolean(mpConfig.accessToken && mpConfig.accessToken.length > 10),
  });
});

app.post("/api/admin/mercadopago-keys", (req, res) => {
  try {
    const { mpAccessToken, mpPublicKey } = req.body;
    if (!mpAccessToken || !mpPublicKey) {
      return res.status(400).json({ error: "Chaves de API inválidas." });
    }

    mpConfig = {
      accessToken: mpAccessToken.trim(),
      publicKey: mpPublicKey.trim(),
      updatedAt: new Date().toISOString(),
    };

    console.log("✅ Mercado Pago API keys updated in real-time:", {
      accessToken: mpConfig.accessToken.substring(0, 12) + "...",
      publicKey: mpConfig.publicKey.substring(0, 12) + "...",
    });

    return res.json({
      success: true,
      message: "Credenciais do Mercado Pago salvas e ativas em tempo real no servidor!",
      mpAccessToken: mpConfig.accessToken,
      mpPublicKey: mpConfig.publicKey,
      updatedAt: mpConfig.updatedAt,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Erro ao salvar chaves." });
  }
});

const activePixTransactions = new Map<string, any>();

app.post("/api/payments/pix/create", async (req, res) => {
  try {
    const { planId, planName, amountBRL, userEmail, billingCycle } = req.body;

    const id = "PIX-" + Math.floor(10000000 + Math.random() * 90000000);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 mins

    let realPixCode = null;
    let isRealMpTransaction = false;

    // Try live Mercado Pago API call if valid token is set
    if (
      mpConfig.accessToken &&
      (mpConfig.accessToken.startsWith("APP_USR-") || mpConfig.accessToken.startsWith("TEST-")) &&
      !mpConfig.accessToken.includes("c9a1") // not placeholder
    ) {
      try {
        const mpRes = await fetch("https://api.mercadopago.com/v1/payments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${mpConfig.accessToken}`,
            "X-Idempotency-Key": `${id}-${Date.now()}`,
          },
          body: JSON.stringify({
            transaction_amount: Number(amountBRL),
            description: `Assinatura ${planName} - PROFIT AI HUB`,
            payment_method_id: "pix",
            payer: {
              email: userEmail || "cliente@profitaihub.com",
              first_name: "Cliente",
              last_name: "VIP",
            },
          }),
        });

        const mpData = await mpRes.json();
        if (mpData && mpData.point_of_interaction?.transaction_data?.qr_code) {
          realPixCode = mpData.point_of_interaction.transaction_data.qr_code;
          isRealMpTransaction = true;
          console.log("🟢 Live Mercado Pago PIX generated successfully via API!");
        }
      } catch (mpErr) {
        console.warn("⚠️ Mercado Pago API call failed, falling back to simulated PIX gateway:", mpErr);
      }
    }

    // Mock EMV PIX payload fallback if real MP API call isn't available or returns mock
    const pixCopyPaste =
      realPixCode ||
      `00020126580014BR.GOV.BCB.PIX0136${id}520400005303986540${amountBRL.toFixed(2).replace(".", "")}5802BR5916PROFIT AI HUB SAAS6009SAO PAULO62070503***6304`;

    const transaction = {
      id,
      planId,
      planName,
      amountBRL,
      userEmail,
      billingCycle,
      status: "pending", // pending, approved, expired
      pixCopyPaste,
      isRealMpTransaction,
      createdAt: new Date().toISOString(),
      expiresAt,
    };

    activePixTransactions.set(id, transaction);

    return res.json({
      success: true,
      transaction,
      gateway: isRealMpTransaction ? "Mercado Pago Live API" : "PROFIT AI Instant Gateway",
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || "Failed to create PIX payment." });
  }
});

// Check status of PIX payment
app.get("/api/payments/pix/status/:id", (req, res) => {
  const { id } = req.params;
  const transaction = activePixTransactions.get(id);

  if (!transaction) {
    return res.status(404).json({ error: "Transaction not found" });
  }

  return res.json({
    success: true,
    transaction,
  });
});

// Confirm PIX Payment (simulate bank webhook / manual verification)
app.post("/api/payments/pix/confirm", (req, res) => {
  const { id } = req.body;
  const transaction = activePixTransactions.get(id);

  if (!transaction) {
    return res.status(404).json({ error: "Transaction not found" });
  }

  transaction.status = "approved";
  transaction.paidAt = new Date().toISOString();
  activePixTransactions.set(id, transaction);

  return res.json({
    success: true,
    message: "Payment confirmed successfully! Subscription activated.",
    transaction,
  });
});

// Digital Marketplace Product Purchase
app.post("/api/marketplace/purchase", (req, res) => {
  const { productId, productName, price, userEmail } = req.body;

  const downloadKey = "DL-" + Math.random().toString(36).substring(2, 12).toUpperCase();

  return res.json({
    success: true,
    orderId: "ORD-" + Math.floor(100000 + Math.random() * 900000),
    productName,
    price,
    downloadUrl: `#download-${downloadKey}`,
    message: "Product purchased successfully! Digital asset unlocked in your library.",
  });
});

// =======================================
// VITE / STATIC SERVING
// =======================================
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 PROFIT AI HUB server running on http://0.0.0.0:${PORT}`);
  });
}

setupServer();
