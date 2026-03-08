import { useState, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAudioRecorder, RecordingPresets, requestRecordingPermissionsAsync, createAudioPlayer } from "expo-audio";
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

interface Message {
  id: number;
  text: string;
  from: "hearing" | "deaf";
  timestamp: Date;
}

export default function ConversationScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [activeMode, setActiveMode] = useState<"hearing" | "deaf">("hearing");
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const scrollRef = useRef<ScrollView>(null);
  const colors = useThemeColors();
  const nextId = useRef(1);

  const addMessage = (text: string, from: "hearing" | "deaf") => {
    const msg: Message = { id: nextId.current++, text, from, timestamp: new Date() };
    setMessages((prev) => [...prev, msg]);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const sendText = () => {
    const text = inputText.trim();
    if (!text) return;
    addMessage(text, activeMode);
    setInputText("");
  };

  const startRecording = async () => {
    try {
      const permission = await requestRecordingPermissionsAsync();
      if (!permission.granted) { Alert.alert("Permission Required", "Microphone access is needed."); return; }
      await recorder.prepareToRecordAsync();
      recorder.record();
      setIsRecording(true);
    } catch { Alert.alert("Error", "Failed to start recording"); }
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
        return;
      }
      const base64 = await fileToBase64(uri);
      const result = await api.transcribe(base64);
      if (result.text) addMessage(result.text, "hearing");
    } catch (e: any) {
      Alert.alert("Error", e.message || "Transcription failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const speakMessage = async (text: string) => {
    try {
      const result = await api.textToSpeech(text);
      if (result.audio) {
        const player = createAudioPlayer(`data:audio/wav;base64,${result.audio}`);
        player.play();
      }
    } catch { Alert.alert("Error", "Text-to-speech failed"); }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.background }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <View style={[styles.modeRow, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity
          onPress={() => setActiveMode("hearing")}
          style={[styles.modeBtn, activeMode === "hearing" ? { backgroundColor: colors.primary } : { backgroundColor: colors.muted }]}
          data-testid="button-mode-hearing"
        >
          <Ionicons name="volume-high" size={16} color={activeMode === "hearing" ? colors.primaryText : colors.text} />
          <Text style={{ fontSize: 12, fontWeight: "600", color: activeMode === "hearing" ? colors.primaryText : colors.text }}>Hearing</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveMode("deaf")}
          style={[styles.modeBtn, activeMode === "deaf" ? { backgroundColor: colors.primary } : { backgroundColor: colors.muted }]}
          data-testid="button-mode-deaf"
        >
          <Ionicons name="hand-left" size={16} color={activeMode === "deaf" ? colors.primaryText : colors.text} />
          <Text style={{ fontSize: 12, fontWeight: "600", color: activeMode === "deaf" ? colors.primaryText : colors.text }}>Deaf/HoH</Text>
        </TouchableOpacity>
      </View>

      <ScrollView ref={scrollRef} style={{ flex: 1 }} contentContainerStyle={{ padding: 12, paddingBottom: 8, gap: 8 }}>
        {messages.length === 0 && (
          <View style={{ alignItems: "center", paddingVertical: 40 }}>
            <Ionicons name="chatbubbles-outline" size={40} color={colors.textTertiary} />
            <Text style={{ color: colors.textSecondary, marginTop: 8, fontSize: 13, textAlign: "center" }}>
              Start a conversation by typing or speaking
            </Text>
          </View>
        )}
        {messages.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.bubble,
              msg.from === "hearing"
                ? { alignSelf: "flex-end", backgroundColor: colors.primary }
                : { alignSelf: "flex-start", backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
            ]}
          >
            <Text style={{ fontSize: 14, color: msg.from === "hearing" ? colors.primaryText : colors.text }}>{msg.text}</Text>
            <View style={{ flexDirection: "row", gap: 12, marginTop: 4 }}>
              {msg.from === "hearing" && (
                <TouchableOpacity onPress={() => setSelectedMessage(msg.text)} data-testid={`button-sign-${msg.id}`}>
                  <Ionicons name="hand-left-outline" size={16} color={msg.from === "hearing" ? colors.primaryText + "AA" : colors.textTertiary} />
                </TouchableOpacity>
              )}
              {msg.from === "deaf" && (
                <TouchableOpacity onPress={() => speakMessage(msg.text)} data-testid={`button-speak-${msg.id}`}>
                  <Ionicons name="volume-high-outline" size={16} color={colors.textTertiary} />
                </TouchableOpacity>
              )}
              <Text style={{ fontSize: 10, color: msg.from === "hearing" ? colors.primaryText + "88" : colors.textTertiary }}>
                {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {selectedMessage && (
        <View style={[styles.signPanel, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
            <Text style={{ fontSize: 13, fontWeight: "600", color: colors.text }}>Sign: {selectedMessage}</Text>
            <TouchableOpacity onPress={() => setSelectedMessage(null)}>
              <Ionicons name="close" size={20} color={colors.textTertiary} />
            </TouchableOpacity>
          </View>
          <WordSignDisplay text={selectedMessage} speed={2500} autoPlay />
        </View>
      )}

      <View style={[styles.inputRow, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
        {activeMode === "hearing" && (
          <TouchableOpacity
            onPress={isRecording ? stopRecording : startRecording}
            disabled={isProcessing}
            style={[styles.iconBtn, { backgroundColor: isRecording ? colors.danger : colors.muted }]}
            data-testid="button-voice-input"
          >
            <Ionicons
              name={isRecording ? "stop" : isProcessing ? "hourglass" : "mic"}
              size={20}
              color={isRecording ? "white" : colors.text}
            />
          </TouchableOpacity>
        )}
        <TextInput
          style={[styles.chatInput, { color: colors.text, backgroundColor: colors.input, borderColor: colors.border }]}
          value={inputText}
          onChangeText={setInputText}
          placeholder={activeMode === "hearing" ? "Type or speak..." : "Type your message..."}
          placeholderTextColor={colors.textTertiary}
          onSubmitEditing={sendText}
          data-testid="input-conversation"
        />
        <TouchableOpacity onPress={sendText} style={[styles.iconBtn, { backgroundColor: colors.primary }]} data-testid="button-send">
          <Ionicons name="send" size={18} color={colors.primaryText} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  modeRow: { flexDirection: "row", gap: 8, padding: 8, borderBottomWidth: 1 },
  modeBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 10, borderRadius: 8 },
  bubble: { maxWidth: "80%", paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12 },
  signPanel: { padding: 12, borderTopWidth: 1, alignItems: "center", gap: 8 },
  inputRow: { flexDirection: "row", gap: 8, padding: 8, borderTopWidth: 1, alignItems: "center" },
  iconBtn: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  chatInput: { flex: 1, borderWidth: 1, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, fontSize: 14 },
});
