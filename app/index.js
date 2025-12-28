import { Redirect } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { useOnboarding } from "../context/OnboardingContext";
import { View, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";

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
  if (!completed) return <Redirect href="/onboarding/intro-1" />;

  return <Redirect href="/(tabs)/ai-check" />;
}
