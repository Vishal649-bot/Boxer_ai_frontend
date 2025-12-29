import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import Constants from "expo-constants";
import { Stack } from "expo-router";
import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import { OnboardingProvider } from "../context/OnboardingContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {tokenCache} from '../utils/sessionStorage'

// Get the Clerk publishable key from environment variables
const clerkPublishableKey = Constants.expoConfig?.extra?.clerkPublishableKey || 
  process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || 
  "pk_test_cHJlcGFyZWQtcmVpbmRlZXItODIuY2xlcmsuYWNjb3VudHMuZGV2JA";

// Navigation Logic Component
function RootNavigator() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait for Clerk to load
    if (!isLoaded) return;

    const checkOnboardingStatus = async () => {
      try {
        const onboardingCompleted = await AsyncStorage.getItem("onboardingCompleted");

        if (isSignedIn) {
          // User is logged in
          if (onboardingCompleted === "true") {
            // Onboarding done, go to tabs
            router.replace("/(tabs)/ai-check");
          } else {
            // Onboarding not done, go to onboarding
            router.replace("/onboarding/step1-name");
          }
        } else {
          // User is not signed in, go to sign-in
          router.replace("/(auth)/sign-in");
        }
      } catch (error) {
        console.error("Error checking onboarding status:", error);
        router.replace("/(auth)/sign-in");
      }
    };

    checkOnboardingStatus();
  }, [isSignedIn, isLoaded]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={clerkPublishableKey}  tokenCache={tokenCache}>
      <OnboardingProvider>
        <RootNavigator />
      </OnboardingProvider>
    </ClerkProvider>
  );
}