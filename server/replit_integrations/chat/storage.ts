import { isDatabaseAvailable, db } from "../../db";
import { conversations, messages } from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IChatStorage {
  getConversation(id: number): Promise<typeof conversations.$inferSelect | undefined>;
  getAllConversations(): Promise<(typeof conversations.$inferSelect)[]>;
  createConversation(title: string): Promise<typeof conversations.$inferSelect>;
  deleteConversation(id: number): Promise<void>;
  getMessagesByConversation(conversationId: number): Promise<(typeof messages.$inferSelect)[]>;
  createMessage(conversationId: number, role: string, content: string): Promise<typeof messages.$inferSelect>;
}

const inMemoryChatStorage: IChatStorage = {
  async getConversation() {
    return undefined;
  },
  async getAllConversations() {
    return [];
  },
  async createConversation(title: string) {
    return { id: 1, title, createdAt: new Date() } as any;
  },
  async deleteConversation() {},
  async getMessagesByConversation() {
    return [];
  },
  async createMessage(conversationId: number, role: string, content: string) {
    return { id: 1, conversationId, role, content, createdAt: new Date() } as any;
  },
};

const databaseChatStorage: IChatStorage = {
  async getConversation(id: number) {
    const [conversation] = await db.select().from(conversations).where(eq(conversations.id, id));
    return conversation;
  },

  async getAllConversations() {
    return db.select().from(conversations).orderBy(desc(conversations.createdAt));
  },

  async createConversation(title: string) {
    const [conversation] = await db.insert(conversations).values({ title }).returning();
    return conversation;
  },

  async deleteConversation(id: number) {
    await db.delete(messages).where(eq(messages.conversationId, id));
    await db.delete(conversations).where(eq(conversations.id, id));
  },

  async getMessagesByConversation(conversationId: number) {
    return db.select().from(messages).where(eq(messages.conversationId, conversationId)).orderBy(messages.createdAt);
  },

  async createMessage(conversationId: number, role: string, content: string) {
    const [message] = await db.insert(messages).values({ conversationId, role, content }).returning();
    return message;
  },
};

export const chatStorage: IChatStorage = isDatabaseAvailable
  ? databaseChatStorage
  : inMemoryChatStorage;
