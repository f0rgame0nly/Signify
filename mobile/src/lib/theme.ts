import { useColorScheme } from "react-native";

export const Colors = {
  light: {
    background: "#F8F9FA",
    card: "#FFFFFF",
    text: "#1A1A2E",
    textSecondary: "#6B7280",
    textTertiary: "#9CA3AF",
    primary: "#5B8FB9",
    primaryText: "#FFFFFF",
    border: "#E5E7EB",
    accent: "#4A7A9E",
    danger: "#EF4444",
    success: "#22C55E",
    warning: "#F59E0B",
    muted: "#F3F4F6",
    input: "#FFFFFF",
  },
  dark: {
    background: "#1A1A2E",
    card: "#16213E",
    text: "#F8F9FA",
    textSecondary: "#9CA3AF",
    textTertiary: "#6B7280",
    primary: "#7CB4D4",
    primaryText: "#FFFFFF",
    border: "#374151",
    accent: "#5B8FB9",
    danger: "#EF4444",
    success: "#22C55E",
    warning: "#F59E0B",
    muted: "#1F2937",
    input: "#1F2937",
  },
};

export type ThemeColors = typeof Colors.light;

export function useThemeColors(): ThemeColors {
  const scheme = useColorScheme();
  return scheme === "dark" ? Colors.dark : Colors.light;
}
