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
      {/* Decorative gradient background */}
      <View style={styles.gradientCircle1} />
      <View style={styles.gradientCircle2} />
      
      <View style={styles.content}>
        <View style={styles.progressContainer}>
          <View style={[styles.progressDot, styles.progressComplete]} />
          <View style={[styles.progressDot, styles.progressComplete]} />
          <View style={[styles.progressDot, styles.progressComplete]} />
          <View style={[styles.progressDot, styles.progressActive]} />
        </View>
        
        <Text style={styles.step}>FINAL STEP</Text>
        
        <Text style={styles.question}>What is your{'\n'}boxing stance?</Text>
        
        <View style={styles.optionsContainer}>
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  gradientCircle1: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    top: -100,
    right: -100,
    backgroundColor: "rgba(139, 69, 255, 0.15)",
    blur: 60,
  },
  gradientCircle2: {
    position: "absolute",
    width: 250,
    height: 250,
    borderRadius: 125,
    bottom: -80,
    left: -80,
    backgroundColor: "rgba(255, 107, 107, 0.12)",
    blur: 50,
  },
  content: {
    flex: 1,
    padding: 32,
    justifyContent: "center",
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 12,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  progressActive: {
    backgroundColor: "#8B45FF",
    width: 24,
  },
  progressComplete: {
    backgroundColor: "#8B45FF",
  },
  step: {
    color: "#8B45FF",
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 24,
    letterSpacing: 2,
  },
  question: {
    color: "#FFFFFF",
    fontSize: 36,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 48,
    lineHeight: 44,
  },
  optionsContainer: {
    gap: 16,
  },
});