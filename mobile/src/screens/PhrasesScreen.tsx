import { useState, useEffect, useCallback } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert, RefreshControl } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "../lib/theme";
import { api } from "../lib/api";
import { WordSignDisplay } from "../components/FullBodySign";

const categories = ["daily", "emergency", "medical", "business"];
const categoryIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
  daily: "sunny-outline",
  emergency: "warning-outline",
  medical: "medkit-outline",
  business: "briefcase-outline",
};

export default function PhrasesScreen() {
  const [phrases, setPhrases] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState("daily");
  const [selectedPhrase, setSelectedPhrase] = useState<string | null>(null);
  const [newPhrase, setNewPhrase] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const colors = useThemeColors();

  const loadPhrases = useCallback(async () => {
    try {
      const data = await api.getPhrases();
      setPhrases(data);
    } catch (e) {
      console.log("Failed to load phrases", e);
    }
  }, []);

  useEffect(() => { loadPhrases(); }, [loadPhrases]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPhrases();
    setRefreshing(false);
  };

  const addPhrase = async () => {
    const text = newPhrase.trim();
    if (!text) return;
    try {
      await api.createPhrase(text, activeCategory);
      setNewPhrase("");
      loadPhrases();
    } catch (e: any) {
      Alert.alert("Error", e.message || "Failed to add phrase");
    }
  };

  const toggleFavorite = async (id: number) => {
    try {
      await api.toggleFavorite(id);
      loadPhrases();
    } catch (e) {
      Alert.alert("Error", "Failed to update");
    }
  };

  const deletePhrase = (id: number) => {
    Alert.alert("Delete Phrase", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: async () => { await api.deletePhrase(id); loadPhrases(); } },
    ]);
  };

  const filtered = phrases.filter((p) => p.category === activeCategory);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.categoryRow}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            onPress={() => setActiveCategory(cat)}
            style={[
              styles.categoryChip,
              activeCategory === cat
                ? { backgroundColor: colors.primary }
                : { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 },
            ]}
            data-testid={`button-category-${cat}`}
          >
            <Ionicons name={categoryIcons[cat]} size={14} color={activeCategory === cat ? colors.primaryText : colors.text} />
            <Text style={{ fontSize: 12, fontWeight: "500", color: activeCategory === cat ? colors.primaryText : colors.text, textTransform: "capitalize" }}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={[styles.addRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <TextInput
          style={[styles.addInput, { color: colors.text, backgroundColor: colors.input, borderColor: colors.border }]}
          value={newPhrase}
          onChangeText={setNewPhrase}
          placeholder="Add a new phrase..."
          placeholderTextColor={colors.textTertiary}
          data-testid="input-new-phrase"
        />
        <TouchableOpacity onPress={addPhrase} style={[styles.addButton, { backgroundColor: colors.primary }]} data-testid="button-add-phrase">
          <Ionicons name="add" size={20} color={colors.primaryText} />
        </TouchableOpacity>
      </View>

      {selectedPhrase && (
        <View style={[styles.signCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
            <Text style={{ fontSize: 14, fontWeight: "600", color: colors.text, flex: 1 }}>{selectedPhrase}</Text>
            <TouchableOpacity onPress={() => setSelectedPhrase(null)}>
              <Ionicons name="close-circle" size={22} color={colors.textTertiary} />
            </TouchableOpacity>
          </View>
          <WordSignDisplay text={selectedPhrase} speed={2500} autoPlay />
        </View>
      )}

      {filtered.length === 0 ? (
        <View style={{ alignItems: "center", paddingVertical: 30 }}>
          <Ionicons name="bookmarks-outline" size={32} color={colors.textTertiary} />
          <Text style={{ color: colors.textSecondary, fontSize: 13, marginTop: 8 }}>No phrases in this category yet</Text>
        </View>
      ) : (
        <View style={{ gap: 8 }}>
          {filtered.map((phrase) => (
            <View key={phrase.id} style={[styles.phraseCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => setSelectedPhrase(phrase.text)}
                data-testid={`button-phrase-${phrase.id}`}
              >
                <Text style={{ fontSize: 15, color: colors.text }}>{phrase.text}</Text>
              </TouchableOpacity>
              <View style={{ flexDirection: "row", gap: 8 }}>
                <TouchableOpacity onPress={() => toggleFavorite(phrase.id)} data-testid={`button-fav-${phrase.id}`}>
                  <Ionicons name={phrase.isFavorite ? "heart" : "heart-outline"} size={20} color={phrase.isFavorite ? colors.danger : colors.textTertiary} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deletePhrase(phrase.id)} data-testid={`button-delete-${phrase.id}`}>
                  <Ionicons name="trash-outline" size={20} color={colors.textTertiary} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  categoryRow: { flexDirection: "row", gap: 8, marginBottom: 12, flexWrap: "wrap" },
  categoryChip: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  addRow: { flexDirection: "row", gap: 8, padding: 12, borderRadius: 12, borderWidth: 1, marginBottom: 16 },
  addInput: { flex: 1, borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, fontSize: 14 },
  addButton: { width: 40, height: 40, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  signCard: { padding: 16, borderRadius: 12, borderWidth: 1, alignItems: "center", gap: 12, marginBottom: 16 },
  phraseCard: { flexDirection: "row", alignItems: "center", padding: 14, borderRadius: 10, borderWidth: 1, gap: 8 },
});
