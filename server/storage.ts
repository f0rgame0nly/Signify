import { isDatabaseAvailable, db } from "./db";
import { phrases, type Phrase, type InsertPhrase } from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getAllPhrases(): Promise<Phrase[]>;
  getPhrasesByCategory(category: string): Promise<Phrase[]>;
  createPhrase(phrase: InsertPhrase): Promise<Phrase>;
  toggleFavorite(id: number): Promise<Phrase | undefined>;
  deletePhrase(id: number): Promise<void>;
}

const DEFAULT_PHRASES: Phrase[] = [
  { id: 1, text: "Hello, how are you?", category: "daily", isFavorite: true, createdAt: new Date() },
  { id: 2, text: "Thank you very much", category: "daily", isFavorite: true, createdAt: new Date() },
  { id: 3, text: "Good morning", category: "daily", isFavorite: false, createdAt: new Date() },
  { id: 4, text: "I need help now", category: "emergency", isFavorite: true, createdAt: new Date() },
  { id: 5, text: "Call 911", category: "emergency", isFavorite: false, createdAt: new Date() },
  { id: 6, text: "I need a doctor", category: "medical", isFavorite: true, createdAt: new Date() },
  { id: 7, text: "I have pain here", category: "medical", isFavorite: false, createdAt: new Date() },
  { id: 8, text: "I have a meeting at...", category: "business", isFavorite: false, createdAt: new Date() },
];

class InMemoryStorage implements IStorage {
  private phrases: Phrase[] = [...DEFAULT_PHRASES];
  private nextId = DEFAULT_PHRASES.length + 1;

  async getAllPhrases(): Promise<Phrase[]> {
    return [...this.phrases].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getPhrasesByCategory(category: string): Promise<Phrase[]> {
    return this.phrases
      .filter((p) => p.category === category)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createPhrase(phrase: InsertPhrase): Promise<Phrase> {
    const newPhrase: Phrase = {
      id: this.nextId++,
      text: phrase.text,
      category: phrase.category || "daily",
      isFavorite: phrase.isFavorite ?? false,
      createdAt: new Date(),
    };
    this.phrases.push(newPhrase);
    return newPhrase;
  }

  async toggleFavorite(id: number): Promise<Phrase | undefined> {
    const phrase = this.phrases.find((p) => p.id === id);
    if (!phrase) return undefined;
    phrase.isFavorite = !phrase.isFavorite;
    return phrase;
  }

  async deletePhrase(id: number): Promise<void> {
    this.phrases = this.phrases.filter((p) => p.id !== id);
  }
}

export class DatabaseStorage implements IStorage {
  async getAllPhrases(): Promise<Phrase[]> {
    return db.select().from(phrases).orderBy(desc(phrases.createdAt));
  }

  async getPhrasesByCategory(category: string): Promise<Phrase[]> {
    return db.select().from(phrases).where(eq(phrases.category, category)).orderBy(desc(phrases.createdAt));
  }

  async createPhrase(phrase: InsertPhrase): Promise<Phrase> {
    const [created] = await db.insert(phrases).values(phrase).returning();
    return created;
  }

  async toggleFavorite(id: number): Promise<Phrase | undefined> {
    const [existing] = await db.select().from(phrases).where(eq(phrases.id, id));
    if (!existing) return undefined;
    const [updated] = await db.update(phrases).set({ isFavorite: !existing.isFavorite }).where(eq(phrases.id, id)).returning();
    return updated;
  }

  async deletePhrase(id: number): Promise<void> {
    await db.delete(phrases).where(eq(phrases.id, id));
  }
}

export const storage: IStorage = isDatabaseAvailable
  ? new DatabaseStorage()
  : new InMemoryStorage();
