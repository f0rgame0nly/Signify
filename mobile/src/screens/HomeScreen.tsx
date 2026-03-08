import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "../lib/theme";

const features = [
  { icon: "camera-outline" as const, title: "Sign to Text", desc: "Camera detects sign language and converts to text", screen: "Sign to Text" },
  { icon: "text-outline" as const, title: "Text to Sign", desc: "Type text and see animated ASL signs", screen: "Text to Sign" },
  { icon: "mic-outline" as const, title: "Voice to Sign", desc: "Speak and see your words in sign language", screen: "Voice to Sign" },
  { icon: "bookmarks-outline" as const, title: "Phrase Library", desc: "Quick access to common phrases in sign language", screen: "Phrases" },
  { icon: "chatbubbles-outline" as const, title: "Conversation", desc: "Two-way communication between sign and speech", screen: "Conversation" },
];

export default function HomeScreen({ navigation }: any) {
  const colors = useThemeColors();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
      <View style={{ alignItems: "center", marginBottom: 24 }}>
        <View style={[styles.iconCircle, { backgroundColor: colors.primary + "20" }]}>
          <Ionicons name="hand-left" size={40} color={colors.primary} />
        </View>
        <Text style={[styles.title, { color: colors.text }]}>SignBridge</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Breaking communication barriers with AI-powered sign language translation
        </Text>
      </View>

      <View style={{ gap: 12 }}>
        {features.map((f) => (
          <TouchableOpacity
            key={f.screen}
            onPress={() => navigation.navigate(f.screen)}
            style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
            activeOpacity={0.7}
            data-testid={`button-feature-${f.screen.toLowerCase().replace(/\s/g, "-")}`}
          >
            <View style={[styles.featureIcon, { backgroundColor: colors.primary + "15" }]}>
              <Ionicons name={f.icon} size={26} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.featureTitle, { color: colors.text }]}>{f.title}</Text>
              <Text style={[styles.featureDesc, { color: colors.textSecondary }]}>{f.desc}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
          </TouchableOpacity>
        ))}
      </View>

      <View style={[styles.infoBox, { backgroundColor: colors.muted, borderColor: colors.border }]}>
        <Text style={[styles.infoTitle, { color: colors.text }]}>Getting Started</Text>
        <Text style={[styles.infoText, { color: colors.textSecondary }]}>
          Choose a feature above to begin translating between sign language, text, and voice. The app supports 54 ASL word signs plus full alphabet fingerspelling.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  iconCircle: { width: 80, height: 80, borderRadius: 40, alignItems: "center", justifyContent: "center", marginBottom: 12 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 6 },
  subtitle: { fontSize: 14, textAlign: "center", lineHeight: 20, paddingHorizontal: 20 },
  card: { flexDirection: "row", alignItems: "center", padding: 14, borderRadius: 12, borderWidth: 1, gap: 12 },
  featureIcon: { width: 48, height: 48, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  featureTitle: { fontSize: 16, fontWeight: "600", marginBottom: 2 },
  featureDesc: { fontSize: 12, lineHeight: 16 },
  infoBox: { marginTop: 20, padding: 16, borderRadius: 12, borderWidth: 1 },
  infoTitle: { fontSize: 14, fontWeight: "600", marginBottom: 6 },
  infoText: { fontSize: 12, lineHeight: 18 },
});
