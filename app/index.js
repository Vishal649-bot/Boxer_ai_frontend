import { Redirect } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { useOnboarding } from "../context/OnboardingContext";
import { View, ActivityIndicator } from "react-native";

export default function Home() {
  const { user, loading } = useAuth();
  const { completed } = useOnboarding();

  

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // if (!user) return <Redirect href="/(auth)/login" />;
  if (!completed) return <Redirect href="/onboarding/step1-name" />;

  return <Redirect href="/(tabs)/ai-check" />;
}
