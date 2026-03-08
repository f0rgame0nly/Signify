import { useState } from "react";
import { Type, Play, RotateCcw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { WordSignDisplay } from "@/components/word-sign-display";
import { useLanguage } from "@/lib/i18n";

export default function TextToSign() {
  const [inputText, setInputText] = useState("");
  const [displayText, setDisplayText] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState([2500]);
  const { t } = useLanguage();

  const handleTranslate = () => {
    if (!inputText.trim()) return;
    setDisplayText(inputText.trim());
    setIsPlaying(true);
  };

  const handleReset = () => {
    setDisplayText("");
    setIsPlaying(false);
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-foreground" data-testid="text-page-title">{t.textToSign.title}</h1>
          <p className="text-sm text-muted-foreground">
            {t.textToSign.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card data-testid="card-text-input">
            <CardContent className="pt-5 pb-4 space-y-4">
              <h2 className="font-semibold text-sm text-foreground">{t.textToSign.enterText}</h2>
              <Textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={t.textToSign.placeholder}
                className="min-h-[140px] resize-none text-sm"
                data-testid="textarea-input"
              />
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-muted-foreground">{t.textToSign.wordDisplaySpeed}</span>
                  <span className="text-xs font-mono text-muted-foreground">{(speed[0] / 1000).toFixed(1)}s</span>
                </div>
                <Slider
                  value={speed}
                  onValueChange={setSpeed}
                  min={1000}
                  max={5000}
                  step={250}
                  data-testid="slider-speed"
                />
                <div className="flex justify-between text-[11px] text-muted-foreground">
                  <span>{t.textToSign.fast}</span>
                  <span>{t.textToSign.slow}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  onClick={handleTranslate}
                  disabled={!inputText.trim()}
                  data-testid="button-translate"
                >
                  <Play className="w-4 h-4 mr-2" />
                  {t.textToSign.translate}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleReset}
                  disabled={!displayText}
                  data-testid="button-reset"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-sign-display">
            <CardContent className="pt-5 pb-4 space-y-4">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <h2 className="font-semibold text-sm text-foreground">{t.textToSign.signLanguageOutput}</h2>
                {isPlaying && displayText && (
                  <Badge variant="default">{t.textToSign.wordSigns}</Badge>
                )}
              </div>

              <div className="min-h-[360px] flex items-center justify-center bg-muted rounded-md p-4" data-testid="display-sign-output">
                {displayText && isPlaying ? (
                  <WordSignDisplay text={displayText} speed={speed[0]} autoPlay={true} />
                ) : (
                  <div className="flex flex-col items-center gap-3 text-center">
                    <div className="w-16 h-16 rounded-full bg-card flex items-center justify-center">
                      <Type className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {t.textToSign.emptyPrompt}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t.textToSign.emptySubPrompt}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
