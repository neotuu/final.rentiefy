import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Security Headers Middleware
  app.use((_req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    next();
  });

  // Limit JSON body payload size to prevent Denial-of-Service attacks
  app.use(express.json({ limit: "500kb" }));

  // Health Check Endpoint for Cloud Run / Load Balancer probes
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", service: "Rentiefy API", timestamp: new Date().toISOString() });
  });

  // Initialize Gemini AI Client safely
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

  // Secure Chatbot API Endpoint with Sanitization and Validation
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages, location } = req.body || {};
      
      if (!Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: "Invalid or empty messages payload" });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ 
          error: "Gemini API Key is not configured on the server. Please check your environment variables." 
        });
      }

      // Sanitize and cap messages history (max 15 recent messages, max 2000 chars per message)
      const sanitizedMessages = messages
        .slice(-15)
        .filter((m: any) => m && typeof m.content === "string" && m.content.trim().length > 0)
        .map((m: any) => ({
          role: m.role === "assistant" ? "Assistant" : "User",
          content: String(m.content).trim().slice(0, 2000),
        }));

      if (sanitizedMessages.length === 0) {
        return res.status(400).json({ error: "No valid message content provided" });
      }

      const ai = getAiClient();

      const systemInstruction = `You are 'Rentiefy AI Assistant', an expert, ultra-helpful, and friendly AI support bot for Rentiefy (https://rentiefy.com), India's premier zero-brokerage rental property and PG marketplace.

Your goal is to guide tenants and property owners, answer all queries clearly, and make their home search or listing experience smooth and hassle-free.

You have access to REAL-TIME GOOGLE MAPS GROUNDING data. Use real-time Google Maps information to give accurate, up-to-date details about cities, localities, tech parks, metro stations, hospitals, schools, restaurants, safety, and transportation in India.

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
- When answering location-based or place questions, leverage Google Maps Grounding data to mention exact landmarks, metro connectivity, and nearby places.
- When recommending platform tools or pages, mention actionable navigation routes or links:
  - Browse properties: /browse
  - Estimate rent: /rent-calculator
  - Locality guide: /locality-guide
  - List a property: /list-property
  - Contact human support: /contact
- If the user speaks in Hindi or Hinglish (e.g. "Mujhe Indore me 1BHK chahiye" or "Flats kaise search kare?"), respond warmly in friendly Hindi or Hinglish! If they ask in English, respond in English.
- Be practical, empathetic, and answer questions accurately.`;

      // Format conversation history safely
      const formattedHistory = sanitizedMessages
        .map((m) => `${m.role}: ${m.content}`)
        .join("\n\n");

      const prompt = `Conversation history:\n${formattedHistory}\n\nPlease respond to the user's latest message with helpful, accurate advice using Google Maps Grounding for place/locality context if requested.`;

      const latLng = location && typeof location.latitude === "number" && typeof location.longitude === "number"
        ? { latitude: location.latitude, longitude: location.longitude }
        : undefined;

      const config: any = {
        systemInstruction,
        temperature: 0.7,
        tools: [{ googleMaps: {} }],
      };

      if (latLng) {
        config.toolConfig = {
          retrievalConfig: {
            latLng,
          },
        };
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config,
      });

      const responseText = response.text || "I'm sorry, I couldn't process your request right now. Please try asking again!";

      // Extract Google Maps grounding chunks as required by Maps Grounding Skill
      const rawChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const groundingSources: { title: string; uri: string; reviewSnippets?: string[] }[] = [];

      for (const chunk of rawChunks) {
        if (chunk?.maps) {
          const maps = chunk.maps;
          const uri = maps.uri || maps.googleMapsUri || "";
          const title = maps.title || maps.name || "Google Maps Location";
          const reviewSnippets = Array.isArray(maps.placeAnswerSources?.reviewSnippets)
            ? maps.placeAnswerSources.reviewSnippets.map((r: any) => typeof r === "string" ? r : r.text || r.snippet || "")
            : [];
          
          if (uri && !groundingSources.some((s) => s.uri === uri)) {
            groundingSources.push({ title, uri, reviewSnippets });
          }
        }
      }

      return res.json({
        reply: responseText,
        groundingSources,
      });
    } catch (err: any) {
      console.error("Error in /api/chat endpoint:", err);
      return res.status(500).json({ 
        error: "An error occurred while generating a response from Rentiefy AI." 
      });
    }
  });

  // Dedicated Google Maps Grounding Endpoint for Real-Time Locality & Neighborhood Info
  app.post("/api/maps-grounding", async (req, res) => {
    try {
      const { query, city, locality, location } = req.body || {};
      const userQuery = String(query || `${locality || "locality"} in ${city || "city"} India nearby metro stations tech parks hospitals rent`).trim();

      if (!userQuery) {
        return res.status(400).json({ error: "Missing query or locality parameter" });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "Gemini API Key is not configured on the server." });
      }

      const ai = getAiClient();

      const systemInstruction = `You are Rentiefy's Real-Time Google Maps Grounding Service. Your job is to analyze localities, neighborhoods, and property areas across India using live Google Maps data.

Provide comprehensive, real-time insights about:
1. **Connectivity & Transit**: Nearby Metro Stations, Bus Stops, Railway Stations, Airport distance.
2. **Key Landmarks & Employment Hubs**: Tech parks, business centers, colleges/universities.
3. **Daily Conveniences**: Top hospitals, supermarkets, shopping malls, popular cafes & dining spots.
4. **Livability & Safety**: Neighborhood vibe, family friendliness, night safety, and transit convenience.

Format the response cleanly in readable Markdown with bold titles and bullet points.`;

      const latLng = location && typeof location.latitude === "number" && typeof location.longitude === "number"
        ? { latitude: location.latitude, longitude: location.longitude }
        : undefined;

      const config: any = {
        systemInstruction,
        temperature: 0.5,
        tools: [{ googleMaps: {} }],
      };

      if (latLng) {
        config.toolConfig = {
          retrievalConfig: { latLng },
        };
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: `Fetch real-time Google Maps information for: "${userQuery}"`,
        config,
      });

      const responseText = response.text || "No detailed Google Maps information found for this query.";

      const rawChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const groundingSources: { title: string; uri: string; reviewSnippets?: string[] }[] = [];

      for (const chunk of rawChunks) {
        if (chunk?.maps) {
          const maps = chunk.maps;
          const uri = maps.uri || maps.googleMapsUri || "";
          const title = maps.title || maps.name || "Google Maps Location";
          const reviewSnippets = Array.isArray(maps.placeAnswerSources?.reviewSnippets)
            ? maps.placeAnswerSources.reviewSnippets.map((r: any) => typeof r === "string" ? r : r.text || r.snippet || "")
            : [];
          
          if (uri && !groundingSources.some((s) => s.uri === uri)) {
            groundingSources.push({ title, uri, reviewSnippets });
          }
        }
      }

      return res.json({
        text: responseText,
        groundingSources,
        query: userQuery,
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      console.error("Error in /api/maps-grounding endpoint:", err);
      return res.status(500).json({
        error: "Failed to fetch Google Maps Grounding data.",
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
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Rentiefy Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

