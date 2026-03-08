import { View, Text } from "react-native";
import Svg, { Path, Defs, LinearGradient, RadialGradient, Stop, Circle, Ellipse } from "react-native-svg";
import { useThemeColors } from "../lib/theme";

interface HandAvatarProps {
  letter: string;
  size?: number;
}

const HAND_SVG_PATHS: Record<string, { fingers: string; palm: string; label: string; details?: string }> = {
  A: { palm: "M 50 85 Q 30 80 25 55 Q 22 35 30 25 Q 38 15 50 15 Q 62 15 70 25 Q 78 35 75 55 Q 70 80 50 85 Z", fingers: "M 25 55 Q 23 45 28 35 Q 30 30 32 28 M 32 28 Q 35 20 38 18 M 38 18 Q 42 15 45 16 M 45 16 Q 50 15 52 18 M 52 18 Q 56 15 60 18 M 60 18 Q 65 20 68 28 M 68 28 Q 72 35 75 55 M 22 45 Q 18 40 15 42 Q 12 44 14 50 Q 16 55 22 55", details: "M 35 30 L 62 30 M 35 38 L 62 38 M 35 46 L 62 46", label: "Fist, thumb alongside" },
  B: { palm: "M 50 90 Q 30 85 25 65 Q 22 50 28 40 L 30 10 L 40 8 L 40 38 L 45 8 L 55 8 L 55 38 L 60 8 L 70 10 L 65 40 Q 72 50 75 65 Q 70 85 50 90 Z", fingers: "M 30 10 L 30 38 M 40 8 L 40 38 M 50 6 L 50 38 M 60 8 L 60 38 M 70 10 L 65 40", details: "M 30 8 Q 32 6 34 8 M 40 6 Q 42 4 44 6 M 50 4 Q 52 3 54 5 M 60 6 Q 62 5 64 7", label: "Flat hand, fingers up" },
  C: { palm: "M 50 85 Q 25 80 20 55 Q 18 40 25 30 Q 32 22 40 18 Q 48 15 58 18 Q 68 22 75 30 Q 82 40 80 55 Q 75 80 50 85 Z", fingers: "M 25 30 Q 28 22 35 18 Q 42 15 50 14 Q 58 15 65 18 Q 72 22 75 30", label: "Curved C shape" },
  D: { palm: "M 50 85 Q 30 80 25 60 Q 22 45 28 35 L 45 5 L 55 5 L 55 35 Q 60 30 65 35 Q 72 45 75 60 Q 70 80 50 85 Z", fingers: "M 45 5 L 50 5 L 50 35 M 28 35 Q 30 30 35 28 Q 42 25 48 30 M 55 35 Q 60 30 65 35", details: "M 47 4 Q 50 2 53 4", label: "Index up, others closed" },
  E: { palm: "M 50 85 Q 30 80 25 60 Q 22 45 28 35 Q 30 28 35 25 Q 45 20 55 22 Q 65 25 68 30 Q 72 35 75 55 Q 70 80 50 85 Z", fingers: "M 28 35 Q 30 28 38 24 Q 45 22 52 23 Q 60 24 65 28 Q 70 32 72 38 M 22 48 Q 18 44 16 48 Q 14 52 18 56 Q 22 58 25 55", details: "M 34 26 Q 38 24 42 25 M 48 24 Q 52 23 56 25 M 60 26 Q 64 28 66 32", label: "Fingers curled down" },
  F: { palm: "M 50 85 Q 30 80 25 60 Q 22 45 28 35 L 30 30 Q 28 25 32 22 L 45 10 L 55 10 L 60 10 L 70 12 L 65 35 Q 72 45 75 60 Q 70 80 50 85 Z", fingers: "M 45 10 L 45 35 M 55 10 L 55 35 M 65 12 L 62 35 M 30 30 Q 28 24 32 22 Q 36 20 38 24 Q 40 28 38 32", details: "M 45 8 Q 47 6 49 8 M 55 8 Q 57 6 59 8 M 65 10 Q 67 8 69 10", label: "OK sign, three fingers up" },
  G: { palm: "M 30 50 Q 28 40 32 35 L 80 30 L 82 40 L 40 42 Q 38 50 40 55 Q 42 65 38 72 Q 34 78 30 75 Q 26 70 28 60 Q 28 55 30 50 Z", fingers: "M 32 35 L 80 30 L 82 40 L 40 42 M 28 55 Q 22 52 18 55 Q 15 58 18 62 Q 22 65 28 62", label: "Index & thumb pointing" },
  H: { palm: "M 30 50 Q 28 40 32 35 L 80 28 L 82 38 L 82 45 L 80 48 L 38 50 Q 36 55 38 62 Q 34 70 30 68 Q 26 65 28 58 Q 28 54 30 50 Z", fingers: "M 32 35 L 80 28 L 82 38 M 32 40 L 80 38 L 82 48 L 38 50", label: "Index & middle sideways" },
  I: { palm: "M 50 85 Q 30 80 25 60 Q 22 45 28 35 Q 32 28 38 28 Q 45 28 52 30 Q 58 32 62 35 Q 65 38 66 42 L 68 10 L 76 12 L 72 45 Q 75 60 70 80 Q 60 85 50 85 Z", fingers: "M 68 10 L 72 10 L 72 42 M 28 35 Q 32 28 40 28 Q 48 28 55 32 Q 62 36 65 42", details: "M 70 8 Q 72 6 74 8", label: "Pinky up, others closed" },
  J: { palm: "M 50 85 Q 30 80 25 60 Q 22 45 28 35 Q 32 28 38 28 Q 45 28 52 30 Q 58 32 62 35 Q 65 38 66 42 L 68 10 L 76 12 L 72 45 Q 75 60 70 80 Q 60 85 50 85 Z", fingers: "M 68 10 Q 72 8 74 12 Q 78 20 76 30 Q 74 38 72 42", label: "Pinky traces J shape" },
  K: { palm: "M 50 85 Q 30 80 25 60 Q 22 45 28 35 L 35 8 L 45 6 L 50 30 L 55 8 L 65 10 L 60 35 Q 68 40 72 55 Q 70 80 50 85 Z", fingers: "M 35 8 L 40 8 L 45 32 M 55 8 L 60 10 L 58 35 M 22 42 Q 18 38 15 42 Q 14 48 18 55 Q 42 30 48 32", label: "V shape, thumb between" },
  L: { palm: "M 50 85 Q 30 80 25 60 Q 22 45 28 35 L 32 8 L 42 6 L 42 35 Q 48 32 55 35 Q 62 38 65 45 Q 68 55 70 65 Q 68 80 50 85 Z", fingers: "M 32 8 L 38 6 L 38 35 M 22 38 L 5 35 L 4 45 L 22 46", details: "M 34 6 Q 37 4 40 6", label: "L shape with thumb & index" },
  M: { palm: "M 50 85 Q 30 80 25 55 Q 22 40 28 32 Q 30 28 34 26 Q 40 22 48 24 Q 54 22 60 26 Q 66 28 68 32 Q 74 40 75 55 Q 70 80 50 85 Z", fingers: "M 28 32 Q 30 26 36 24 Q 42 22 48 24 Q 54 22 60 26 Q 66 28 70 34 M 22 42 Q 18 38 15 42 Q 14 48 18 52 Q 22 54 25 50", details: "M 36 28 L 36 34 M 48 26 L 48 34 M 60 28 L 60 34", label: "Three fingers over thumb" },
  N: { palm: "M 50 85 Q 30 80 25 55 Q 22 40 28 32 Q 30 28 36 26 Q 44 22 52 26 Q 58 28 62 32 Q 68 40 72 55 Q 68 80 50 85 Z", fingers: "M 28 32 Q 30 26 38 24 Q 46 22 54 26 Q 60 28 64 34 M 22 42 Q 18 38 15 42 Q 14 48 18 52 Q 22 54 25 50", details: "M 40 28 L 40 34 M 54 28 L 54 34", label: "Two fingers over thumb" },
  O: { palm: "M 50 85 Q 30 80 25 55 Q 22 40 28 30 Q 34 22 42 18 Q 50 16 58 18 Q 66 22 72 30 Q 78 40 75 55 Q 70 80 50 85 Z", fingers: "M 28 30 Q 34 22 42 18 Q 50 16 58 18 Q 66 22 72 30 Q 74 36 72 42 Q 68 48 58 50 Q 50 52 42 50 Q 32 48 28 42 Q 26 36 28 30 Z", label: "O shape, tips touch" },
  P: { palm: "M 30 40 Q 28 35 32 30 L 50 65 L 55 58 L 35 28 L 55 55 L 62 50 L 42 25 Q 48 22 52 28 Q 55 35 52 42 Q 50 48 48 52 L 42 58 Q 38 65 34 62 Q 30 58 30 50 Q 30 45 30 40 Z", fingers: "M 35 28 L 50 65 M 42 25 L 55 58 M 28 38 Q 22 35 18 38 Q 16 42 20 46", label: "K pointing down" },
  Q: { palm: "M 40 30 Q 38 28 42 25 L 48 70 L 56 68 L 50 28 Q 54 25 58 30 Q 62 38 58 48 Q 55 55 52 60 Q 48 68 44 65 Q 38 60 38 50 Q 38 40 40 30 Z", fingers: "M 42 25 L 48 70 M 50 28 L 56 68 M 36 35 Q 30 32 26 36 Q 24 40 28 44", label: "G pointing down" },
  R: { palm: "M 50 85 Q 30 80 25 60 Q 22 45 28 35 L 38 8 L 48 6 L 50 30 L 52 6 L 62 8 L 58 35 Q 65 40 70 55 Q 68 80 50 85 Z", fingers: "M 38 8 L 44 6 L 48 30 M 52 6 L 58 8 L 54 30 M 44 15 Q 48 12 52 15", label: "Index & middle crossed" },
  S: { palm: "M 50 85 Q 30 80 25 55 Q 22 38 28 28 Q 34 20 42 18 Q 50 16 58 18 Q 66 20 72 28 Q 78 38 75 55 Q 70 80 50 85 Z", fingers: "M 28 28 Q 34 20 42 18 Q 50 16 58 18 Q 66 20 72 28 M 40 22 Q 42 18 46 20 Q 50 18 54 20 Q 58 18 60 22 M 22 42 Q 18 38 15 40 Q 14 44 18 48 Q 22 50 26 46", details: "M 36 24 L 64 24 M 36 30 L 64 30", label: "Fist, thumb over fingers" },
  T: { palm: "M 50 85 Q 30 80 25 55 Q 22 38 28 28 Q 34 20 42 18 Q 50 16 58 18 Q 66 20 72 28 Q 78 38 75 55 Q 70 80 50 85 Z", fingers: "M 28 28 Q 34 20 42 18 Q 50 16 58 18 Q 66 20 72 28 M 22 36 Q 18 32 16 36 Q 15 42 32 38 Q 36 28 38 32", label: "Thumb between fingers" },
  U: { palm: "M 50 85 Q 30 80 25 60 Q 22 45 28 35 L 38 8 L 48 6 L 48 35 L 52 6 L 62 8 L 58 35 Q 65 40 70 55 Q 68 80 50 85 Z", fingers: "M 38 8 L 44 6 L 44 35 M 52 6 L 58 8 L 56 35", details: "M 40 6 Q 42 4 46 6 M 54 6 Q 56 4 60 6", label: "Index & middle together" },
  V: { palm: "M 50 85 Q 30 80 25 60 Q 22 45 28 35 L 32 8 L 42 5 L 48 32 L 58 5 L 68 8 L 60 35 Q 65 42 70 55 Q 68 80 50 85 Z", fingers: "M 32 8 L 38 5 L 46 32 M 58 5 L 64 8 L 56 35", details: "M 34 5 Q 37 3 40 5 M 60 5 Q 63 3 66 5", label: "Peace sign / V shape" },
  W: { palm: "M 50 85 Q 30 80 25 60 Q 22 45 28 35 L 28 8 L 36 5 L 40 32 L 45 5 L 55 5 L 55 32 L 60 5 L 68 8 L 65 35 Q 72 45 75 60 Q 70 80 50 85 Z", fingers: "M 28 8 L 34 5 L 38 32 M 45 5 L 50 5 L 50 32 M 60 5 L 66 8 L 62 35", label: "Three fingers spread" },
  X: { palm: "M 50 85 Q 30 80 25 60 Q 22 45 28 35 L 38 15 Q 42 8 46 12 Q 48 18 44 25 L 40 35 Q 48 32 55 35 Q 62 40 68 55 Q 66 80 50 85 Z", fingers: "M 38 15 Q 42 8 46 12 Q 48 18 44 25 L 40 35", label: "Index finger hooked" },
  Y: { palm: "M 50 85 Q 30 80 25 60 Q 22 45 28 35 Q 32 28 38 28 Q 45 28 52 30 Q 58 32 62 35 L 68 10 L 76 12 L 72 45 Q 75 60 70 80 Q 60 85 50 85 Z", fingers: "M 22 38 L 5 28 L 3 38 L 22 44 M 68 10 L 74 10 L 72 42", details: "M 70 8 Q 72 6 74 8", label: "Thumb & pinky out" },
  Z: { palm: "M 50 85 Q 30 80 25 60 Q 22 45 28 35 L 45 8 L 55 6 L 55 35 Q 62 38 68 50 Q 70 65 68 80 Q 60 85 50 85 Z", fingers: "M 45 8 L 52 6 L 52 35", details: "M 47 6 Q 50 4 53 6", label: "Index traces Z in air" },
};

export function HandAvatar({ letter, size = 120 }: HandAvatarProps) {
  const upperLetter = letter.toUpperCase();
  const handData = HAND_SVG_PATHS[upperLetter];
  const colors = useThemeColors();

  if (!handData) {
    return (
      <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center", backgroundColor: colors.muted, borderRadius: 8 }}>
        <Text style={{ color: colors.textSecondary, fontSize: 14 }}>{upperLetter}</Text>
      </View>
    );
  }

  return (
    <View style={{ alignItems: "center", gap: 4 }}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Defs>
          <RadialGradient id={`skin-r-${upperLetter}`} cx="45%" cy="40%" r="60%">
            <Stop offset="0%" stopColor="#F5DDCC" />
            <Stop offset="50%" stopColor="#E8C4A0" />
            <Stop offset="100%" stopColor="#D4A574" />
          </RadialGradient>
          <LinearGradient id={`outline-${upperLetter}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#C49A70" />
            <Stop offset="100%" stopColor="#A8845E" />
          </LinearGradient>
          <RadialGradient id={`shadow-${upperLetter}`} cx="50%" cy="60%" r="50%">
            <Stop offset="0%" stopColor="rgba(0,0,0,0)" />
            <Stop offset="100%" stopColor="rgba(0,0,0,0.06)" />
          </RadialGradient>
        </Defs>
        <Path d={handData.palm} fill={`url(#skin-r-${upperLetter})`} stroke={`url(#outline-${upperLetter})`} strokeWidth="1.2" strokeLinejoin="round" />
        <Path d={handData.palm} fill={`url(#shadow-${upperLetter})`} />
        <Path d={handData.fingers} fill="none" stroke={`url(#outline-${upperLetter})`} strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
        {handData.details && (
          <Path d={handData.details} fill="none" stroke={`url(#outline-${upperLetter})`} strokeWidth="0.5" strokeLinecap="round" opacity="0.2" />
        )}
      </Svg>
      <Text style={{ fontSize: 13, fontWeight: "600", color: colors.text }}>{upperLetter}</Text>
    </View>
  );
}
