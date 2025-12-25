import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import OptionButton from "../../components/OptionButton";
import colors from "../../constants/colors";
import { useOnboarding } from "../../context/OnboardingContext";



export default function Step2() {
  const router = useRouter();
  const { updateProfile } = useOnboarding();

  return (
    <View style={styles.container}>
      <Text style={styles.step}>Step 2 / 4</Text>
      <Text style={styles.question}>Your boxing experience?</Text>

      <OptionButton
        text="Beginner"
        onPress={() => {
          updateProfile({ experience: "Beginner" });
          router.push("/onboarding/step3-goal");
        }}
      />
      <OptionButton
        text="Intermediate"
        onPress={() => {
          updateProfile({ experience: "Intermediate" });
          router.push("/onboarding/step3-goal");
        }}
      />
      <OptionButton
        text="Advanced"
        onPress={() => {
          updateProfile({ experience: "Advanced" });
          router.push("/onboarding/step3-goal");
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
