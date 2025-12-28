import { View, Text, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";

export default function Intro1() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

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
  }, []);

  return (
    <View style={styles.container}>
      {/* Animated background elements */}
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />
      <View style={styles.bgCircle3} />
      
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
            { transform: [{ scale: scaleAnim }] }
          ]}
        >
          🥊
        </Animated.Text>
        
        <Text style={styles.title}>AI Boxing Coach</Text>
        
        <Text style={styles.subtitle}>Your Personal Trainer</Text>
        
        <Text style={styles.text}>
          Upload your boxing videos and get instant AI-powered feedback on your technique.
        </Text>
        
        <View style={styles.indicatorContainer}>
          <View style={[styles.indicator, styles.indicatorActive]} />
          <View style={styles.indicator} />
          <View style={styles.indicator} />
          <View style={styles.indicator} />
          <View style={styles.indicator} />
        </View>
      </Animated.View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/onboarding/intro-2")}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Get Started</Text>
        <Text style={styles.arrow}>→</Text>
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
    backgroundColor: "rgba(255, 59, 48, 0.15)",
    top: -200,
    left: -100,
  },
  bgCircle2: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(255, 149, 0, 0.1)",
    bottom: -100,
    right: -50,
  },
  bgCircle3: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(255, 59, 48, 0.08)",
    top: "50%",
    right: -80,
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
    color: "#FF3B30",
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
    backgroundColor: "#FF3B30",
    width: 24,
  },
  button: {
    backgroundColor: "#FF3B30",
    padding: 20,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#FF3B30",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    marginRight: 8,
  },
  arrow: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
});