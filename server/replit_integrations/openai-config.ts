import OpenAI from "openai";

const isReplit = !!(process.env.AI_INTEGRATIONS_OPENAI_API_KEY && process.env.AI_INTEGRATIONS_OPENAI_BASE_URL);

if (!isReplit && !process.env.OPENAI_API_KEY) {
  console.warn(
    "WARNING: No OpenAI API key found. AI features will not work.\n" +
    "Set OPENAI_API_KEY in your .env file (see .env.example for details)."
  );
}

export function createOpenAIClient(): OpenAI {
  if (isReplit) {
    return new OpenAI({
      apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
      baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
    });
  }
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "missing-key",
  });
}

export const models = {
  audio: isReplit ? "gpt-audio" : "gpt-4o-audio-preview",
  transcription: isReplit ? "gpt-4o-mini-transcribe" : "whisper-1",
  vision: isReplit ? "gpt-5-mini" : "gpt-4o-mini",
  chat: isReplit ? "gpt-5.1" : "gpt-4o",
  image: isReplit ? "gpt-image-1" : "dall-e-3",
};
