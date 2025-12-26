import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function IntroScreen1() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🥊 AI Boxing Coach</Text>

      <Text style={styles.text}>
        Upload your boxing videos and get instant AI feedback on your technique.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/intro/screen2")}
      >
        <Text style={styles.buttonText}>Next</Text>
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
