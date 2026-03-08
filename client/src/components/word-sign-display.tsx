import { useEffect, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { parseTextToSignWords, type ASLWordSign, type HandShape as HandShapeType } from "@/lib/asl-word-signs";
import { HandAvatar } from "@/components/hand-avatar";

const BODY = {
  shoulderR: { x: 152, y: 90 },
  shoulderL: { x: 48, y: 90 },
  restingR: { x: 165, y: 200 },
  restingL: { x: 35, y: 200 },
};

function getArmPath(sx: number, sy: number, hx: number, hy: number, side: "left" | "right"): string {
  const dir = side === "right" ? 1 : -1;
  const ex = (sx + hx) / 2 + dir * 22;
  const ey = Math.max(sy, (sy + hy) / 2 + 10);
  return `M ${sx} ${sy} Q ${ex} ${ey} ${hx} ${hy}`;
}

function HandShapeSvg({ shape }: { shape: HandShapeType }) {
  const f = "url(#hand-skin)";
  const s = "url(#hand-outline)";
  const w = "0.7";

  switch (shape) {
    case "open":
      return (
        <g>
          <rect x="-10" y="-2" width="20" height="13" rx="3" fill={f} stroke={s} strokeWidth={w} />
          <rect x="-8" y="-15" width="3.5" height="15" rx="1.5" fill={f} stroke={s} strokeWidth={w} />
          <rect x="-3.5" y="-17" width="3.5" height="17" rx="1.5" fill={f} stroke={s} strokeWidth={w} />
          <rect x="1" y="-18" width="3.5" height="18" rx="1.5" fill={f} stroke={s} strokeWidth={w} />
          <rect x="5.5" y="-16" width="3.5" height="16" rx="1.5" fill={f} stroke={s} strokeWidth={w} />
          <line x1="-10" y1="3" x2="-16" y2="-3" stroke={f} strokeWidth="3.5" strokeLinecap="round" />
        </g>
      );
    case "fist":
      return (
        <g>
          <rect x="-11" y="-9" width="24" height="19" rx="5" fill={f} stroke={s} strokeWidth={w} />
          <line x1="-11" y1="-2" x2="-17" y2="-7" stroke={f} strokeWidth="3.5" strokeLinecap="round" />
        </g>
      );
    case "point":
      return (
        <g>
          <rect x="-10" y="-5" width="22" height="17" rx="5" fill={f} stroke={s} strokeWidth={w} />
          <rect x="1" y="-22" width="4" height="19" rx="2" fill={f} stroke={s} strokeWidth={w} />
          <line x1="-10" y1="2" x2="-16" y2="-3" stroke={f} strokeWidth="3.5" strokeLinecap="round" />
        </g>
      );
    case "spread":
      return (
        <g>
          <rect x="-10" y="-2" width="20" height="13" rx="3" fill={f} stroke={s} strokeWidth={w} />
          <rect x="-10" y="-16" width="3" height="16" rx="1.5" fill={f} stroke={s} strokeWidth={w} transform="rotate(15 -8.5 -2)" />
          <rect x="-4.5" y="-18" width="3" height="18" rx="1.5" fill={f} stroke={s} strokeWidth={w} transform="rotate(7 -3 -2)" />
          <rect x="1.5" y="-19" width="3" height="19" rx="1.5" fill={f} stroke={s} strokeWidth={w} />
          <rect x="7" y="-18" width="3" height="18" rx="1.5" fill={f} stroke={s} strokeWidth={w} transform="rotate(-7 8.5 -2)" />
          <line x1="-10" y1="3" x2="-16" y2="-3" stroke={f} strokeWidth="3.5" strokeLinecap="round" />
        </g>
      );
    case "flat":
      return (
        <g>
          <rect x="-4" y="-20" width="8" height="34" rx="3" fill={f} stroke={s} strokeWidth={w} />
        </g>
      );
    case "c_shape":
      return (
        <g>
          <path
            d="M 10 -14 Q 14 -20 8 -22 L -4 -22 Q -14 -18 -14 -8 L -14 4 Q -14 12 -4 14 L 8 14 Q 14 12 14 6"
            fill="none" stroke={f} strokeWidth="5" strokeLinecap="round"
          />
        </g>
      );
    case "pinch":
      return (
        <g>
          <ellipse cx="0" cy="0" rx="8" ry="10" fill={f} stroke={s} strokeWidth={w} />
          <circle cx="0" cy="-10" r="2.5" fill={s} opacity="0.5" />
        </g>
      );
    case "v_shape":
      return (
        <g>
          <rect x="-10" y="-5" width="22" height="17" rx="5" fill={f} stroke={s} strokeWidth={w} />
          <rect x="-2" y="-22" width="3.5" height="19" rx="1.5" fill={f} stroke={s} strokeWidth={w} transform="rotate(8 -0.25 -5)" />
          <rect x="5" y="-22" width="3.5" height="19" rx="1.5" fill={f} stroke={s} strokeWidth={w} transform="rotate(-8 6.75 -5)" />
          <line x1="-10" y1="2" x2="-16" y2="-3" stroke={f} strokeWidth="3.5" strokeLinecap="round" />
        </g>
      );
    case "ily":
      return (
        <g>
          <rect x="-8" y="-2" width="18" height="14" rx="3" fill={f} stroke={s} strokeWidth={w} />
          <rect x="-8" y="-18" width="3" height="18" rx="1.5" fill={f} stroke={s} strokeWidth={w} />
          <rect x="5" y="-20" width="3.5" height="20" rx="1.5" fill={f} stroke={s} strokeWidth={w} />
          <line x1="-8" y1="4" x2="-18" y2="-4" stroke={f} strokeWidth="4" strokeLinecap="round" />
        </g>
      );
    case "hook":
      return (
        <g>
          <rect x="-10" y="-5" width="22" height="17" rx="5" fill={f} stroke={s} strokeWidth={w} />
          <path d="M 2 -5 L 2 -16 Q 2 -20 6 -20 L 8 -18 Q 11 -14 7 -11" fill="none" stroke={f} strokeWidth="4" strokeLinecap="round" />
        </g>
      );
    default:
      return <circle cx="0" cy="0" r="10" fill={f} stroke={s} strokeWidth={w} />;
  }
}

interface FullBodySignCardProps {
  sign: ASLWordSign;
  width?: number;
}

function FullBodySignCard({ sign, width = 180 }: FullBodySignCardProps) {
  const height = (width * 280) / 200;
  const rh = sign.rightHand;
  const lh = sign.leftHand;

  const rightArmPath = getArmPath(BODY.shoulderR.x, BODY.shoulderR.y, rh.x, rh.y, "right");
  const leftArmPath = lh
    ? getArmPath(BODY.shoulderL.x, BODY.shoulderL.y, lh.x, lh.y, "left")
    : getArmPath(BODY.shoulderL.x, BODY.shoulderL.y, BODY.restingL.x, BODY.restingL.y, "left");

  return (
    <div className="flex flex-col items-center gap-3">
      <svg viewBox="0 0 200 280" width={width} height={height} className="drop-shadow-sm" data-testid="svg-body-sign">
        <defs>
          <linearGradient id="body-skin" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E8C4A0" />
            <stop offset="100%" stopColor="#D4A574" />
          </linearGradient>
          <linearGradient id="body-outline" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C49A70" />
            <stop offset="100%" stopColor="#B08860" />
          </linearGradient>
          <linearGradient id="hand-skin" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EDCFAF" />
            <stop offset="100%" stopColor="#D9B088" />
          </linearGradient>
          <linearGradient id="hand-outline" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C49A70" />
            <stop offset="100%" stopColor="#A8845E" />
          </linearGradient>
          <linearGradient id="shirt-fill" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#5B8FB9" />
            <stop offset="100%" stopColor="#4A7A9E" />
          </linearGradient>
        </defs>

        <rect x="91" y="60" width="18" height="18" rx="5" fill="url(#body-skin)" />

        <path
          d="M 48 90 Q 55 78 100 75 Q 145 78 152 90 L 148 96 L 140 185 Q 132 202 100 202 Q 68 202 60 185 L 52 96 Z"
          fill="url(#shirt-fill)" stroke="#3D6B8C" strokeWidth="0.5"
        />
        <path d="M 85 76 L 100 86 L 115 76" fill="none" stroke="#3D6B8C" strokeWidth="1" />

        <path d={leftArmPath} stroke="url(#body-skin)" strokeWidth="14" fill="none" strokeLinecap="round" opacity="0.92" />
        {lh ? (
          <g transform={`translate(${lh.x}, ${lh.y}) rotate(${lh.rotation || 0})`}>
            <HandShapeSvg shape={lh.shape} />
          </g>
        ) : (
          <circle cx={BODY.restingL.x} cy={BODY.restingL.y} r="7" fill="url(#body-skin)" stroke="url(#body-outline)" strokeWidth="0.6" />
        )}

        <ellipse cx="100" cy="28" rx="25" ry="16" fill="#4A3728" />
        <ellipse cx="100" cy="38" rx="22" ry="24" fill="url(#body-skin)" stroke="url(#body-outline)" strokeWidth="0.4" />
        <circle cx="91" cy="35" r="2.5" fill="#444" />
        <circle cx="109" cy="35" r="2.5" fill="#444" />
        <circle cx="92" cy="34" r="0.8" fill="white" />
        <circle cx="110" cy="34" r="0.8" fill="white" />
        <path d="M 86 30 Q 91 28 96 30" fill="none" stroke="#4A3728" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M 104 30 Q 109 28 114 30" fill="none" stroke="#4A3728" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M 100 40 L 98 45 Q 100 46 102 45" fill="none" stroke="url(#body-outline)" strokeWidth="0.7" strokeLinecap="round" />
        <path d="M 94 48 Q 100 52 106 48" fill="none" stroke="#B08860" strokeWidth="1" strokeLinecap="round" />

        <path d={rightArmPath} stroke="url(#body-skin)" strokeWidth="14" fill="none" strokeLinecap="round" opacity="0.92" />
        <g transform={`translate(${rh.x}, ${rh.y}) rotate(${rh.rotation || 0})`}>
          <HandShapeSvg shape={rh.shape} />
        </g>

        {sign.arrows && (
          <path
            d={sign.arrows}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="4,3"
            opacity="0.85"
          />
        )}
      </svg>

      <div className="text-center space-y-1.5 max-w-[280px]">
        <div className="flex items-center justify-center gap-1.5 flex-wrap">
          <Badge variant="outline" className="text-[10px]">{sign.startPosition}</Badge>
          {sign.twoHanded && <Badge variant="secondary" className="text-[10px]">Two-Handed</Badge>}
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">{sign.description}</p>
        <div className="space-y-0.5">
          <p className="text-[11px] text-muted-foreground">
            <span className="font-medium text-foreground">Hand:</span> {sign.handShape}
          </p>
          {sign.movement && (
            <p className="text-[11px] text-muted-foreground">
              <span className="font-medium text-foreground">Move:</span> {sign.movement}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

interface FingerspellWordProps {
  word: string;
  speed: number;
  isActive: boolean;
}

function FingerspellWord({ word, speed, isActive }: FingerspellWordProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const letters = word.toUpperCase().replace(/[^A-Z]/g, "").split("");

  useEffect(() => {
    setCurrentIndex(0);
  }, [word]);

  useEffect(() => {
    if (!isActive || letters.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % letters.length);
    }, speed);
    return () => clearInterval(interval);
  }, [letters.length, speed, isActive]);

  if (letters.length === 0) return null;

  return (
    <div className="flex flex-col items-center gap-3">
      <HandAvatar letter={letters[currentIndex] || "A"} size={140} />
      <Badge variant="outline" className="text-[10px]">Fingerspelling</Badge>
      <div className="flex flex-wrap gap-1 justify-center max-w-[250px]">
        {letters.map((l, i) => (
          <span
            key={`${i}-${l}`}
            className={`
              inline-flex items-center justify-center w-7 h-7 rounded-md text-xs font-mono font-bold transition-all duration-200
              ${i === currentIndex
                ? "bg-primary text-primary-foreground scale-110"
                : i < currentIndex
                  ? "bg-muted text-muted-foreground"
                  : "bg-card text-card-foreground border border-border"
              }
            `}
          >
            {l}
          </span>
        ))}
      </div>
    </div>
  );
}

interface WordSignDisplayProps {
  text: string;
  speed?: number;
  autoPlay?: boolean;
}

export function WordSignDisplay({ text, speed = 2500, autoPlay = true }: WordSignDisplayProps) {
  const [words, setWords] = useState<ReturnType<typeof parseTextToSignWords>>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const parsed = parseTextToSignWords(text);
    setWords(parsed);
    setCurrentWordIndex(0);
    setIsPlaying(autoPlay);
  }, [text, autoPlay]);

  const goToNext = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      setCurrentWordIndex((prev) => {
        if (prev >= words.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
      setIsVisible(true);
    }, 200);
  }, [words.length]);

  const goToPrev = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      setCurrentWordIndex((prev) => Math.max(0, prev - 1));
      setIsVisible(true);
    }, 200);
  }, []);

  useEffect(() => {
    if (!isPlaying || words.length === 0) return;
    const currentWord = words[currentWordIndex];
    const hasSign = currentWord?.sign != null;
    const delay = hasSign ? speed : speed + 500;

    const timer = setTimeout(() => {
      if (currentWordIndex < words.length - 1) {
        goToNext();
      } else {
        setIsPlaying(false);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [isPlaying, currentWordIndex, words, speed, goToNext]);

  if (words.length === 0) return null;

  const currentWord = words[currentWordIndex];

  return (
    <div className="flex flex-col items-center gap-4 w-full" data-testid="word-sign-display">
      <div
        className="transition-all duration-200"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "scale(1)" : "scale(0.95)",
        }}
      >
        <div className="flex flex-col items-center gap-2">
          <h3 className="text-xl font-bold text-foreground tracking-wide" data-testid="text-current-word">
            {currentWord.word.toUpperCase()}
          </h3>
          {currentWord.sign ? (
            <FullBodySignCard sign={currentWord.sign} width={180} />
          ) : (
            <FingerspellWord word={currentWord.word} speed={600} isActive={true} />
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 justify-center max-w-md" data-testid="word-progress-bar">
        {words.map((w, i) => (
          <button
            key={`${i}-${w.word}`}
            onClick={() => {
              setIsVisible(false);
              setTimeout(() => {
                setCurrentWordIndex(i);
                setIsVisible(true);
              }, 150);
            }}
            className={`
              px-2 py-1 rounded-md text-xs font-medium transition-all duration-200 cursor-pointer
              ${i === currentWordIndex
                ? "bg-primary text-primary-foreground"
                : i < currentWordIndex
                  ? "bg-muted text-muted-foreground"
                  : "bg-card text-card-foreground border border-border"
              }
              ${!w.sign ? "italic" : ""}
            `}
            data-testid={`button-word-${i}`}
          >
            {w.word}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <Button
          size="icon"
          variant="outline"
          onClick={goToPrev}
          disabled={currentWordIndex === 0}
          data-testid="button-prev-word"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <Button
          size="icon"
          variant={isPlaying ? "default" : "outline"}
          onClick={() => {
            if (currentWordIndex >= words.length - 1 && !isPlaying) {
              setCurrentWordIndex(0);
              setIsPlaying(true);
            } else {
              setIsPlaying(!isPlaying);
            }
          }}
          data-testid="button-play-pause"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </Button>

        <Button
          size="icon"
          variant="outline"
          onClick={goToNext}
          disabled={currentWordIndex >= words.length - 1}
          data-testid="button-next-word"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>

        <span className="text-xs text-muted-foreground ml-2" data-testid="text-word-counter">
          {currentWordIndex + 1} / {words.length}
        </span>
      </div>
    </div>
  );
}
