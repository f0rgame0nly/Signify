import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import HomeScreen from "./src/screens/HomeScreen";
import TextToSignScreen from "./src/screens/TextToSignScreen";
import VoiceToSignScreen from "./src/screens/VoiceToSignScreen";
import SignToTextScreen from "./src/screens/SignToTextScreen";
import PhrasesScreen from "./src/screens/PhrasesScreen";
import ConversationScreen from "./src/screens/ConversationScreen";

const Tab = createBottomTabNavigator();

const CustomLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#5B8FB9",
    background: "#F8F9FA",
    card: "#FFFFFF",
    text: "#1A1A2E",
    border: "#E5E7EB",
    notification: "#EF4444",
  },
};

const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: "#7CB4D4",
    background: "#1A1A2E",
    card: "#16213E",
    text: "#F8F9FA",
    border: "#374151",
    notification: "#EF4444",
  },
};

type IoniconsName = keyof typeof Ionicons.glyphMap;

const tabIcons: Record<string, { focused: IoniconsName; unfocused: IoniconsName }> = {
  Home: { focused: "home", unfocused: "home-outline" },
  "Sign to Text": { focused: "camera", unfocused: "camera-outline" },
  "Text to Sign": { focused: "text", unfocused: "text-outline" },
  "Voice to Sign": { focused: "mic", unfocused: "mic-outline" },
  Phrases: { focused: "bookmarks", unfocused: "bookmarks-outline" },
  Conversation: { focused: "chatbubbles", unfocused: "chatbubbles-outline" },
};

export default function App() {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer theme={isDark ? CustomDarkTheme : CustomLightTheme}>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                const icons = tabIcons[route.name] || { focused: "help", unfocused: "help-outline" };
                return <Ionicons name={focused ? icons.focused : icons.unfocused} size={size} color={color} />;
              },
              tabBarActiveTintColor: isDark ? "#7CB4D4" : "#5B8FB9",
              tabBarInactiveTintColor: isDark ? "#6B7280" : "#9CA3AF",
              headerTitleStyle: { fontWeight: "bold" as const },
              tabBarLabelStyle: { fontSize: 10 },
            })}
          >
            <Tab.Screen name="Home" component={HomeScreen} options={{ title: "SignBridge" }} />
            <Tab.Screen name="Sign to Text" component={SignToTextScreen} />
            <Tab.Screen name="Text to Sign" component={TextToSignScreen} />
            <Tab.Screen name="Voice to Sign" component={VoiceToSignScreen} />
            <Tab.Screen name="Phrases" component={PhrasesScreen} />
            <Tab.Screen name="Conversation" component={ConversationScreen} />
          </Tab.Navigator>
        </NavigationContainer>
        <StatusBar style="auto" />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
