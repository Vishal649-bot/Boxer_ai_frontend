import { View, Text, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";

export default function Intro5() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Rocket pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Button glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Animated background elements */}
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />
      <View style={styles.bgCircle3} />
      <View style={styles.bgCircle4} />
      
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <Animated.Text 
          style={[
            styles.emoji,
            { transform: [{ scale: Animated.multiply(scaleAnim, pulseAnim) }] }
          ]}
        >
          🚀
        </Animated.Text>
        
        <Text style={styles.title}>Let's Get Started</Text>
        
        <Text style={styles.subtitle}>Ready to Fight</Text>
        
        <Text style={styles.text}>
          Answer a few quick questions so we can personalize your experience.
        </Text>
        
        <View style={styles.indicatorContainer}>
          <View style={styles.indicator} />
          <View style={styles.indicator} />
          <View style={styles.indicator} />
          <View style={styles.indicator} />
          <View style={[styles.indicator, styles.indicatorActive]} />
        </View>
      </Animated.View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.replace("/onboarding/step1-name")}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Start Training</Text>
        <Text style={styles.arrow}>🥊</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
    justifyContent: "space-between",
    padding: 32,
    paddingTop: 80,
    paddingBottom: 50,
  },
  bgCircle1: {
    position: "absolute",
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: "rgba(191, 90, 242, 0.15)",
    top: -200,
    left: -100,
  },
  bgCircle2: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(255, 59, 48, 0.12)",
    bottom: -100,
    right: -50,
  },
  bgCircle3: {
    position: "absolute",
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: "rgba(255, 149, 0, 0.1)",
    top: "40%",
    right: -80,
  },
  bgCircle4: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(191, 90, 242, 0.08)",
    bottom: "30%",
    left: -60,
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  emoji: {
    fontSize: 80,
    marginBottom: 24,
    textAlign: "center",
  },
  title: {
    fontSize: 42,
    fontWeight: "900",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 8,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#BF5AF2",
    textAlign: "center",
    marginBottom: 32,
    letterSpacing: 1,
  },
  text: {
    fontSize: 17,
    color: "rgba(255, 255, 255, 0.7)",
    lineHeight: 26,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginTop: 40,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  indicatorActive: {
    backgroundColor: "#BF5AF2",
    width: 24,
  },
  button: {
    background: "linear-gradient(135deg, #BF5AF2 0%, #FF3B30 100%)",
    backgroundColor: "#BF5AF2",
    padding: 20,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#BF5AF2",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    marginRight: 8,
  },
  arrow: {
    fontSize: 20,
  },
});