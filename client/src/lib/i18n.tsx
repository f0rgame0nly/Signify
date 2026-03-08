import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type Language = "en" | "ar";

const translations = {
  en: {
    nav: {
      home: "Home",
      signToText: "Sign to Text",
      textToSign: "Text to Sign",
      voiceToSign: "Voice to Sign",
      conversation: "Conversation",
      phraseLibrary: "Phrase Library",
      navigation: "Navigation",
      signBridge: "SignBridge",
      signLanguageAI: "Sign Language AI",
      bridgingGaps: "Bridging communication gaps",
    },
    home: {
      badge: "Lamya Alhamdan's Project",
      heroTitle: "Bridge the Communication Gap",
      heroSubtitle: "SignBridge translates between sign language, text, and voice in real time. Empowering deaf and hearing communities to communicate seamlessly.",
      getStarted: "Get Started",
      browsePhrases: "Browse Phrases",
      aiPowered: "AI-Powered",
      advancedRecognition: "Advanced gesture recognition",
      aslSupport: "ASL Support",
      americanSignLanguage: "American Sign Language",
      accessible: "Accessible",
      designedForEveryone: "Designed for everyone",
      translationFeatures: "Translation Features",
      tryItNow: "Try it now",
      howItWorks: "How It Works",
      step1Title: "Choose Your Mode",
      step1Desc: "Select camera, text, or voice input based on your needs.",
      step2Title: "AI Translates",
      step2Desc: "Our AI processes your input and converts it instantly.",
      step3Title: "Communicate",
      step3Desc: "See text, hear voice, or view sign language output.",
      signToTextDesc: "Use your camera to detect sign language gestures and convert them to text and voice in real time.",
      textToSignDesc: "Type any sentence and watch a visual hand avatar perform the corresponding sign language gestures.",
      voiceToSignDesc: "Speak into your microphone and see your words instantly translated into sign language visuals.",
      conversationDesc: "Real-time two-way communication with split-screen for camera and text input translation.",
      phraseLibraryDesc: "Quick-access phrases for daily communication, emergencies, medical visits, and more.",
    },
    signToText: {
      title: "Sign Language to Text",
      subtitle: "Show sign language gestures to your camera. AI will recognize them and convert to text.",
      cameraFeed: "Camera Feed",
      analyzing: "Analyzing",
      live: "Live",
      off: "Off",
      cameraOff: "Camera is off",
      startCamera: "Start Camera",
      stopCamera: "Stop Camera",
      detectedText: "Detected Text",
      clearText: "Clear Text",
      startCameraPrompt: "Start the camera and show sign language gestures to begin detection.",
      tipsTitle: "Tips for Best Results",
      tip1: "Ensure good lighting and position your hands clearly in frame.",
      tip2: "Use a plain background for better gesture recognition accuracy.",
      tip3: "Hold each sign for at least 2 seconds for best recognition.",
      cameraError: "Camera Error",
      cameraErrorDesc: "Could not access your camera. Please check permissions.",
    },
    textToSign: {
      title: "Text to Sign Language",
      subtitle: "Type any text and see each word translated into ASL signs with hand position guides and movement instructions.",
      enterText: "Enter Text",
      placeholder: "Type your message here... (e.g. 'Hello how are you')",
      wordDisplaySpeed: "Word Display Speed",
      fast: "Fast",
      slow: "Slow",
      translate: "Translate",
      signLanguageOutput: "Sign Language Output",
      wordSigns: "Word Signs",
      emptyPrompt: "Enter text and press Translate to see sign language for each word.",
      emptySubPrompt: "Common words show full ASL signs with guides. Uncommon words are fingerspelled.",
    },
    voiceToSign: {
      title: "Voice to Sign Language",
      subtitle: "Speak into your microphone and see your words translated into sign language gestures.",
      voiceInput: "Voice Input",
      processing: "Processing your speech...",
      recording: "Recording... Tap to stop",
      tapToStart: "Tap to start recording",
      transcribedText: "Transcribed Text:",
      signLanguageOutput: "Sign Language Output",
      translating: "Translating",
      emptyPrompt: "Record your voice and it will be translated into sign language gestures.",
      micError: "Microphone Error",
      micErrorDesc: "Could not access your microphone. Please check permissions.",
      transcriptionError: "Transcription Error",
      transcriptionErrorDesc: "Could not process your audio. Please try again.",
      networkError: "Network Error",
      networkErrorDesc: "Could not reach the server. Please try again.",
    },
    phrases: {
      title: "Phrase Library",
      subtitle: "Quick-access phrases for common scenarios. Tap any phrase to see its sign language or hear it spoken.",
      searchPlaceholder: "Search phrases...",
      daily: "Daily",
      emergency: "Emergency",
      medical: "Medical",
      business: "Business",
      favorites: "Favorites",
      signLanguagePreview: "Sign Language Preview",
      selectPhrase: "Select a phrase to see its sign language representation.",
      noMatch: "No phrases match your search.",
      noPhrasesInCategory: "No phrases in this category yet.",
    },
    conversation: {
      title: "Conversation Mode",
      subtitle: "Real-time two-way communication between sign language and text/voice.",
      signerCamera: "Signer (Camera)",
      speakerTextVoice: "Speaker (Text/Voice)",
      cameraOff: "Camera off",
      stop: "Stop",
      startCamera: "Start Camera",
      capture: "Capture",
      typeMessage: "Type a message...",
      typeOrSpeak: "Type or speak to show sign language here",
      conversationLog: "Conversation Log",
      startCommunicating: "Start communicating to see the conversation log here.",
      signer: "Signer",
      speaker: "Speaker",
      cameraError: "Camera Error",
      cameraErrorDesc: "Could not access camera.",
      micError: "Microphone Error",
      micErrorDesc: "Could not access microphone.",
      live: "Live",
    },
    notFound: {
      title: "404 Page Not Found",
      description: "Did you forget to add the page to the router?",
    },
  },
  ar: {
    nav: {
      home: "الرئيسية",
      signToText: "إشارة إلى نص",
      textToSign: "نص إلى إشارة",
      voiceToSign: "صوت إلى إشارة",
      conversation: "محادثة",
      phraseLibrary: "مكتبة العبارات",
      navigation: "التنقل",
      signBridge: "سين بريدج",
      signLanguageAI: "ذكاء اصطناعي للغة الإشارة",
      bridgingGaps: "نسد فجوات التواصل",
    },
    home: {
      badge: "مشروع لمياء الحمدان",
      heroTitle: "اكسر حاجز التواصل",
      heroSubtitle: "سين بريدج يترجم بين لغة الإشارة والنص والصوت في الوقت الفعلي. تمكين مجتمعات الصم والسامعين من التواصل بسلاسة.",
      getStarted: "ابدأ الآن",
      browsePhrases: "تصفح العبارات",
      aiPowered: "مدعوم بالذكاء الاصطناعي",
      advancedRecognition: "تعرف متقدم على الإيماءات",
      aslSupport: "دعم لغة الإشارة",
      americanSignLanguage: "لغة الإشارة الأمريكية",
      accessible: "سهل الوصول",
      designedForEveryone: "مصمم للجميع",
      translationFeatures: "ميزات الترجمة",
      tryItNow: "جرب الآن",
      howItWorks: "كيف يعمل",
      step1Title: "اختر وضعك",
      step1Desc: "اختر الكاميرا أو النص أو الإدخال الصوتي حسب احتياجاتك.",
      step2Title: "الذكاء الاصطناعي يترجم",
      step2Desc: "يعالج الذكاء الاصطناعي مدخلاتك ويحولها فوراً.",
      step3Title: "تواصل",
      step3Desc: "شاهد النص، استمع للصوت، أو شاهد مخرجات لغة الإشارة.",
      signToTextDesc: "استخدم الكاميرا لالتقاط إيماءات لغة الإشارة وتحويلها إلى نص وصوت في الوقت الفعلي.",
      textToSignDesc: "اكتب أي جملة وشاهد الأفاتار اليدوي يؤدي إيماءات لغة الإشارة المقابلة.",
      voiceToSignDesc: "تحدث في الميكروفون وشاهد كلماتك مترجمة فوراً إلى صور لغة الإشارة.",
      conversationDesc: "تواصل ثنائي الاتجاه في الوقت الفعلي مع شاشة مقسمة للكاميرا وترجمة إدخال النص.",
      phraseLibraryDesc: "عبارات سريعة الوصول للتواصل اليومي وحالات الطوارئ والزيارات الطبية والمزيد.",
    },
    signToText: {
      title: "لغة الإشارة إلى نص",
      subtitle: "أظهر إيماءات لغة الإشارة أمام الكاميرا. سيتعرف عليها الذكاء الاصطناعي ويحولها إلى نص.",
      cameraFeed: "بث الكاميرا",
      analyzing: "جاري التحليل",
      live: "مباشر",
      off: "مغلق",
      cameraOff: "الكاميرا مغلقة",
      startCamera: "تشغيل الكاميرا",
      stopCamera: "إيقاف الكاميرا",
      detectedText: "النص المكتشف",
      clearText: "مسح النص",
      startCameraPrompt: "شغّل الكاميرا وأظهر إيماءات لغة الإشارة لبدء الاكتشاف.",
      tipsTitle: "نصائح لأفضل النتائج",
      tip1: "تأكد من الإضاءة الجيدة وضع يديك بوضوح في الإطار.",
      tip2: "استخدم خلفية بسيطة لدقة أفضل في التعرف على الإيماءات.",
      tip3: "احتفظ بكل إشارة لمدة ثانيتين على الأقل للحصول على أفضل تعرف.",
      cameraError: "خطأ في الكاميرا",
      cameraErrorDesc: "تعذر الوصول إلى الكاميرا. يرجى التحقق من الأذونات.",
    },
    textToSign: {
      title: "نص إلى لغة الإشارة",
      subtitle: "اكتب أي نص وشاهد كل كلمة مترجمة إلى إشارات لغة الإشارة الأمريكية مع أدلة وضع اليد وتعليمات الحركة.",
      enterText: "أدخل النص",
      placeholder: "اكتب رسالتك هنا... (مثال: 'مرحباً كيف حالك')",
      wordDisplaySpeed: "سرعة عرض الكلمات",
      fast: "سريع",
      slow: "بطيء",
      translate: "ترجم",
      signLanguageOutput: "مخرجات لغة الإشارة",
      wordSigns: "إشارات الكلمات",
      emptyPrompt: "أدخل النص واضغط ترجم لرؤية لغة الإشارة لكل كلمة.",
      emptySubPrompt: "الكلمات الشائعة تظهر إشارات كاملة مع أدلة. الكلمات غير الشائعة تُهجأ بالأصابع.",
    },
    voiceToSign: {
      title: "صوت إلى لغة الإشارة",
      subtitle: "تحدث في الميكروفون وشاهد كلماتك مترجمة إلى إيماءات لغة الإشارة.",
      voiceInput: "الإدخال الصوتي",
      processing: "جاري معالجة كلامك...",
      recording: "جاري التسجيل... اضغط للإيقاف",
      tapToStart: "اضغط لبدء التسجيل",
      transcribedText: "النص المُفرَّغ:",
      signLanguageOutput: "مخرجات لغة الإشارة",
      translating: "جاري الترجمة",
      emptyPrompt: "سجل صوتك وسيتم ترجمته إلى إيماءات لغة الإشارة.",
      micError: "خطأ في الميكروفون",
      micErrorDesc: "تعذر الوصول إلى الميكروفون. يرجى التحقق من الأذونات.",
      transcriptionError: "خطأ في التفريغ",
      transcriptionErrorDesc: "تعذرت معالجة الصوت. يرجى المحاولة مرة أخرى.",
      networkError: "خطأ في الشبكة",
      networkErrorDesc: "تعذر الاتصال بالخادم. يرجى المحاولة مرة أخرى.",
    },
    phrases: {
      title: "مكتبة العبارات",
      subtitle: "عبارات سريعة الوصول لسيناريوهات شائعة. اضغط على أي عبارة لرؤية لغة الإشارة أو سماعها.",
      searchPlaceholder: "البحث في العبارات...",
      daily: "يومي",
      emergency: "طوارئ",
      medical: "طبي",
      business: "أعمال",
      favorites: "المفضلة",
      signLanguagePreview: "معاينة لغة الإشارة",
      selectPhrase: "اختر عبارة لرؤية تمثيلها بلغة الإشارة.",
      noMatch: "لا توجد عبارات تطابق بحثك.",
      noPhrasesInCategory: "لا توجد عبارات في هذه الفئة بعد.",
    },
    conversation: {
      title: "وضع المحادثة",
      subtitle: "تواصل ثنائي الاتجاه في الوقت الفعلي بين لغة الإشارة والنص/الصوت.",
      signerCamera: "المُشير (الكاميرا)",
      speakerTextVoice: "المتحدث (نص/صوت)",
      cameraOff: "الكاميرا مغلقة",
      stop: "إيقاف",
      startCamera: "تشغيل الكاميرا",
      capture: "التقاط",
      typeMessage: "اكتب رسالة...",
      typeOrSpeak: "اكتب أو تحدث لعرض لغة الإشارة هنا",
      conversationLog: "سجل المحادثة",
      startCommunicating: "ابدأ التواصل لرؤية سجل المحادثة هنا.",
      signer: "المُشير",
      speaker: "المتحدث",
      cameraError: "خطأ في الكاميرا",
      cameraErrorDesc: "تعذر الوصول إلى الكاميرا.",
      micError: "خطأ في الميكروفون",
      micErrorDesc: "تعذر الوصول إلى الميكروفون.",
      live: "مباشر",
    },
    notFound: {
      title: "404 الصفحة غير موجودة",
      description: "هل نسيت إضافة الصفحة إلى جهاز التوجيه؟",
    },
  },
} as const;

type DeepStringify<T> = {
  [K in keyof T]: T[K] extends string ? string : DeepStringify<T[K]>;
};

type TranslationKeys = DeepStringify<typeof translations.en>;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationKeys;
  dir: "ltr" | "rtl";
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("signbridge-lang") as Language) || "en";
    }
    return "en";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("signbridge-lang", lang);
  };

  useEffect(() => {
    const dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }, [language]);

  const value: LanguageContextType = {
    language,
    setLanguage,
    t: translations[language],
    dir: language === "ar" ? "rtl" : "ltr",
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
