import { useState, useRef, useCallback, useEffect } from "react";
import { Camera, CameraOff, Volume2, Copy, Check, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/lib/i18n";

export default function SignToText() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [detectedText, setDetectedText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const captureIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  const { t } = useLanguage();

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsStreaming(true);
      }
    } catch {
      toast({
        title: t.signToText.cameraError,
        description: t.signToText.cameraErrorDesc,
        variant: "destructive",
      });
    }
  }, [toast, t]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (captureIntervalRef.current) {
      clearInterval(captureIntervalRef.current);
      captureIntervalRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
  }, []);

  const captureAndAnalyze = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || isProcessing) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
    const base64 = dataUrl.split(",")[1];

    setIsProcessing(true);
    try {
      const res = await fetch("/api/analyze-sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64 }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.text && data.text.trim()) {
          setDetectedText((prev) => {
            const newText = prev ? `${prev} ${data.text}` : data.text;
            return newText;
          });
        }
      }
    } catch {
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing]);

  useEffect(() => {
    if (isStreaming) {
      captureIntervalRef.current = setInterval(captureAndAnalyze, 3000);
    }
    return () => {
      if (captureIntervalRef.current) {
        clearInterval(captureIntervalRef.current);
      }
    };
  }, [isStreaming, captureAndAnalyze]);

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  const handleCopy = () => {
    navigator.clipboard.writeText(detectedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = async () => {
    if (!detectedText.trim() || isSpeaking) return;
    setIsSpeaking(true);
    try {
      const res = await fetch("/api/text-to-speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: detectedText }),
      });
      if (res.ok) {
        const data = await res.json();
        const audio = new Audio(`data:audio/wav;base64,${data.audio}`);
        audio.onended = () => setIsSpeaking(false);
        audio.play();
      } else {
        setIsSpeaking(false);
      }
    } catch {
      setIsSpeaking(false);
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-foreground" data-testid="text-page-title">{t.signToText.title}</h1>
          <p className="text-sm text-muted-foreground">
            {t.signToText.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card data-testid="card-camera">
            <CardContent className="pt-5 pb-4 space-y-3">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <h2 className="font-semibold text-sm text-foreground">{t.signToText.cameraFeed}</h2>
                <div className="flex items-center gap-2">
                  {isProcessing && (
                    <Badge variant="secondary">
                      <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                      {t.signToText.analyzing}
                    </Badge>
                  )}
                  {isStreaming ? (
                    <Badge variant="default">{t.signToText.live}</Badge>
                  ) : (
                    <Badge variant="secondary">{t.signToText.off}</Badge>
                  )}
                </div>
              </div>

              <div className="relative aspect-[4/3] bg-muted rounded-md overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                  data-testid="video-camera"
                />
                {!isStreaming && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                      <Camera className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">{t.signToText.cameraOff}</p>
                  </div>
                )}
                <canvas ref={canvasRef} className="hidden" />
              </div>

              <Button
                className="w-full"
                variant={isStreaming ? "destructive" : "default"}
                onClick={isStreaming ? stopCamera : startCamera}
                data-testid="button-toggle-camera"
              >
                {isStreaming ? (
                  <>
                    <CameraOff className="w-4 h-4 mr-2" />
                    {t.signToText.stopCamera}
                  </>
                ) : (
                  <>
                    <Camera className="w-4 h-4 mr-2" />
                    {t.signToText.startCamera}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card data-testid="card-detected-text">
            <CardContent className="pt-5 pb-4 space-y-3">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <h2 className="font-semibold text-sm text-foreground">{t.signToText.detectedText}</h2>
                <div className="flex items-center gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleCopy}
                    disabled={!detectedText}
                    data-testid="button-copy"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleSpeak}
                    disabled={!detectedText || isSpeaking}
                    data-testid="button-speak"
                  >
                    <Volume2 className={`w-4 h-4 ${isSpeaking ? "animate-pulse" : ""}`} />
                  </Button>
                </div>
              </div>

              <div className="min-h-[200px] p-4 bg-muted rounded-md" data-testid="text-detected-output">
                {detectedText ? (
                  <p className="text-foreground text-sm leading-relaxed whitespace-pre-wrap">{detectedText}</p>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full min-h-[180px] gap-2">
                    <Camera className="w-8 h-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground text-center">
                      {t.signToText.startCameraPrompt}
                    </p>
                  </div>
                )}
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => setDetectedText("")}
                disabled={!detectedText}
                data-testid="button-clear"
              >
                {t.signToText.clearText}
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card data-testid="card-tips">
          <CardContent className="pt-5 pb-4">
            <h3 className="font-semibold text-sm text-foreground mb-3">{t.signToText.tipsTitle}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">1</span>
                </div>
                <p className="text-xs text-muted-foreground">{t.signToText.tip1}</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">2</span>
                </div>
                <p className="text-xs text-muted-foreground">{t.signToText.tip2}</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">3</span>
                </div>
                <p className="text-xs text-muted-foreground">{t.signToText.tip3}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
