import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import OptionButton from "../../components/OptionButton";
import colors from "../../constants/colors";
import { useOnboarding } from "../../context/OnboardingContext";

export default function Step3() {
  const router = useRouter();
  const { updateProfile } = useOnboarding();

  return (
    <View style={styles.container}>
      <Text style={styles.step}>Step 3 / 4</Text>
      <Text style={styles.question}>What is your main goal?</Text>

      <OptionButton
        text="Learn boxing basics"
        onPress={() => {
          updateProfile({ goal: "Learn boxing basics" });
          router.push("/onboarding/step4-stance");
        }}
      />
      <OptionButton
        text="Improve technique"
        onPress={() => {
          updateProfile({ goal: "Improve technique" });
          router.push("/onboarding/step4-stance");
        }}
      />
      <OptionButton
        text="Get fitter"
        onPress={() => {
          updateProfile({ goal: "Get fitter" });
          router.push("/onboarding/step4-stance");
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
