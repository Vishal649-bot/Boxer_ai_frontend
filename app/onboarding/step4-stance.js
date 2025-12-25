import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import OptionButton from "../../components/OptionButton";
import colors from "../../constants/colors";

import { useOnboarding } from "../../context/OnboardingContext";

export default function Step4() {
  const router = useRouter();
  const { updateProfile, finishOnboarding } = useOnboarding();

  return (
    <View style={styles.container}>
      <Text style={styles.step}>Step 4 / 4</Text>
      <Text style={styles.question}>What is your boxing stance?</Text>

      <OptionButton
        text="Orthodox"
        onPress={async () => {
          await updateProfile({ stance: "Orthodox" });
          await finishOnboarding();
          router.replace("/dashboard");
        }}
      />

      <OptionButton
        text="Southpaw"
        onPress={async () => {
          await updateProfile({ stance: "Southpaw" });
          await finishOnboarding();
          router.replace("/dashboard");
        }}
      />
      <OptionButton
        text="Not sure"
        onPress={async () => {
          await updateProfile({ stance: "Not sure" });
          await finishOnboarding();
          router.replace("/(tabs)/ai-check");

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
});
