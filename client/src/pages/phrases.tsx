import { useState } from "react";
import { MessageCircle, AlertTriangle, Heart, Briefcase, Star, Search, Volume2, Hand, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SignWordDisplay } from "@/components/hand-avatar";
import { DEFAULT_PHRASES, type PhraseCategory } from "@/lib/sign-language-data";
import { useQuery } from "@tanstack/react-query";
import type { Phrase } from "@shared/schema";
import { useLanguage } from "@/lib/i18n";

export default function Phrases() {
  const [activeCategory, setActiveCategory] = useState<string>("daily");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPhrase, setSelectedPhrase] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingPhrase, setSpeakingPhrase] = useState<string | null>(null);
  const { t } = useLanguage();

  const CATEGORY_CONFIG: Record<string, { icon: typeof MessageCircle; label: string }> = {
    daily: { icon: MessageCircle, label: t.phrases.daily },
    emergency: { icon: AlertTriangle, label: t.phrases.emergency },
    medical: { icon: Heart, label: t.phrases.medical },
    business: { icon: Briefcase, label: t.phrases.business },
    custom: { icon: Star, label: t.phrases.favorites },
  };

  const { data: savedPhrases = [] } = useQuery<Phrase[]>({
    queryKey: ["/api/phrases"],
  });

  const favoritePhrases = savedPhrases.filter((p) => p.isFavorite).map((p) => p.text);

  const getCurrentPhrases = () => {
    if (activeCategory === "custom") return favoritePhrases;
    return DEFAULT_PHRASES[activeCategory] || [];
  };

  const filteredPhrases = getCurrentPhrases().filter((phrase) =>
    phrase.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSpeak = async (text: string) => {
    if (isSpeaking) return;
    setIsSpeaking(true);
    setSpeakingPhrase(text);
    try {
      const res = await fetch("/api/text-to-speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (res.ok) {
        const data = await res.json();
        const audio = new Audio(`data:audio/wav;base64,${data.audio}`);
        audio.onended = () => {
          setIsSpeaking(false);
          setSpeakingPhrase(null);
        };
        audio.play();
      } else {
        setIsSpeaking(false);
        setSpeakingPhrase(null);
      }
    } catch {
      setIsSpeaking(false);
      setSpeakingPhrase(null);
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-foreground" data-testid="text-page-title">{t.phrases.title}</h1>
          <p className="text-sm text-muted-foreground">
            {t.phrases.subtitle}
          </p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.phrases.searchPlaceholder}
            className="pl-10"
            data-testid="input-search"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <Tabs value={activeCategory} onValueChange={setActiveCategory}>
              <TabsList className="w-full">
                {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                  <TabsTrigger key={key} value={key} className="flex-1 gap-1" data-testid={`tab-${key}`}>
                    <config.icon className="w-3 h-3" />
                    <span className="hidden sm:inline">{config.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {Object.keys(CATEGORY_CONFIG).map((cat) => (
                <TabsContent key={cat} value={cat} className="mt-4">
                  <div className="space-y-2">
                    {filteredPhrases.length > 0 ? (
                      filteredPhrases.map((phrase, i) => (
                        <Card
                          key={`${cat}-${i}`}
                          className={`cursor-pointer transition-all duration-200 ${selectedPhrase === phrase ? "ring-2 ring-primary" : "hover-elevate"}`}
                          onClick={() => setSelectedPhrase(phrase)}
                          data-testid={`card-phrase-${i}`}
                        >
                          <CardContent className="py-3 px-4 flex items-center justify-between gap-3">
                            <p className="text-sm text-foreground flex-1">{phrase}</p>
                            <div className="flex items-center gap-1">
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSpeak(phrase);
                                }}
                                disabled={isSpeaking}
                                data-testid={`button-speak-${i}`}
                              >
                                {isSpeaking && speakingPhrase === phrase ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Volume2 className="w-4 h-4" />
                                )}
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedPhrase(phrase);
                                }}
                                data-testid={`button-sign-${i}`}
                              >
                                <Hand className="w-4 h-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-sm text-muted-foreground">
                          {searchQuery ? t.phrases.noMatch : t.phrases.noPhrasesInCategory}
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          <div>
            <Card className="sticky top-4" data-testid="card-sign-preview">
              <CardContent className="pt-5 pb-4 space-y-3">
                <h3 className="font-semibold text-sm text-foreground">{t.phrases.signLanguagePreview}</h3>
                <div className="min-h-[240px] flex items-center justify-center bg-muted rounded-md p-3" data-testid="display-sign-preview">
                  {selectedPhrase ? (
                    <SignWordDisplay text={selectedPhrase} speed={800} />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-center">
                      <Hand className="w-8 h-8 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">
                        {t.phrases.selectPhrase}
                      </p>
                    </div>
                  )}
                </div>
                {selectedPhrase && (
                  <p className="text-xs text-muted-foreground text-center italic">"{selectedPhrase}"</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
