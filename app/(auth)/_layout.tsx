import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import React from 'react';

export default function AuthRoutesLayout() {
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    return <Redirect href={'/(tabs)/ai-check'} />;
  }

  return <Stack screenOptions={{ headerShown: false }}/>;
}

