import { useState, useRef } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useThemeColors } from "../lib/theme";
import { api } from "../lib/api";

export default function SignToTextScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [resultText, setResultText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const cameraRef = useRef<any>(null);
  const colors = useThemeColors();

  const handleCapture = async () => {
    if (!cameraRef.current) return;
    try {
      const photo = await cameraRef.current.takePictureAsync({ base64: true, quality: 0.7 });
      setCapturedImage(photo.uri);
      setCameraActive(false);

      setIsAnalyzing(true);
      try {
        const result = await api.analyzeSign(photo.base64);
        setResultText(result.text || "Could not identify sign");
      } catch (e: any) {
        Alert.alert("Error", e.message || "Failed to analyze image");
        setResultText("");
      }
      setIsAnalyzing(false);
    } catch (err) {
      Alert.alert("Error", "Failed to capture image");
    }
  };

  if (!permission) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.textSecondary }}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <View style={[styles.emptyIcon, { backgroundColor: colors.muted }]}>
          <Ionicons name="camera-outline" size={32} color={colors.textTertiary} />
        </View>
        <Text style={{ color: colors.textSecondary, fontSize: 14, marginTop: 12, textAlign: "center", paddingHorizontal: 40, marginBottom: 16 }}>
          Camera access is needed to detect sign language gestures
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          style={[styles.button, { backgroundColor: colors.primary }]}
          data-testid="button-grant-camera"
        >
          <Text style={{ color: colors.primaryText, fontWeight: "600" }}>Grant Camera Access</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      {cameraActive ? (
        <View style={styles.cameraContainer}>
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing="front"
          />
          <View style={styles.cameraControls}>
            <TouchableOpacity
              onPress={() => setCameraActive(false)}
              style={[styles.cameraBtn, { backgroundColor: "rgba(0,0,0,0.5)" }]}
            >
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleCapture}
              style={[styles.captureBtn, { borderColor: "white" }]}
              data-testid="button-capture"
            >
              <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: "white" }} />
            </TouchableOpacity>
            <View style={{ width: 44 }} />
          </View>
        </View>
      ) : (
        <View style={{ gap: 16 }}>
          <TouchableOpacity
            onPress={() => { setCameraActive(true); setCapturedImage(null); setResultText(""); }}
            style={[styles.startButton, { backgroundColor: colors.card, borderColor: colors.border }]}
            data-testid="button-open-camera"
          >
            <View style={[styles.cameraIcon, { backgroundColor: colors.primary + "15" }]}>
              <Ionicons name="camera" size={32} color={colors.primary} />
            </View>
            <Text style={[styles.startText, { color: colors.text }]}>Open Camera</Text>
            <Text style={{ fontSize: 12, color: colors.textSecondary }}>
              Point the camera at a sign language gesture to translate it
            </Text>
          </TouchableOpacity>

          {capturedImage && (
            <View style={[styles.resultCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Image source={{ uri: capturedImage }} style={styles.preview} />
              {isAnalyzing ? (
                <View style={{ alignItems: "center", gap: 8 }}>
                  <Ionicons name="hourglass" size={24} color={colors.primary} />
                  <Text style={{ color: colors.textSecondary }}>Analyzing sign language...</Text>
                </View>
              ) : resultText ? (
                <View style={{ gap: 8, width: "100%" }}>
                  <Text style={{ fontSize: 13, fontWeight: "600", color: colors.textSecondary }}>Detected Sign</Text>
                  <View style={[styles.resultBox, { backgroundColor: colors.muted }]}>
                    <Text style={{ fontSize: 18, fontWeight: "bold", color: colors.text }}>{resultText}</Text>
                  </View>
                </View>
              ) : null}
            </View>
          )}

          {!capturedImage && (
            <View style={{ alignItems: "center", paddingVertical: 20 }}>
              <Text style={{ color: colors.textSecondary, fontSize: 13, textAlign: "center" }}>
                Capture a photo of a sign language gesture for AI-powered translation
              </Text>
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  emptyIcon: { width: 64, height: 64, borderRadius: 32, alignItems: "center", justifyContent: "center" },
  button: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 8 },
  cameraContainer: { height: 400, borderRadius: 12, overflow: "hidden", position: "relative" },
  camera: { flex: 1 },
  cameraControls: { position: "absolute", bottom: 20, left: 0, right: 0, flexDirection: "row", justifyContent: "space-around", alignItems: "center" },
  cameraBtn: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  captureBtn: { width: 68, height: 68, borderRadius: 34, borderWidth: 4, alignItems: "center", justifyContent: "center" },
  startButton: { padding: 24, borderRadius: 12, borderWidth: 1, alignItems: "center", gap: 8 },
  cameraIcon: { width: 64, height: 64, borderRadius: 32, alignItems: "center", justifyContent: "center" },
  startText: { fontSize: 18, fontWeight: "600" },
  resultCard: { padding: 16, borderRadius: 12, borderWidth: 1, alignItems: "center", gap: 12 },
  preview: { width: "100%", height: 200, borderRadius: 8 },
  resultBox: { padding: 16, borderRadius: 8, alignItems: "center" },
});
