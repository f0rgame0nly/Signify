import { isDatabaseAvailable, db } from "./db";
import { phrases } from "@shared/schema";
import { sql } from "drizzle-orm";

const SEED_PHRASES = [
  { text: "Hello, how are you?", category: "daily", isFavorite: true },
  { text: "Thank you very much", category: "daily", isFavorite: true },
  { text: "Good morning", category: "daily", isFavorite: false },
  { text: "I need help now", category: "emergency", isFavorite: true },
  { text: "Call 911", category: "emergency", isFavorite: false },
  { text: "I need a doctor", category: "medical", isFavorite: true },
  { text: "I have pain here", category: "medical", isFavorite: false },
  { text: "I have a meeting at...", category: "business", isFavorite: false },
];

export async function seedDatabase() {
  if (!isDatabaseAvailable) {
    console.log("No database connected, skipping seed.");
    return;
  }

  try {
    const existing = await db.select({ count: sql<number>`count(*)` }).from(phrases);
    if (Number(existing[0]?.count) > 0) {
      console.log("Database already has phrases, skipping seed.");
      return;
    }

    await db.insert(phrases).values(SEED_PHRASES);
    console.log(`Seeded ${SEED_PHRASES.length} phrases.`);
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}
