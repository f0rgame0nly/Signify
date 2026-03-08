import { useState, useRef } from "react";
import { Mic, MicOff, Loader2, Volume2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WordSignDisplay } from "@/components/word-sign-display";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/lib/i18n";

export default function VoiceToSign() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcribedText, setTranscribedText] = useState("");
  const [showSign, setShowSign] = useState(false);
  const [speed, setSpeed] = useState(800);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();
  const { t } = useLanguage();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm;codecs=opus" });
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.start(100);
      setIsRecording(true);
    } catch {
      toast({
        title: t.voiceToSign.micError,
        description: t.voiceToSign.micErrorDesc,
        variant: "destructive",
      });
    }
  };

  const stopRecording = async () => {
    return new Promise<Blob>((resolve) => {
      const recorder = mediaRecorderRef.current;
      if (!recorder || recorder.state !== "recording") {
        resolve(new Blob());
        return;
      }

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        recorder.stream.getTracks().forEach((t) => t.stop());
        resolve(blob);
      };

      recorder.stop();
    });
  };

  const handleMicClick = async () => {
    if (isRecording) {
      setIsRecording(false);
      setIsProcessing(true);

      try {
        const blob = await stopRecording();
        const reader = new FileReader();
        reader.onload = async () => {
          const base64 = (reader.result as string).split(",")[1];
          try {
            const res = await fetch("/api/transcribe", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ audio: base64 }),
            });
            if (res.ok) {
              const data = await res.json();
              setTranscribedText(data.text || "");
              setShowSign(true);
            } else {
              toast({
                title: t.voiceToSign.transcriptionError,
                description: t.voiceToSign.transcriptionErrorDesc,
                variant: "destructive",
              });
            }
          } catch {
            toast({
              title: t.voiceToSign.networkError,
              description: t.voiceToSign.networkErrorDesc,
              variant: "destructive",
            });
          } finally {
            setIsProcessing(false);
          }
        };
        reader.readAsDataURL(blob);
      } catch {
        setIsProcessing(false);
      }
    } else {
      setShowSign(false);
      setTranscribedText("");
      await startRecording();
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-foreground" data-testid="text-page-title">{t.voiceToSign.title}</h1>
          <p className="text-sm text-muted-foreground">
            {t.voiceToSign.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card data-testid="card-voice-input">
            <CardContent className="pt-5 pb-4 space-y-4">
              <h2 className="font-semibold text-sm text-foreground">{t.voiceToSign.voiceInput}</h2>

              <div className="flex flex-col items-center gap-4 py-6">
                <button
                  onClick={handleMicClick}
                  disabled={isProcessing}
                  className={`
                    w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300
                    ${isRecording
                      ? "bg-destructive text-destructive-foreground animate-pulse"
                      : isProcessing
                        ? "bg-muted text-muted-foreground"
                        : "bg-primary text-primary-foreground hover-elevate"
                    }
                  `}
                  data-testid="button-mic"
                >
                  {isProcessing ? (
                    <Loader2 className="w-10 h-10 animate-spin" />
                  ) : isRecording ? (
                    <MicOff className="w-10 h-10" />
                  ) : (
                    <Mic className="w-10 h-10" />
                  )}
                </button>
                <p className="text-sm text-muted-foreground text-center">
                  {isProcessing
                    ? t.voiceToSign.processing
                    : isRecording
                      ? t.voiceToSign.recording
                      : t.voiceToSign.tapToStart
                  }
                </p>
                {isRecording && (
                  <div className="flex items-center gap-1">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-1 bg-destructive rounded-full animate-pulse"
                        style={{
                          height: `${12 + Math.random() * 20}px`,
                          animationDelay: `${i * 0.15}s`,
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {transcribedText && (
                <div className="p-3 bg-muted rounded-md" data-testid="text-transcription">
                  <p className="text-xs text-muted-foreground mb-1">{t.voiceToSign.transcribedText}</p>
                  <p className="text-sm text-foreground">{transcribedText}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card data-testid="card-sign-output">
            <CardContent className="pt-5 pb-4 space-y-4">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <h2 className="font-semibold text-sm text-foreground">{t.voiceToSign.signLanguageOutput}</h2>
                {showSign && transcribedText && (
                  <Badge variant="default">{t.voiceToSign.translating}</Badge>
                )}
              </div>

              <div className="min-h-[360px] flex items-center justify-center bg-muted rounded-md p-4" data-testid="display-sign-output">
                {showSign && transcribedText ? (
                  <WordSignDisplay text={transcribedText} speed={2500} autoPlay={true} />
                ) : (
                  <div className="flex flex-col items-center gap-3 text-center">
                    <div className="w-16 h-16 rounded-full bg-card flex items-center justify-center">
                      <Volume2 className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {t.voiceToSign.emptyPrompt}
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
