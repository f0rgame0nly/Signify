import { useState, useRef, useCallback, useEffect } from "react";
import {
  Camera, CameraOff, Mic, MicOff, Send, Volume2, Loader2, ArrowLeftRight, Hand, Type as TypeIcon
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { WordSignDisplay } from "@/components/word-sign-display";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from "@/lib/i18n";

interface MessageItem {
  id: number;
  from: "signer" | "speaker";
  text: string;
  timestamp: Date;
}

export default function Conversation() {
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [textInput, setTextInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeSignText, setActiveSignText] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const msgIdRef = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 480, height: 360 },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsStreaming(true);
      }
    } catch {
      toast({ title: t.conversation.cameraError, description: t.conversation.cameraErrorDesc, variant: "destructive" });
    }
  }, [toast, t]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setIsStreaming(false);
  }, []);

  const captureAndAnalyze = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || isProcessing) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 480;
    canvas.height = video.videoHeight || 360;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    const base64 = canvas.toDataURL("image/jpeg", 0.7).split(",")[1];

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
          const msg: MessageItem = {
            id: ++msgIdRef.current,
            from: "signer",
            text: data.text.trim(),
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, msg]);
        }
      }
    } catch {} finally {
      setIsProcessing(false);
    }
  }, [isProcessing]);

  const sendTextMessage = async () => {
    if (!textInput.trim()) return;
    const msg: MessageItem = {
      id: ++msgIdRef.current,
      from: "speaker",
      text: textInput.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, msg]);
    setActiveSignText(textInput.trim());
    setTextInput("");
  };

  const handleVoiceInput = async () => {
    if (isRecordingVoice) {
      setIsRecordingVoice(false);
      setIsProcessing(true);

      const blob = await new Promise<Blob>((resolve) => {
        const recorder = mediaRecorderRef.current;
        if (!recorder || recorder.state !== "recording") { resolve(new Blob()); return; }
        recorder.onstop = () => {
          const b = new Blob(chunksRef.current, { type: "audio/webm" });
          recorder.stream.getTracks().forEach((t) => t.stop());
          resolve(b);
        };
        recorder.stop();
      });

      try {
        const reader = new FileReader();
        reader.onload = async () => {
          const base64 = (reader.result as string).split(",")[1];
          const res = await fetch("/api/transcribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ audio: base64 }),
          });
          if (res.ok) {
            const data = await res.json();
            if (data.text) {
              const msg: MessageItem = {
                id: ++msgIdRef.current,
                from: "speaker",
                text: data.text,
                timestamp: new Date(),
              };
              setMessages((prev) => [...prev, msg]);
              setActiveSignText(data.text);
            }
          }
          setIsProcessing(false);
        };
        reader.readAsDataURL(blob);
      } catch {
        setIsProcessing(false);
      }
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream, { mimeType: "audio/webm;codecs=opus" });
        mediaRecorderRef.current = recorder;
        chunksRef.current = [];
        recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
        recorder.start(100);
        setIsRecordingVoice(true);
      } catch {
        toast({ title: t.conversation.micError, description: t.conversation.micErrorDesc, variant: "destructive" });
      }
    }
  };

  const speakText = async (text: string) => {
    if (isSpeaking) return;
    setIsSpeaking(true);
    try {
      const res = await fetch("/api/text-to-speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
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

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-foreground" data-testid="text-page-title">{t.conversation.title}</h1>
          <p className="text-sm text-muted-foreground">
            {t.conversation.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card data-testid="card-signer-side">
            <CardContent className="pt-4 pb-3 space-y-3">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <Hand className="w-4 h-4 text-primary" />
                  <h2 className="font-semibold text-sm text-foreground">{t.conversation.signerCamera}</h2>
                </div>
                {isStreaming && <Badge variant="default">{t.conversation.live}</Badge>}
              </div>

              <div className="relative aspect-[4/3] bg-muted rounded-md overflow-hidden">
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" data-testid="video-conversation-camera" />
                {!isStreaming && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                    <Camera className="w-8 h-8 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">{t.conversation.cameraOff}</p>
                  </div>
                )}
                <canvas ref={canvasRef} className="hidden" />
              </div>

              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  variant={isStreaming ? "destructive" : "default"}
                  onClick={isStreaming ? stopCamera : startCamera}
                  data-testid="button-conversation-camera"
                >
                  {isStreaming ? <CameraOff className="w-4 h-4 mr-2" /> : <Camera className="w-4 h-4 mr-2" />}
                  {isStreaming ? t.conversation.stop : t.conversation.startCamera}
                </Button>
                {isStreaming && (
                  <Button onClick={captureAndAnalyze} disabled={isProcessing} data-testid="button-capture">
                    {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : t.conversation.capture}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-speaker-side">
            <CardContent className="pt-4 pb-3 space-y-3">
              <div className="flex items-center gap-2">
                <TypeIcon className="w-4 h-4 text-primary" />
                <h2 className="font-semibold text-sm text-foreground">{t.conversation.speakerTextVoice}</h2>
              </div>

              <div className="min-h-[360px] bg-muted rounded-md p-3 flex items-center justify-center" data-testid="display-conversation-sign">
                {activeSignText ? (
                  <WordSignDisplay text={activeSignText} speed={2000} autoPlay={true} />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full min-h-[180px] gap-2">
                    <ArrowLeftRight className="w-8 h-8 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground text-center">{t.conversation.typeOrSpeak}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Input
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder={t.conversation.typeMessage}
                  onKeyDown={(e) => e.key === "Enter" && sendTextMessage()}
                  data-testid="input-conversation-text"
                />
                <Button size="icon" onClick={sendTextMessage} disabled={!textInput.trim()} data-testid="button-send">
                  <Send className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant={isRecordingVoice ? "destructive" : "outline"}
                  onClick={handleVoiceInput}
                  disabled={isProcessing}
                  data-testid="button-voice"
                >
                  {isRecordingVoice ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card data-testid="card-conversation-log">
          <CardContent className="pt-4 pb-3 space-y-2">
            <h3 className="font-semibold text-sm text-foreground">{t.conversation.conversationLog}</h3>
            <div ref={scrollRef} className="max-h-[240px] overflow-y-auto space-y-2 p-2">
              {messages.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-6">
                  {t.conversation.startCommunicating}
                </p>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2 ${msg.from === "speaker" ? "justify-end" : "justify-start"}`}
                    data-testid={`msg-${msg.id}`}
                  >
                    <div
                      className={`max-w-[70%] px-3 py-2 rounded-md text-sm ${
                        msg.from === "signer"
                          ? "bg-muted text-foreground"
                          : "bg-primary text-primary-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-medium opacity-70">
                          {msg.from === "signer" ? t.conversation.signer : t.conversation.speaker}
                        </span>
                        {msg.from === "signer" && (
                          <button
                            onClick={() => speakText(msg.text)}
                            className="opacity-70"
                            data-testid={`button-speak-msg-${msg.id}`}
                          >
                            <Volume2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                      <p className="text-xs">{msg.text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
