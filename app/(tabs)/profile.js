import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useOnboarding } from "../../context/OnboardingContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function Profile() {
  const { user, logout } = useAuth();
  const { profile } = useOnboarding();
  const router = useRouter();

  const resetOnboarding = async () => {
    Alert.alert(
      "Reset onboarding?",
      "You will need to answer onboarding questions again.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem("onboardingCompleted");
            router.replace("/onboarding/step1-name");
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.subtitle}>{user?.email}</Text>

      {/* Info Card */}
      <View style={styles.card}>
        <ProfileRow label="Name" value={profile.name} />
        <ProfileRow label="Experience" value={profile.experience} />
        <ProfileRow label="Goal" value={profile.goal} />
        <ProfileRow label="Stance" value={profile.stance} />
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <ActionButton
          text="Reset Onboarding"
          type="secondary"
          onPress={resetOnboarding}
        />
        <ActionButton
          text="Logout"
          type="danger"
          onPress={async () => {
            await logout();
            router.replace("/(auth)/login");
          }}
        />
      </View>
    </View>
  );
}

/* ---------- SMALL REUSABLE PARTS ---------- */

function ProfileRow({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value || "—"}</Text>
    </View>
  );
}

function ActionButton({ text, onPress, type }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        type === "danger" && styles.dangerButton,
        type === "secondary" && styles.secondaryButton,
      ]}
    >
      <Text
        style={[
          styles.buttonText,
          type === "danger" && { color: "#fff" },
        ]}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
}

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 100,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
  },
  subtitle: {
    color: "#666",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#f4f4f4",
    borderRadius: 10,
    padding: 16,
  },
  row: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    color: "#777",
  },
  value: {
    fontSize: 16,
    fontWeight: "500",
  },
  actions: {
    marginTop: 30,
  },
  button: {
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  secondaryButton: {
    backgroundColor: "#eaeaea",
  },
  dangerButton: {
    backgroundColor: "#d9534f",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
