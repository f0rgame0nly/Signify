import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAudioRecorder, RecordingPresets, requestRecordingPermissionsAsync } from "expo-audio";
import { useThemeColors } from "../lib/theme";
import { WordSignDisplay } from "../components/FullBodySign";
import { api } from "../lib/api";

async function fileToBase64(uri: string): Promise<string> {
  const response = await fetch(uri);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      const base64 = dataUrl.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export default function VoiceToSignScreen() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcribedText, setTranscribedText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const colors = useThemeColors();

  const startRecording = async () => {
    try {
      const permission = await requestRecordingPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Permission Required", "Microphone access is needed for voice recording.");
        return;
      }
      await recorder.prepareToRecordAsync();
      recorder.record();
      setIsRecording(true);
    } catch (err) {
      Alert.alert("Error", "Failed to start recording");
    }
  };

  const stopRecording = async () => {
    setIsRecording(false);
    setIsProcessing(true);
    try {
      await recorder.stop();
      await new Promise((r) => setTimeout(r, 100));
      const uri = recorder.uri;

      if (!uri) {
        Alert.alert("Error", "No recording file found");
        setIsProcessing(false);
        return;
      }

      const base64 = await fileToBase64(uri);
      const result = await api.transcribe(base64);
      setTranscribedText(result.text || "");
    } catch (e: any) {
      Alert.alert("Error", e.message || "Failed to process recording");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      <View style={[styles.recordCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.label, { color: colors.text }]}>
          {isRecording ? "Recording... Tap to stop" : isProcessing ? "Processing audio..." : "Tap to start recording"}
        </Text>

        <TouchableOpacity
          onPress={isRecording ? stopRecording : startRecording}
          disabled={isProcessing}
          style={[
            styles.recordButton,
            isRecording
              ? { backgroundColor: colors.danger }
              : isProcessing
                ? { backgroundColor: colors.muted }
                : { backgroundColor: colors.primary },
          ]}
          data-testid="button-record"
        >
          <Ionicons
            name={isRecording ? "stop" : isProcessing ? "hourglass" : "mic"}
            size={36}
            color={isProcessing ? colors.textSecondary : colors.primaryText}
          />
        </TouchableOpacity>

        {isRecording && (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <View style={[styles.recordingDot, { backgroundColor: colors.danger }]} />
            <Text style={{ color: colors.danger, fontSize: 13, fontWeight: "500" }}>Recording</Text>
          </View>
        )}
      </View>

      {transcribedText ? (
        <View style={{ gap: 16 }}>
          <View style={[styles.textCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Ionicons name="document-text" size={16} color={colors.primary} />
              <Text style={{ fontSize: 14, fontWeight: "600", color: colors.text }}>Transcribed Text</Text>
            </View>
            <Text style={{ fontSize: 16, color: colors.text, lineHeight: 22 }}>{transcribedText}</Text>
          </View>

          <View style={[styles.textCard, { backgroundColor: colors.card, borderColor: colors.border, alignItems: "center" }]}>
            <Text style={{ fontSize: 14, fontWeight: "600", color: colors.text, marginBottom: 8 }}>Sign Language Translation</Text>
            <WordSignDisplay text={transcribedText} speed={2500} autoPlay />
          </View>
        </View>
      ) : (
        <View style={{ alignItems: "center", paddingVertical: 40 }}>
          <View style={[styles.emptyIcon, { backgroundColor: colors.muted }]}>
            <Ionicons name="mic-outline" size={32} color={colors.textTertiary} />
          </View>
          <Text style={{ color: colors.textSecondary, fontSize: 14, marginTop: 12, textAlign: "center" }}>
            Record your voice and see it translated into sign language
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  recordCard: { padding: 20, borderRadius: 12, borderWidth: 1, alignItems: "center", gap: 12, marginBottom: 16 },
  label: { fontSize: 14, fontWeight: "500" },
  recordButton: { width: 80, height: 80, borderRadius: 40, alignItems: "center", justifyContent: "center" },
  recordingDot: { width: 8, height: 8, borderRadius: 4 },
  textCard: { padding: 16, borderRadius: 12, borderWidth: 1, gap: 8 },
  emptyIcon: { width: 64, height: 64, borderRadius: 32, alignItems: "center", justifyContent: "center" },
});
