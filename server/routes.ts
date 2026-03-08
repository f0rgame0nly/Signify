import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPhraseSchema } from "@shared/schema";
import { ensureCompatibleFormat, speechToText, textToSpeech } from "./replit_integrations/audio/client";
import { createOpenAIClient, models } from "./replit_integrations/openai-config";

const openai = createOpenAIClient();

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get("/api/phrases", async (_req, res) => {
    try {
      const allPhrases = await storage.getAllPhrases();
      res.json(allPhrases);
    } catch (error) {
      console.error("Error fetching phrases:", error);
      res.status(500).json({ error: "Failed to fetch phrases" });
    }
  });

  app.post("/api/phrases", async (req, res) => {
    try {
      const parsed = insertPhraseSchema.parse(req.body);
      const phrase = await storage.createPhrase(parsed);
      res.status(201).json(phrase);
    } catch (error) {
      console.error("Error creating phrase:", error);
      res.status(400).json({ error: "Invalid phrase data" });
    }
  });

  app.patch("/api/phrases/:id/favorite", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updated = await storage.toggleFavorite(id);
      if (!updated) return res.status(404).json({ error: "Phrase not found" });
      res.json(updated);
    } catch (error) {
      console.error("Error toggling favorite:", error);
      res.status(500).json({ error: "Failed to update phrase" });
    }
  });

  app.delete("/api/phrases/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deletePhrase(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting phrase:", error);
      res.status(500).json({ error: "Failed to delete phrase" });
    }
  });

  app.post("/api/analyze-sign", async (req, res) => {
    try {
      const { image } = req.body;
      if (!image) return res.status(400).json({ error: "Image data required" });

      const response = await openai.chat.completions.create({
        model: models.vision,
        messages: [
          {
            role: "system",
            content: `You are an expert ASL (American Sign Language) interpreter. Analyze the image showing hand gestures and identify the sign language being performed. 
            
Focus on:
- Hand shape and finger positions
- Hand orientation  
- Location relative to the body
- Any movement that can be inferred

Respond with ONLY the word, letter, or short phrase being signed. If you cannot identify a clear sign language gesture, or if no hands are visible, respond with exactly "" (empty). Do not explain or add context.`
          },
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: { url: `data:image/jpeg;base64,${image}` }
              },
              {
                type: "text",
                text: "What sign language gesture is being shown? Respond with only the word or letter, or empty string if none."
              }
            ]
          }
        ],
        max_completion_tokens: 50,
      });

      const rawText = response.choices[0]?.message?.content?.trim() || "";
      const text = rawText === '""' || rawText === "''" ? "" : rawText;
      res.json({ text });
    } catch (error: any) {
      console.error("Error analyzing sign:", error?.message || error);
      res.json({ text: "" });
    }
  });

  app.post("/api/transcribe", async (req, res) => {
    try {
      const { audio } = req.body;
      if (!audio) return res.status(400).json({ error: "Audio data required" });

      const rawBuffer = Buffer.from(audio, "base64");
      const { buffer: audioBuffer, format } = await ensureCompatibleFormat(rawBuffer);
      const text = await speechToText(audioBuffer, format);
      res.json({ text });
    } catch (error) {
      console.error("Error transcribing:", error);
      res.status(500).json({ error: "Failed to transcribe audio" });
    }
  });

  app.post("/api/text-to-speech", async (req, res) => {
    try {
      const { text, voice = "alloy" } = req.body;
      if (!text) return res.status(400).json({ error: "Text is required" });

      const audioBuffer = await textToSpeech(text, voice, "wav");
      const base64Audio = audioBuffer.toString("base64");
      res.json({ audio: base64Audio });
    } catch (error) {
      console.error("Error generating speech:", error);
      res.status(500).json({ error: "Failed to generate speech" });
    }
  });

  return httpServer;
}
