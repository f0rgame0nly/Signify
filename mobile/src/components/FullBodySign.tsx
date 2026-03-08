import { useState, useEffect, useCallback, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Svg, { G, Rect, Circle, Ellipse, Path, Line, Defs, LinearGradient, Stop, RadialGradient } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedProps,
  useDerivedValue,
  withTiming,
  withRepeat,
  withSequence,
  withDelay,
  Easing,
  runOnJS,
  type SharedValue,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { parseTextToSignWords, type ASLWordSign, type HandShape as HandShapeType } from "../lib/asl-word-signs";
import { useThemeColors } from "../lib/theme";
import { HandAvatar } from "./HandAvatar";

const AnimatedPath = Animated.createAnimatedComponent(Path);

const BODY = {
  shoulderR: { x: 152, y: 90 },
  shoulderL: { x: 48, y: 90 },
  restingR: { x: 165, y: 200 },
  restingL: { x: 35, y: 200 },
};

const ANIM_DURATION = 600;
const EASE_SMOOTH = Easing.bezier(0.4, 0.0, 0.2, 1.0);
const EASE_OUT = Easing.bezier(0.0, 0.0, 0.2, 1.0);
const HAND_VIEW_SIZE = 60;

function HandShapeSvg({ shape, opacity = 1 }: { shape: HandShapeType; opacity?: number }) {
  const f = "url(#hand-skin)";
  const s = "url(#hand-outline)";
  const w = "0.8";
  const nailColor = "#D4A574";
  const knuckleColor = "rgba(160,120,80,0.15)";

  switch (shape) {
    case "open":
      return (
        <G opacity={opacity}>
          <Rect x="-10" y="-2" width="20" height="14" rx="4" fill={f} stroke={s} strokeWidth={w} />
          <Line x1="-4" y1="2" x2="6" y2="2" stroke={knuckleColor} strokeWidth="0.5" />
          <Rect x="-8" y="-16" width="3.8" height="16" rx="1.8" fill={f} stroke={s} strokeWidth={w} />
          <Ellipse cx="-6.1" cy="-15.5" rx="1.4" ry="1" fill={nailColor} opacity="0.4" />
          <Rect x="-3.5" y="-18" width="3.8" height="18" rx="1.8" fill={f} stroke={s} strokeWidth={w} />
          <Ellipse cx="-1.6" cy="-17.5" rx="1.4" ry="1" fill={nailColor} opacity="0.4" />
          <Rect x="1" y="-19" width="3.8" height="19" rx="1.8" fill={f} stroke={s} strokeWidth={w} />
          <Ellipse cx="2.9" cy="-18.5" rx="1.4" ry="1" fill={nailColor} opacity="0.4" />
          <Rect x="5.5" y="-17" width="3.5" height="17" rx="1.7" fill={f} stroke={s} strokeWidth={w} />
          <Ellipse cx="7.25" cy="-16.5" rx="1.3" ry="0.9" fill={nailColor} opacity="0.4" />
          <Path d="M -10 3 Q -13 0 -16 -3" stroke={f} strokeWidth="3.8" strokeLinecap="round" fill="none" />
          <Circle cx="-16" cy="-3" r="1.8" fill={f} />
        </G>
      );
    case "fist":
      return (
        <G opacity={opacity}>
          <Rect x="-11" y="-10" width="24" height="20" rx="6" fill={f} stroke={s} strokeWidth={w} />
          <Line x1="-5" y1="-4" x2="8" y2="-4" stroke={knuckleColor} strokeWidth="0.6" strokeLinecap="round" />
          <Line x1="-5" y1="-1" x2="8" y2="-1" stroke={knuckleColor} strokeWidth="0.4" strokeLinecap="round" />
          <Line x1="-5" y1="2" x2="8" y2="2" stroke={knuckleColor} strokeWidth="0.4" strokeLinecap="round" />
          <Path d="M -11 -2 Q -14 -5 -17 -7" stroke={f} strokeWidth="3.8" strokeLinecap="round" fill="none" />
          <Circle cx="-17" cy="-7" r="1.8" fill={f} />
        </G>
      );
    case "point":
      return (
        <G opacity={opacity}>
          <Rect x="-10" y="-5" width="22" height="18" rx="6" fill={f} stroke={s} strokeWidth={w} />
          <Line x1="-4" y1="-1" x2="7" y2="-1" stroke={knuckleColor} strokeWidth="0.5" strokeLinecap="round" />
          <Rect x="1" y="-24" width="4" height="21" rx="2" fill={f} stroke={s} strokeWidth={w} />
          <Ellipse cx="3" cy="-23.5" rx="1.5" ry="1" fill={nailColor} opacity="0.4" />
          <Path d="M -10 2 Q -13 -1 -16 -3" stroke={f} strokeWidth="3.8" strokeLinecap="round" fill="none" />
          <Circle cx="-16" cy="-3" r="1.8" fill={f} />
        </G>
      );
    case "spread":
      return (
        <G opacity={opacity}>
          <Rect x="-10" y="-2" width="20" height="14" rx="4" fill={f} stroke={s} strokeWidth={w} />
          <Line x1="-4" y1="3" x2="6" y2="3" stroke={knuckleColor} strokeWidth="0.5" />
          <Rect x="-10" y="-17" width="3.2" height="17" rx="1.5" fill={f} stroke={s} strokeWidth={w} transform="rotate(18 -8.5 -2)" />
          <Rect x="-5" y="-19" width="3.5" height="19" rx="1.7" fill={f} stroke={s} strokeWidth={w} transform="rotate(6 -3 -2)" />
          <Rect x="0" y="-20" width="3.8" height="20" rx="1.8" fill={f} stroke={s} strokeWidth={w} />
          <Ellipse cx="1.9" cy="-19.5" rx="1.4" ry="1" fill={nailColor} opacity="0.4" />
          <Rect x="5" y="-18" width="3.5" height="18" rx="1.7" fill={f} stroke={s} strokeWidth={w} transform="rotate(-12 6.5 -2)" />
          <Path d="M -10 4 Q -14 0 -18 -4" stroke={f} strokeWidth="4" strokeLinecap="round" fill="none" />
          <Circle cx="-18" cy="-4" r="2" fill={f} />
        </G>
      );
    case "flat":
      return (
        <G opacity={opacity}>
          <Rect x="-5" y="-20" width="10" height="35" rx="4" fill={f} stroke={s} strokeWidth={w} />
          <Line x1="-2" y1="-8" x2="5" y2="-8" stroke={knuckleColor} strokeWidth="0.4" />
          <Ellipse cx="0" cy="-19.5" rx="3" ry="1.2" fill={nailColor} opacity="0.3" />
        </G>
      );
    case "c_shape":
      return (
        <G opacity={opacity}>
          <Path
            d="M 10 -14 Q 14 -20 8 -22 L -4 -22 Q -14 -18 -14 -8 L -14 4 Q -14 12 -4 14 L 8 14 Q 14 12 14 6"
            fill="none" stroke={f} strokeWidth="5.5" strokeLinecap="round"
          />
          <Path
            d="M 10 -14 Q 14 -20 8 -22 L -4 -22 Q -14 -18 -14 -8 L -14 4 Q -14 12 -4 14 L 8 14 Q 14 12 14 6"
            fill="none" stroke={s} strokeWidth="1" strokeLinecap="round" opacity="0.3"
          />
        </G>
      );
    case "pinch":
      return (
        <G opacity={opacity}>
          <Ellipse cx="0" cy="0" rx="9" ry="11" fill={f} stroke={s} strokeWidth={w} />
          <Circle cx="0" cy="-11" r="2.8" fill={s} opacity="0.35" />
          <Line x1="-3" y1="-2" x2="3" y2="-2" stroke={knuckleColor} strokeWidth="0.4" />
        </G>
      );
    case "v_shape":
      return (
        <G opacity={opacity}>
          <Rect x="-10" y="-5" width="22" height="18" rx="6" fill={f} stroke={s} strokeWidth={w} />
          <Rect x="-2" y="-24" width="3.8" height="21" rx="1.8" fill={f} stroke={s} strokeWidth={w} transform="rotate(10 -0.25 -5)" />
          <Ellipse cx="-0.5" cy="-23.5" rx="1.4" ry="1" fill={nailColor} opacity="0.4" transform="rotate(10 -0.25 -5)" />
          <Rect x="5" y="-24" width="3.8" height="21" rx="1.8" fill={f} stroke={s} strokeWidth={w} transform="rotate(-10 6.75 -5)" />
          <Ellipse cx="7.5" cy="-23.5" rx="1.4" ry="1" fill={nailColor} opacity="0.4" transform="rotate(-10 6.75 -5)" />
          <Path d="M -10 2 Q -13 -1 -16 -3" stroke={f} strokeWidth="3.8" strokeLinecap="round" fill="none" />
          <Circle cx="-16" cy="-3" r="1.8" fill={f} />
        </G>
      );
    case "ily":
      return (
        <G opacity={opacity}>
          <Rect x="-8" y="-2" width="18" height="15" rx="4" fill={f} stroke={s} strokeWidth={w} />
          <Line x1="-3" y1="3" x2="5" y2="3" stroke={knuckleColor} strokeWidth="0.4" />
          <Rect x="-8" y="-19" width="3.2" height="19" rx="1.5" fill={f} stroke={s} strokeWidth={w} />
          <Ellipse cx="-6.4" cy="-18.5" rx="1.2" ry="0.8" fill={nailColor} opacity="0.4" />
          <Rect x="5" y="-21" width="3.8" height="21" rx="1.8" fill={f} stroke={s} strokeWidth={w} />
          <Ellipse cx="6.9" cy="-20.5" rx="1.4" ry="1" fill={nailColor} opacity="0.4" />
          <Path d="M -8 4 Q -12 0 -18 -4" stroke={f} strokeWidth="4.2" strokeLinecap="round" fill="none" />
          <Circle cx="-18" cy="-4" r="2" fill={f} />
        </G>
      );
    case "hook":
      return (
        <G opacity={opacity}>
          <Rect x="-10" y="-5" width="22" height="18" rx="6" fill={f} stroke={s} strokeWidth={w} />
          <Line x1="-4" y1="0" x2="7" y2="0" stroke={knuckleColor} strokeWidth="0.4" />
          <Path d="M 2 -5 L 2 -17 Q 2 -21 6 -21 L 8 -19 Q 11 -15 7 -12" fill="none" stroke={f} strokeWidth="4.2" strokeLinecap="round" />
          <Path d="M 2 -5 L 2 -17 Q 2 -21 6 -21 L 8 -19 Q 11 -15 7 -12" fill="none" stroke={s} strokeWidth="0.8" strokeLinecap="round" opacity="0.3" />
        </G>
      );
    default:
      return <Circle cx="0" cy="0" r="10" fill={f} stroke={s} strokeWidth={w} opacity={opacity} />;
  }
}

function HandGradientDefs() {
  return (
    <Defs>
      <RadialGradient id="hand-skin" cx="40%" cy="35%" r="65%">
        <Stop offset="0%" stopColor="#F5DDCC" />
        <Stop offset="60%" stopColor="#EDCFAF" />
        <Stop offset="100%" stopColor="#D9B088" />
      </RadialGradient>
      <LinearGradient id="hand-outline" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#C49A70" />
        <Stop offset="100%" stopColor="#A8845E" />
      </LinearGradient>
    </Defs>
  );
}

interface AnimatedBodyProps {
  sign: ASLWordSign;
  width?: number;
  breathe: SharedValue<number>;
}

function AnimatedBodySignSvg({ sign, width = 170, breathe }: AnimatedBodyProps) {
  const height = (width * 280) / 200;
  const scale = width / 200;
  const handPixelSize = HAND_VIEW_SIZE * scale;
  const colors = useThemeColors();

  const rightX = useSharedValue(sign.rightHand.x);
  const rightY = useSharedValue(sign.rightHand.y);
  const rightRot = useSharedValue(sign.rightHand.rotation || 0);

  const lhInit = sign.leftHand || { x: BODY.restingL.x, y: BODY.restingL.y, rotation: 0 };
  const leftX = useSharedValue(lhInit.x);
  const leftY = useSharedValue(lhInit.y);
  const leftRot = useSharedValue(lhInit.rotation || 0);

  const [rightShape, setRightShape] = useState(sign.rightHand.shape);
  const [leftShape, setLeftShape] = useState(sign.leftHand?.shape ?? "fist");
  const [prevRightShape, setPrevRightShape] = useState<HandShapeType | null>(null);
  const [prevLeftShape, setPrevLeftShape] = useState<HandShapeType | null>(null);
  const shapeFade = useSharedValue(1);

  const [showArrows, setShowArrows] = useState(true);

  useEffect(() => {
    const config = { duration: ANIM_DURATION, easing: EASE_SMOOTH };

    rightX.value = withTiming(sign.rightHand.x, config);
    rightY.value = withTiming(sign.rightHand.y, config);
    rightRot.value = withTiming(sign.rightHand.rotation || 0, config);

    const lh = sign.leftHand || { x: BODY.restingL.x, y: BODY.restingL.y, rotation: 0 };
    leftX.value = withTiming(lh.x, config);
    leftY.value = withTiming(lh.y, config);
    leftRot.value = withTiming(lh.rotation || 0, config);

    const newRS = sign.rightHand.shape;
    const newLS = sign.leftHand?.shape ?? "fist";
    if (newRS !== rightShape || newLS !== leftShape) {
      setPrevRightShape(rightShape);
      setPrevLeftShape(leftShape);
      setRightShape(newRS);
      setLeftShape(newLS);
      shapeFade.value = 0;
      shapeFade.value = withTiming(1, {
        duration: ANIM_DURATION * 0.5,
        easing: EASE_OUT,
      }, (finished) => {
        if (finished) {
          runOnJS(setPrevRightShape)(null);
          runOnJS(setPrevLeftShape)(null);
        }
      });
    }

    setShowArrows(false);
    const arrowTimer = setTimeout(() => setShowArrows(true), ANIM_DURATION * 0.7);
    return () => clearTimeout(arrowTimer);
  }, [sign]);

  const rightArmD = useDerivedValue(() => {
    'worklet';
    const hx = rightX.value;
    const hy = rightY.value + breathe.value;
    const sx = BODY.shoulderR.x;
    const sy = BODY.shoulderR.y + breathe.value * 0.3;
    const midX = (sx + hx) / 2;
    const midY = (sy + hy) / 2;
    const dx = hx - sx;
    const dy = hy - sy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const bend = Math.min(dist * 0.18, 28);
    const ex = midX + bend;
    const ey = Math.max(sy + 5, midY + 12);
    return 'M ' + sx + ' ' + sy + ' Q ' + ex + ' ' + ey + ' ' + hx + ' ' + hy;
  });

  const leftArmD = useDerivedValue(() => {
    'worklet';
    const hx = leftX.value;
    const hy = leftY.value + breathe.value;
    const sx = BODY.shoulderL.x;
    const sy = BODY.shoulderL.y + breathe.value * 0.3;
    const midX = (sx + hx) / 2;
    const midY = (sy + hy) / 2;
    const dx = hx - sx;
    const dy = hy - sy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const bend = Math.min(dist * 0.18, 28);
    const ex = midX - bend;
    const ey = Math.max(sy + 5, midY + 12);
    return 'M ' + sx + ' ' + sy + ' Q ' + ex + ' ' + ey + ' ' + hx + ' ' + hy;
  });

  const rightArmFillProps = useAnimatedProps(() => {
    'worklet';
    return { d: rightArmD.value };
  });
  const rightArmStrokeProps = useAnimatedProps(() => {
    'worklet';
    return { d: rightArmD.value };
  });
  const leftArmFillProps = useAnimatedProps(() => {
    'worklet';
    return { d: leftArmD.value };
  });
  const leftArmStrokeProps = useAnimatedProps(() => {
    'worklet';
    return { d: leftArmD.value };
  });

  const handBaseStyle = {
    position: 'absolute' as const,
    width: handPixelSize,
    height: handPixelSize,
  };

  const rightHandAnimStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      transform: [
        { translateX: (rightX.value - HAND_VIEW_SIZE / 2) * scale },
        { translateY: (rightY.value + breathe.value - HAND_VIEW_SIZE / 2) * scale },
        { rotate: rightRot.value + 'deg' },
      ],
    };
  });

  const leftHandAnimStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      transform: [
        { translateX: (leftX.value - HAND_VIEW_SIZE / 2) * scale },
        { translateY: (leftY.value + breathe.value - HAND_VIEW_SIZE / 2) * scale },
        { rotate: leftRot.value + 'deg' },
      ],
    };
  });

  const newShapeAnimStyle = useAnimatedStyle(() => {
    'worklet';
    return { opacity: shapeFade.value };
  });

  const oldShapeAnimStyle = useAnimatedStyle(() => {
    'worklet';
    return { opacity: 1 - shapeFade.value };
  });

  const bodyBreathStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      transform: [{ translateY: breathe.value * 0.3 }],
    };
  });

  const headY = 38;
  const hairY = 28;

  const vb = '-' + (HAND_VIEW_SIZE / 2) + ' -' + (HAND_VIEW_SIZE / 2) + ' ' + HAND_VIEW_SIZE + ' ' + HAND_VIEW_SIZE;

  return (
    <View style={{ width, height, position: 'relative' }}>
      <Animated.View style={[{ position: 'absolute', width, height }, bodyBreathStyle]}>
        <Svg viewBox="0 0 200 280" width={width} height={height}>
          <Defs>
            <LinearGradient id="body-skin" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#F0D0B0" />
              <Stop offset="100%" stopColor="#D9B088" />
            </LinearGradient>
            <LinearGradient id="body-outline" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#C49A70" />
              <Stop offset="100%" stopColor="#B08860" />
            </LinearGradient>
            <LinearGradient id="shirt-fill" x1="50%" y1="0%" x2="50%" y2="100%">
              <Stop offset="0%" stopColor="#6B9FCC" />
              <Stop offset="40%" stopColor="#5B8FB9" />
              <Stop offset="100%" stopColor="#4A7A9E" />
            </LinearGradient>
            <LinearGradient id="shirt-shadow" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="rgba(0,0,0,0)" />
              <Stop offset="100%" stopColor="rgba(0,0,0,0.08)" />
            </LinearGradient>
            <RadialGradient id="face-skin" cx="50%" cy="45%" r="55%">
              <Stop offset="0%" stopColor="#F5DDCC" />
              <Stop offset="70%" stopColor="#E8C4A0" />
              <Stop offset="100%" stopColor="#D9B088" />
            </RadialGradient>
            <LinearGradient id="hair-grad" x1="50%" y1="0%" x2="50%" y2="100%">
              <Stop offset="0%" stopColor="#5A4030" />
              <Stop offset="100%" stopColor="#3A2818" />
            </LinearGradient>
          </Defs>

          <Rect x="91" y="60" width="18" height="18" rx="5" fill="url(#body-skin)" />

          <Path
            d="M 48 90 Q 55 78 100 75 Q 145 78 152 90 L 148 96 L 140 185 Q 132 202 100 202 Q 68 202 60 185 L 52 96 Z"
            fill="url(#shirt-fill)" stroke="#3D6B8C" strokeWidth="0.5"
          />
          <Path
            d="M 48 90 Q 55 78 100 75 Q 145 78 152 90 L 148 96 L 140 185 Q 132 202 100 202 Q 68 202 60 185 L 52 96 Z"
            fill="url(#shirt-shadow)"
          />
          <Path d="M 85 76 L 100 86 L 115 76" fill="none" stroke="#3D6B8C" strokeWidth="1" />
          <Path d="M 95 76 L 100 80 L 105 76" fill="none" stroke="#4A7A9E" strokeWidth="0.6" opacity="0.5" />

          <Ellipse cx="100" cy={hairY} rx="26" ry="17" fill="url(#hair-grad)" />
          <Path d={`M 74 ${hairY + 5} Q 78 ${hairY - 8} 100 ${hairY - 12} Q 122 ${hairY - 8} 126 ${hairY + 5}`} fill="url(#hair-grad)" />

          <Ellipse cx="100" cy={headY} rx="23" ry="25" fill="url(#face-skin)" stroke="url(#body-outline)" strokeWidth="0.4" />

          <Circle cx="91" cy={headY - 3} r="2.8" fill="#3A3020" />
          <Circle cx="109" cy={headY - 3} r="2.8" fill="#3A3020" />
          <Circle cx="92.2" cy={headY - 4} r="1" fill="white" />
          <Circle cx="110.2" cy={headY - 4} r="1" fill="white" />
          <Circle cx="90.5" cy={headY - 3.5} r="0.4" fill="white" opacity="0.6" />
          <Circle cx="108.5" cy={headY - 3.5} r="0.4" fill="white" opacity="0.6" />

          <Path d={`M 85 ${headY - 8} Q 91 ${headY - 10} 97 ${headY - 8}`} fill="none" stroke="#4A3728" strokeWidth="1.4" strokeLinecap="round" />
          <Path d={`M 103 ${headY - 8} Q 109 ${headY - 10} 115 ${headY - 8}`} fill="none" stroke="#4A3728" strokeWidth="1.4" strokeLinecap="round" />

          <Path d={`M 100 ${headY + 2} L 98.5 ${headY + 7} Q 100 ${headY + 8} 101.5 ${headY + 7}`} fill="none" stroke="url(#body-outline)" strokeWidth="0.8" strokeLinecap="round" />

          <Path d={`M 93 ${headY + 10} Q 100 ${headY + 14} 107 ${headY + 10}`} fill="none" stroke="#C49A70" strokeWidth="1.2" strokeLinecap="round" />
          <Path d={`M 95 ${headY + 10} Q 100 ${headY + 12.5} 105 ${headY + 10}`} fill="none" stroke="#E8B0A0" strokeWidth="0.6" strokeLinecap="round" opacity="0.4" />

          <Ellipse cx="89" cy={headY + 5} rx="4" ry="2.5" fill="#E8B0A0" opacity="0.15" />
          <Ellipse cx="111" cy={headY + 5} rx="4" ry="2.5" fill="#E8B0A0" opacity="0.15" />

          <Rect x="91" y="60" width="18" height="17" rx="5" fill="url(#body-skin)" />

          {showArrows && sign.arrows && (
            <Path
              d={sign.arrows}
              fill="none"
              stroke={colors.primary}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="5,3"
              opacity={0.7}
            />
          )}
        </Svg>
      </Animated.View>

      <Svg
        viewBox="0 0 200 280"
        width={width}
        height={height}
        style={{ position: 'absolute' }}
        pointerEvents="none"
      >
        <Defs>
          <LinearGradient id="arm-skin" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#F0D0B0" />
            <Stop offset="100%" stopColor="#D9B088" />
          </LinearGradient>
          <LinearGradient id="arm-outline" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#C49A70" />
            <Stop offset="100%" stopColor="#B08860" />
          </LinearGradient>
        </Defs>

        <AnimatedPath animatedProps={leftArmFillProps} stroke="url(#arm-skin)" strokeWidth={14} fill="none" strokeLinecap="round" opacity={0.94} />
        <AnimatedPath animatedProps={leftArmStrokeProps} stroke="url(#arm-outline)" strokeWidth={1} fill="none" strokeLinecap="round" opacity={0.15} />

        <AnimatedPath animatedProps={rightArmFillProps} stroke="url(#arm-skin)" strokeWidth={14} fill="none" strokeLinecap="round" opacity={0.94} />
        <AnimatedPath animatedProps={rightArmStrokeProps} stroke="url(#arm-outline)" strokeWidth={1} fill="none" strokeLinecap="round" opacity={0.15} />
      </Svg>

      <Animated.View style={[handBaseStyle, leftHandAnimStyle]}>
        {prevLeftShape !== null && prevLeftShape !== leftShape && (
          <Animated.View style={[StyleSheet.absoluteFill, oldShapeAnimStyle]}>
            <Svg viewBox={vb} width={handPixelSize} height={handPixelSize}>
              <HandGradientDefs />
              <HandShapeSvg shape={prevLeftShape} />
            </Svg>
          </Animated.View>
        )}
        <Animated.View style={prevLeftShape !== null && prevLeftShape !== leftShape ? newShapeAnimStyle : undefined}>
          <Svg viewBox={vb} width={handPixelSize} height={handPixelSize}>
            <HandGradientDefs />
            <HandShapeSvg shape={leftShape} />
          </Svg>
        </Animated.View>
      </Animated.View>

      <Animated.View style={[handBaseStyle, rightHandAnimStyle]}>
        {prevRightShape !== null && prevRightShape !== rightShape && (
          <Animated.View style={[StyleSheet.absoluteFill, oldShapeAnimStyle]}>
            <Svg viewBox={vb} width={handPixelSize} height={handPixelSize}>
              <HandGradientDefs />
              <HandShapeSvg shape={prevRightShape} />
            </Svg>
          </Animated.View>
        )}
        <Animated.View style={prevRightShape !== null && prevRightShape !== rightShape ? newShapeAnimStyle : undefined}>
          <Svg viewBox={vb} width={handPixelSize} height={handPixelSize}>
            <HandGradientDefs />
            <HandShapeSvg shape={rightShape} />
          </Svg>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

function FingerspellWord({ word, speed, isActive }: { word: string; speed: number; isActive: boolean }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const colors = useThemeColors();
  const letters = word.toUpperCase().replace(/[^A-Z]/g, "").split("");
  const fadeVal = useSharedValue(1);

  useEffect(() => { setCurrentIndex(0); }, [word]);

  useEffect(() => {
    if (!isActive || letters.length === 0) return;
    const interval = setInterval(() => {
      fadeVal.value = 0;
      fadeVal.value = withTiming(1, { duration: 200, easing: EASE_OUT });
      setCurrentIndex((prev) => (prev + 1) % letters.length);
    }, speed);
    return () => clearInterval(interval);
  }, [letters.length, speed, isActive]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: fadeVal.value,
    transform: [{ scale: 0.92 + fadeVal.value * 0.08 }],
  }));

  if (letters.length === 0) return null;

  return (
    <View style={{ alignItems: "center", gap: 8 }}>
      <Animated.View style={animStyle}>
        <HandAvatar letter={letters[currentIndex] || "A"} size={120} />
      </Animated.View>
      <View style={[styles.badge, { borderColor: colors.border }]}>
        <Text style={[styles.badgeText, { color: colors.textSecondary }]}>Fingerspelling</Text>
      </View>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 4, justifyContent: "center", maxWidth: 240 }}>
        {letters.map((l, i) => (
          <View
            key={`${i}-${l}`}
            style={[
              styles.letterBox,
              i === currentIndex
                ? { backgroundColor: colors.primary }
                : i < currentIndex
                  ? { backgroundColor: colors.muted }
                  : { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
            ]}
          >
            <Text style={{
              fontSize: 12, fontWeight: "bold", fontFamily: "monospace",
              color: i === currentIndex ? colors.primaryText : colors.text,
            }}>
              {l}
            </Text>
          </View>
        ))}
      </View>
    </View>
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
  const colors = useThemeColors();

  const contentFade = useSharedValue(1);
  const contentSlide = useSharedValue(0);
  const progressWidth = useSharedValue(0);
  const breathe = useSharedValue(0);

  useEffect(() => {
    breathe.value = withRepeat(
      withSequence(
        withTiming(1.5, { duration: 2800, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 2800, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );
  }, []);

  useEffect(() => {
    const parsed = parseTextToSignWords(text);
    setWords(parsed);
    setCurrentWordIndex(0);
    setIsPlaying(autoPlay);
  }, [text, autoPlay]);

  const animateTransition = useCallback((fromIdx: number, toIdx: number) => {
    contentFade.value = 0.3;
    contentSlide.value = toIdx > fromIdx ? 20 : -20;
    contentFade.value = withTiming(1, { duration: 350, easing: EASE_OUT });
    contentSlide.value = withTiming(0, { duration: 400, easing: EASE_SMOOTH });
  }, []);

  const goToNext = useCallback(() => {
    setCurrentWordIndex((prev) => {
      if (prev >= words.length - 1) { setIsPlaying(false); return prev; }
      const next = prev + 1;
      animateTransition(prev, next);
      return next;
    });
  }, [words.length, animateTransition]);

  const goToPrev = useCallback(() => {
    setCurrentWordIndex((prev) => {
      const next = Math.max(0, prev - 1);
      if (next !== prev) animateTransition(prev, next);
      return next;
    });
  }, [animateTransition]);

  useEffect(() => {
    if (!isPlaying || words.length === 0) return;
    const currentWord = words[currentWordIndex];
    const delay = currentWord?.sign ? speed : speed + 500;

    progressWidth.value = 0;
    progressWidth.value = withTiming(100, {
      duration: delay,
      easing: Easing.linear,
    });

    const timer = setTimeout(() => {
      if (currentWordIndex < words.length - 1) goToNext();
      else setIsPlaying(false);
    }, delay);
    return () => clearTimeout(timer);
  }, [isPlaying, currentWordIndex, words, speed, goToNext]);

  const contentAnimStyle = useAnimatedStyle(() => ({
    opacity: contentFade.value,
    transform: [{ translateY: contentSlide.value }],
  }));

  const progressAnimStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%` as any,
  }));

  if (words.length === 0) return null;
  const currentWord = words[currentWordIndex];

  return (
    <View style={{ alignItems: "center", gap: 12 }}>
      <Text style={[styles.currentWord, { color: colors.text }]} data-testid="text-current-word">
        {currentWord.word.toUpperCase()}
      </Text>

      {isPlaying && (
        <View style={[styles.progressTrack, { backgroundColor: colors.muted }]}>
          <Animated.View style={[styles.progressBar, { backgroundColor: colors.primary }, progressAnimStyle]} />
        </View>
      )}

      <Animated.View style={contentAnimStyle}>
        {currentWord.sign ? (
          <View style={{ alignItems: "center", gap: 8 }}>
            <AnimatedBodySignSvg
              sign={currentWord.sign}
              width={170}
              breathe={breathe}
            />
            <View style={{ alignItems: "center", gap: 4, maxWidth: 260, paddingHorizontal: 8 }}>
              <View style={{ flexDirection: "row", gap: 4, flexWrap: "wrap", justifyContent: "center" }}>
                <View style={[styles.badge, { borderColor: colors.border }]}>
                  <Text style={[styles.badgeText, { color: colors.textSecondary }]}>{currentWord.sign.startPosition}</Text>
                </View>
                {currentWord.sign.twoHanded && (
                  <View style={[styles.badge, { backgroundColor: colors.muted }]}>
                    <Text style={[styles.badgeText, { color: colors.textSecondary }]}>Two-Handed</Text>
                  </View>
                )}
              </View>
              <Text style={{ fontSize: 11, color: colors.textSecondary, textAlign: "center", lineHeight: 16 }}>
                {currentWord.sign.description}
              </Text>
            </View>
          </View>
        ) : (
          <FingerspellWord word={currentWord.word} speed={600} isActive={true} />
        )}
      </Animated.View>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, justifyContent: "center", maxWidth: 300, paddingHorizontal: 8 }}>
        {words.map((w, i) => (
          <TouchableOpacity
            key={`${i}-${w.word}`}
            onPress={() => {
              animateTransition(currentWordIndex, i);
              setCurrentWordIndex(i);
            }}
            style={[
              styles.wordChip,
              i === currentWordIndex
                ? { backgroundColor: colors.primary }
                : i < currentWordIndex
                  ? { backgroundColor: colors.muted }
                  : { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
            ]}
          >
            <Text style={{
              fontSize: 11, fontWeight: "500",
              color: i === currentWordIndex ? colors.primaryText : colors.text,
              fontStyle: !w.sign ? "italic" : "normal",
            }}>
              {w.word}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <TouchableOpacity
          onPress={goToPrev}
          disabled={currentWordIndex === 0}
          style={[styles.navButton, { borderColor: colors.border, opacity: currentWordIndex === 0 ? 0.4 : 1 }]}
          data-testid="button-prev-sign"
        >
          <Ionicons name="chevron-back" size={18} color={colors.text} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            if (currentWordIndex >= words.length - 1 && !isPlaying) {
              setCurrentWordIndex(0);
              setIsPlaying(true);
            } else {
              setIsPlaying(!isPlaying);
            }
          }}
          style={[styles.navButton, isPlaying ? { backgroundColor: colors.primary } : { borderColor: colors.border }]}
          data-testid="button-play-pause"
        >
          <Ionicons name={isPlaying ? "pause" : "play"} size={18} color={isPlaying ? colors.primaryText : colors.text} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={goToNext}
          disabled={currentWordIndex >= words.length - 1}
          style={[styles.navButton, { borderColor: colors.border, opacity: currentWordIndex >= words.length - 1 ? 0.4 : 1 }]}
          data-testid="button-next-sign"
        >
          <Ionicons name="chevron-forward" size={18} color={colors.text} />
        </TouchableOpacity>

        <Text style={{ fontSize: 12, color: colors.textSecondary, marginLeft: 4 }}>
          {currentWordIndex + 1} / {words.length}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  currentWord: { fontSize: 22, fontWeight: "bold", letterSpacing: 1.5 },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, borderWidth: 1 },
  badgeText: { fontSize: 10 },
  letterBox: { width: 26, height: 26, borderRadius: 6, alignItems: "center", justifyContent: "center" },
  wordChip: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  navButton: { width: 40, height: 40, borderRadius: 10, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  progressTrack: { width: "80%", height: 3, borderRadius: 2, overflow: "hidden" },
  progressBar: { height: "100%", borderRadius: 2 },
});
