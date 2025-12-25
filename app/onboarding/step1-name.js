import { View, Text, TextInput, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import OptionButton from "../../components/OptionButton";
import colors from "../../constants/colors";
import { useOnboarding } from "../../context/OnboardingContext";


export default function Step1() {
  const router = useRouter();
  const { updateProfile } = useOnboarding();
  const [name, setName] = useState("");


  return (
    <View style={styles.container}>
      <Text style={styles.step}>Step 1 / 4</Text>
      <Text style={styles.question}>What should we call you?</Text>

      <TextInput
        style={styles.input}
        placeholder="Your name"
        placeholderTextColor={colors.muted}
        value={name}
        onChangeText={setName}
      />

      <OptionButton
        text="Next"
        onPress={() => {
          updateProfile({ name });
          router.push("/onboarding/step2-experience");
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 24,
    justifyContent: "center",
  },
  step: {
    color: colors.muted,
    textAlign: "center",
    marginBottom: 10,
  },
  question: {
    color: colors.text,
    fontSize: 22,
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#1c1c1c",
    color: colors.text,
    padding: 14,
    borderRadius: 8,
    marginBottom: 20,
  },
});
