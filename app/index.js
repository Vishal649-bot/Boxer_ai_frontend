import { Redirect } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { useOnboarding } from "../context/OnboardingContext";
import { View, ActivityIndicator } from "react-native";
import { useMemo } from "react";

export default function Home() {
  const { isSignedIn, isLoaded } = useAuth();
  const { completed, loading: onboardingLoading } = useOnboarding();

  // 🔒 Wait until EVERYTHING is ready
  const isReady = isLoaded && !onboardingLoading;

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // ❌ Not signed in
  if (!isSignedIn) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  // 🧭 Signed in but onboarding not completed
  if (completed === false) {
    return <Redirect href="/onboarding/intro-1" />;
  }

  // ✅ Signed in + onboarding completed
  return <Redirect href="/(tabs)/ai-check" />;
}
