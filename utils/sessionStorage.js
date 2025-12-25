import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "ai_sessions";

export async function saveSession(session) {
  const existing = await getSessions();
  const updated = [session, ...existing];
  await AsyncStorage.setItem(KEY, JSON.stringify(updated));
}

export async function getSessions() {
  const data = await AsyncStorage.getItem(KEY);
  return data ? JSON.parse(data) : [];
}

export async function clearSessions() {
  await AsyncStorage.removeItem(KEY);
}
