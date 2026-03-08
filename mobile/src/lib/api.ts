import { Platform } from "react-native";
import Constants from "expo-constants";

const getBaseUrl = () => {
  if (Platform.OS === "web") {
    return window.location.origin;
  }
  const debuggerHost = Constants.expoConfig?.hostUri || Constants.manifest2?.extra?.expoGo?.debuggerHost;
  if (debuggerHost) {
    const host = debuggerHost.split(":")[0];
    return `http://${host}:5000`;
  }
  return "http://localhost:5000";
};

let API_BASE = getBaseUrl();

export function setApiBase(url: string) {
  API_BASE = url.replace(/\/$/, "");
}

export function getApiBase() {
  return API_BASE;
}

async function request<T = any>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const errorText = await res.text().catch(() => "Unknown error");
    throw new Error(`API error ${res.status}: ${errorText}`);
  }
  return res.json();
}

export const api = {
  analyzeSign: (image: string) =>
    request<{ text: string }>("/api/analyze-sign", {
      method: "POST",
      body: JSON.stringify({ image }),
    }),

  transcribe: (audio: string) =>
    request<{ text: string }>("/api/transcribe", {
      method: "POST",
      body: JSON.stringify({ audio }),
    }),

  textToSpeech: (text: string) =>
    request<{ audio: string }>("/api/text-to-speech", {
      method: "POST",
      body: JSON.stringify({ text }),
    }),

  getPhrases: () =>
    request<any[]>("/api/phrases"),

  createPhrase: (text: string, category: string) =>
    request("/api/phrases", {
      method: "POST",
      body: JSON.stringify({ text, category }),
    }),

  toggleFavorite: (id: number) =>
    request(`/api/phrases/${id}/favorite`, { method: "PATCH" }),

  deletePhrase: (id: number) =>
    request(`/api/phrases/${id}`, { method: "DELETE" }),
};
