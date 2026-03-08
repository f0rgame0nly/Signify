import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "../lib/theme";
import { WordSignDisplay } from "../components/FullBodySign";

const quickPhrases = ["Hello", "Thank you", "Please", "Sorry", "Help", "Yes", "No", "I love you"];

export default function TextToSignScreen() {
  const [text, setText] = useState("");
  const [displayText, setDisplayText] = useState("");
  const colors = useThemeColors();

  const handleTranslate = () => {
    const trimmed = text.trim();
    if (trimmed) {
      setDisplayText(trimmed);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView
        style={{ flex: 1, backgroundColor: colors.background }}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.inputCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.text }]}>Enter text to translate</Text>
          <TextInput
            style={[styles.input, { color: colors.text, backgroundColor: colors.input, borderColor: colors.border }]}
            value={text}
            onChangeText={setText}
            placeholder="Type a word or phrase..."
            placeholderTextColor={colors.textTertiary}
            multiline
            data-testid="input-text-to-sign"
          />
          <TouchableOpacity
            onPress={handleTranslate}
            style={[styles.button, { backgroundColor: colors.primary, opacity: text.trim() ? 1 : 0.5 }]}
            disabled={!text.trim()}
            data-testid="button-translate"
          >
            <Ionicons name="hand-left" size={18} color={colors.primaryText} />
            <Text style={[styles.buttonText, { color: colors.primaryText }]}>Translate to Sign</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Phrases</Text>
        <View style={styles.chipRow}>
          {quickPhrases.map((phrase) => (
            <TouchableOpacity
              key={phrase}
              onPress={() => { setText(phrase); setDisplayText(phrase); }}
              style={[styles.chip, { backgroundColor: colors.muted, borderColor: colors.border }]}
              data-testid={`button-quick-${phrase.toLowerCase()}`}
            >
              <Text style={{ fontSize: 13, color: colors.text }}>{phrase}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {displayText ? (
          <View style={[styles.resultCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.resultTitle, { color: colors.text }]}>Sign Language Translation</Text>
            <WordSignDisplay text={displayText} speed={2500} autoPlay />
          </View>
        ) : (
          <View style={{ alignItems: "center", paddingVertical: 40 }}>
            <View style={[styles.emptyIcon, { backgroundColor: colors.muted }]}>
              <Ionicons name="hand-left-outline" size={32} color={colors.textTertiary} />
            </View>
            <Text style={{ color: colors.textSecondary, fontSize: 14, marginTop: 12, textAlign: "center" }}>
              Type text above or tap a quick phrase to see the ASL translation
            </Text>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  inputCard: { padding: 16, borderRadius: 12, borderWidth: 1, gap: 10, marginBottom: 16 },
  label: { fontSize: 14, fontWeight: "600" },
  input: { borderWidth: 1, borderRadius: 8, padding: 12, fontSize: 15, minHeight: 48, textAlignVertical: "top" },
  button: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 12, borderRadius: 8 },
  buttonText: { fontSize: 15, fontWeight: "600" },
  sectionTitle: { fontSize: 16, fontWeight: "600", marginBottom: 8 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1 },
  resultCard: { padding: 16, borderRadius: 12, borderWidth: 1, alignItems: "center", gap: 12 },
  resultTitle: { fontSize: 16, fontWeight: "600" },
  emptyIcon: { width: 64, height: 64, borderRadius: 32, alignItems: "center", justifyContent: "center" },
});
