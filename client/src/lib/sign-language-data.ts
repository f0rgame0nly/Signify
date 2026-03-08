export interface SignGesture {
  letter: string;
  description: string;
  fingerPositions: {
    thumb: string;
    index: string;
    middle: string;
    ring: string;
    pinky: string;
  };
}

export const ASL_ALPHABET: SignGesture[] = [
  { letter: "A", description: "Fist with thumb alongside", fingerPositions: { thumb: "side", index: "closed", middle: "closed", ring: "closed", pinky: "closed" } },
  { letter: "B", description: "Flat hand, fingers together, thumb tucked", fingerPositions: { thumb: "tucked", index: "up", middle: "up", ring: "up", pinky: "up" } },
  { letter: "C", description: "Curved hand like holding a cup", fingerPositions: { thumb: "curved", index: "curved", middle: "curved", ring: "curved", pinky: "curved" } },
  { letter: "D", description: "Index up, others touch thumb", fingerPositions: { thumb: "touch", index: "up", middle: "closed", ring: "closed", pinky: "closed" } },
  { letter: "E", description: "Fingers curled, thumb tucked under", fingerPositions: { thumb: "under", index: "curled", middle: "curled", ring: "curled", pinky: "curled" } },
  { letter: "F", description: "OK sign with three fingers up", fingerPositions: { thumb: "touch", index: "touch", middle: "up", ring: "up", pinky: "up" } },
  { letter: "G", description: "Index and thumb pointing sideways", fingerPositions: { thumb: "side", index: "side", middle: "closed", ring: "closed", pinky: "closed" } },
  { letter: "H", description: "Index and middle pointing sideways", fingerPositions: { thumb: "tucked", index: "side", middle: "side", ring: "closed", pinky: "closed" } },
  { letter: "I", description: "Pinky up, others closed", fingerPositions: { thumb: "closed", index: "closed", middle: "closed", ring: "closed", pinky: "up" } },
  { letter: "J", description: "Pinky up, trace J shape", fingerPositions: { thumb: "closed", index: "closed", middle: "closed", ring: "closed", pinky: "up" } },
  { letter: "K", description: "Index and middle up in V, thumb between", fingerPositions: { thumb: "between", index: "up", middle: "up", ring: "closed", pinky: "closed" } },
  { letter: "L", description: "L shape with thumb and index", fingerPositions: { thumb: "out", index: "up", middle: "closed", ring: "closed", pinky: "closed" } },
  { letter: "M", description: "Three fingers over thumb", fingerPositions: { thumb: "under", index: "over", middle: "over", ring: "over", pinky: "closed" } },
  { letter: "N", description: "Two fingers over thumb", fingerPositions: { thumb: "under", index: "over", middle: "over", ring: "closed", pinky: "closed" } },
  { letter: "O", description: "Fingers curved to touch thumb", fingerPositions: { thumb: "touch", index: "touch", middle: "touch", ring: "touch", pinky: "touch" } },
  { letter: "P", description: "Like K but pointing down", fingerPositions: { thumb: "between", index: "down", middle: "down", ring: "closed", pinky: "closed" } },
  { letter: "Q", description: "Like G but pointing down", fingerPositions: { thumb: "down", index: "down", middle: "closed", ring: "closed", pinky: "closed" } },
  { letter: "R", description: "Index and middle crossed", fingerPositions: { thumb: "closed", index: "crossed", middle: "crossed", ring: "closed", pinky: "closed" } },
  { letter: "S", description: "Fist with thumb over fingers", fingerPositions: { thumb: "over", index: "closed", middle: "closed", ring: "closed", pinky: "closed" } },
  { letter: "T", description: "Thumb between index and middle", fingerPositions: { thumb: "between", index: "closed", middle: "closed", ring: "closed", pinky: "closed" } },
  { letter: "U", description: "Index and middle together pointing up", fingerPositions: { thumb: "closed", index: "up", middle: "up", ring: "closed", pinky: "closed" } },
  { letter: "V", description: "Peace sign", fingerPositions: { thumb: "closed", index: "up", middle: "up", ring: "closed", pinky: "closed" } },
  { letter: "W", description: "Three fingers up spread", fingerPositions: { thumb: "closed", index: "up", middle: "up", ring: "up", pinky: "closed" } },
  { letter: "X", description: "Index finger hooked", fingerPositions: { thumb: "closed", index: "hooked", middle: "closed", ring: "closed", pinky: "closed" } },
  { letter: "Y", description: "Thumb and pinky out", fingerPositions: { thumb: "out", index: "closed", middle: "closed", ring: "closed", pinky: "out" } },
  { letter: "Z", description: "Index traces Z in air", fingerPositions: { thumb: "closed", index: "up", middle: "closed", ring: "closed", pinky: "closed" } },
];

export const PHRASE_CATEGORIES = [
  { id: "daily", label: "Daily Phrases", icon: "MessageCircle" },
  { id: "emergency", label: "Emergency", icon: "AlertTriangle" },
  { id: "medical", label: "Medical", icon: "Heart" },
  { id: "business", label: "Business", icon: "Briefcase" },
  { id: "custom", label: "My Phrases", icon: "Star" },
] as const;

export type PhraseCategory = typeof PHRASE_CATEGORIES[number]["id"];

export const DEFAULT_PHRASES: Record<string, string[]> = {
  daily: [
    "Hello, how are you?",
    "Thank you very much",
    "Good morning",
    "Good evening",
    "Nice to meet you",
    "My name is...",
    "Please help me",
    "I don't understand",
    "Can you repeat that?",
    "Where is the bathroom?",
    "How much does this cost?",
    "I need water",
  ],
  emergency: [
    "Call 911",
    "I need help now",
    "There is an emergency",
    "I am lost",
    "Please call the police",
    "I need an ambulance",
    "Fire! Get out!",
    "I am in danger",
  ],
  medical: [
    "I need a doctor",
    "I have pain here",
    "I am allergic to...",
    "I take medication",
    "I feel dizzy",
    "I can't breathe well",
    "I need my prescription",
    "When is my appointment?",
  ],
  business: [
    "I have a meeting at...",
    "Can I speak with the manager?",
    "I would like to schedule...",
    "Where do I sign?",
    "I agree with the terms",
    "Can you send me the document?",
    "What is the deadline?",
    "I will follow up",
  ],
};
