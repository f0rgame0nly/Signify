# SignBridge - Sign Language Translation Application

## Overview
AI-powered sign language communication platform that bridges the gap between deaf/mute individuals and the hearing community. Provides real-time two-way translation between sign language, text, and voice.

## Recent Changes
- 2026-02-28: Made project portable for local development (openai-config.ts, .env.example, LOCAL_SETUP.md)
- 2026-02-14: Upgraded to Expo SDK 54 (React 19.1.0, RN 0.81.5) for Expo Go compatibility
- 2026-02-14: Migrated from expo-av (deprecated) to expo-audio for recording/playback
- 2026-02-14: Updated react-day-picker to v9, framer-motion to v12 for React 19 compat
- 2026-02-14: Removed expo-file-system dependency from mobile screens, using fetch+FileReader for audio base64
- 2026-02-12: Added React Native/Expo mobile app in mobile/ directory
- 2026-02-12: Initial MVP build with all core features

## Architecture

### Tech Stack
- **Web Frontend**: React + TypeScript, Tailwind CSS, Shadcn UI, Wouter routing
- **Mobile Frontend**: React Native + Expo (in mobile/ directory)
- **Backend**: Express.js with TypeScript (shared between web and mobile)
- **Database**: PostgreSQL (Neon) via Drizzle ORM
- **AI**: OpenAI via Replit AI Integrations (vision, STT, TTS)

### Project Structure
```
client/src/
  pages/          - Web route pages (home, sign-to-text, text-to-sign, voice-to-sign, phrases, conversation)
  components/     - Web shared components (hand-avatar, app-sidebar, theme-provider)
  lib/            - Web utilities (sign-language-data, queryClient)
mobile/
  App.tsx         - Expo entry point with tab navigation
  app.json        - Expo configuration
  package.json    - Mobile-specific dependencies
  src/
    screens/      - 6 screens: Home, TextToSign, VoiceToSign, SignToText, Phrases, Conversation
    components/   - FullBodySign.tsx, HandAvatar.tsx (react-native-svg ports)
    lib/          - api.ts (API client), theme.ts (colors), asl-word-signs.ts (sign data)
server/
  routes.ts       - API routes (shared by web and mobile)
  storage.ts      - Database CRUD operations
  seed.ts         - Database seeding
  db.ts           - Database connection
  replit_integrations/ - OpenAI audio/chat/image modules
shared/
  schema.ts       - Drizzle schema (phrases table)
  models/chat.ts  - Chat/conversation schema
```

### Mobile App Notes
- React Native dependencies installed at root level alongside web dependencies
- Mobile app connects to Express backend API (configurable via mobile/src/lib/api.ts)
- Uses expo-camera for sign detection, expo-audio for audio recording
- SVG sign illustrations ported from web using react-native-svg
- To run: `cd mobile && npx expo start` (use --tunnel for Expo Go on remote device)

### Key Features
1. **Sign to Text**: Camera captures → GPT vision analyzes sign language → displays text
2. **Text to Sign**: User types text → animated SVG hand avatar performs ASL fingerspelling
3. **Voice to Sign**: Mic recording → OpenAI transcription → sign language display
4. **Text-to-Speech**: OpenAI gpt-audio model for natural voice output
5. **Phrase Library**: Pre-built phrases for daily, emergency, medical, business use
6. **Conversation Mode**: Split-screen two-way communication

### API Endpoints
- `GET /api/phrases` - Get all saved phrases
- `POST /api/phrases` - Create a new phrase
- `PATCH /api/phrases/:id/favorite` - Toggle favorite status
- `DELETE /api/phrases/:id` - Delete a phrase
- `POST /api/analyze-sign` - Analyze camera image for sign language (base64 image)
- `POST /api/transcribe` - Convert audio to text (base64 audio)
- `POST /api/text-to-speech` - Convert text to audio (returns base64 wav)

### Database
- `phrases` table: id, text, category, is_favorite, created_at
- `conversations` and `messages` tables (for future chat persistence)

## User Preferences
- Dark mode support via theme toggle
- Accessible design with large touch targets
