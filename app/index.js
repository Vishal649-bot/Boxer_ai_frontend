import { Redirect } from "expo-router";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useOnboarding } from "../context/OnboardingContext";
import { View, ActivityIndicator } from "react-native";

export default function Home() {
  const { isSignedIn, isLoaded } = useAuth();
  const { completed, loading: onboardingLoading } = useOnboarding();
  const { user } = useUser();

  // Show loading while checking auth and onboarding status
  if (!isLoaded || onboardingLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Redirect to sign-in if not authenticated
  if (!isSignedIn) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  // Redirect to onboarding if not completed
  if (!completed) {
    return <Redirect href="/onboarding/intro-1" />;
  }

  return <Redirect href="/(tabs)/ai-check" />;
}
