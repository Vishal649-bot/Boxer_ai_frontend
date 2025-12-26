import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function IntroScreen2() {
  const router = useRouter();

  const finishIntro = async () => {
    await AsyncStorage.setItem("introSeen", "true");
    router.replace("/onboarding/step1-name");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎯 Train Smarter</Text>

      <Text style={styles.text}>
        Select yourself in the video and get personalized tips on punches,
        footwork, and defense.
      </Text>

      <TouchableOpacity style={styles.button} onPress={finishIntro}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    color: "#555",
    marginBottom: 40,
  },
  button: {
    backgroundColor: "#000",
    padding: 14,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
});
