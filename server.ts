import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini AI Client
  const getAiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY environment variable is missing.");
    }
    return new GoogleGenAI({
      apiKey: apiKey || "",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  };

  // Chatbot API Endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages, userContext } = req.body || {};
      
      if (!Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: "Invalid messages format" });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ 
          error: "Gemini API Key is not configured on the server. Please check your environment variables." 
        });
      }

      const ai = getAiClient();

      const systemInstruction = `You are 'Rentiefy AI Assistant', an expert, ultra-helpful, and friendly AI support bot for Rentiefy (https://rentiefy.com), India's premier zero-brokerage rental property and PG marketplace.

Your goal is to guide tenants and property owners, answer all queries clearly, and make their home search or listing experience smooth and hassle-free.

Key Rentiefy Features to highlight when relevant:
1. **Zero Brokerage**: Connect tenants directly with verified property owners with zero broker fees.
2. **Contact Unlock**: Reveal owner phone numbers for Rs. 10 via instant UPI payment or Razorpay.
3. **Property Search & Filters**: Search by City (Indore, Bengaluru, Mumbai, Pune, Delhi NCR, Hyderabad, Chennai, Jaipur, etc.), Area, Budget, Room Type (Single, Shared, 1BHK, 2BHK, 3BHK, Studio, House), Furnishing (Unfurnished, Semi, Fully), and Category (Student, Professional, Family).
4. **Rent Estimator / Fair Rent Calculator**: Helps users estimate fair market rent based on locality, property type, and bedrooms. URL: /rent-calculator
5. **Locality Guide & Neighborhood Insights**: Safety ratings, internet speed, public transport, nearby schools/hospitals/grocery stores, and rent trends. URL: /locality-guide
6. **Free Property Listing for Landlords**: Owners can list properties for free with photo uploads, custom deposit/maintenance settings, and boost options. URL: /list-property
7. **Landlord & Society Reviews**: Verified tenant ratings for landlords (responsiveness, maintenance, deposit refund) and society (security, cleanliness, noise level).
8. **DigiLocker KYC Verification**: Identity verification via Aadhaar/PAN/DL/Voter ID for owners and tenants to build trust badges. URL: /dashboard or KYC section.
9. **In-App Messaging & WhatsApp**: Direct chat between owners and tenants.

Guidelines:
- Keep answers concise, highly scannable (using bullet points and bold text where helpful), polite, and encouraging.
- When recommending platform tools or pages, mention actionable navigation routes or links:
  - Browse properties: /browse
  - Estimate rent: /rent-calculator
  - Locality guide: /locality-guide
  - List a property: /list-property
  - Contact human support: /contact
- If the user speaks in Hindi or Hinglish (e.g. "Mujhe Indore me 1BHK chahiye" or "Flats kaise search kare?"), respond warmly in friendly Hindi or Hinglish! If they ask in English, respond in English.
- Be practical, empathetic, and answer questions accurately. If you don't know something specific like a private phone number, guide them on how to unlock it safely through Rentiefy.`;

      // Format conversation history into prompt
      const formattedHistory = messages
        .map((m: { role: string; content: string }) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
        .join("\n\n");

      const prompt = `Conversation history:\n${formattedHistory}\n\nPlease respond to the user's latest message with helpful, accurate advice.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const responseText = response.text || "I'm sorry, I couldn't process your request right now. Please try asking again!";

      return res.json({
        reply: responseText,
      });
    } catch (err: any) {
      console.error("Error in /api/chat endpoint:", err);
      return res.status(500).json({ 
        error: err?.message || "An error occurred while generating a response from Rentiefy AI." 
      });
    }
  });

  // Vite middleware for development
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
    console.log(`Rentiefy Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
