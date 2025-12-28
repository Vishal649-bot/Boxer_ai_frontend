// https://chatgpt.com/share/694ff814-5d48-8011-a09d-2e5b4d5d0646


import { View, Text, TouchableOpacity, Alert, Animated, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useState, useEffect, useRef } from "react";
import { saveSession } from "../../utils/sessionStorage";
import { ScrollView } from "react-native";
import * as FileSystem from "expo-file-system/legacy";
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from "react-native-safe-area-context";

const BACKEND_URL = "http://192.168.1.7:5000";

export default function AICheck() {
  const [video, setVideo] = useState(null);
  const [uploadedPath, setUploadedPath] = useState(null);
  const [perspective, setPerspective] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const loadingRotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Initial entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous pulse animation for header icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    if (loading) {
      Animated.loop(
        Animated.timing(loadingRotation, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        })
      ).start();
    } else {
      loadingRotation.setValue(0);
    }
  }, [loading]);

  const spin = loadingRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Pick video
  const pickVideo = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["videos"],
    });

    if (!result.canceled) {
      console.log("VIDEO ASSET:", result.assets[0]);
      const pickedVideo = result.assets[0];

      const newVideoPath =
        FileSystem.documentDirectory + `boxing-${Date.now()}.mp4`;

      await FileSystem.copyAsync({
        from: pickedVideo.uri,
        to: newVideoPath,
      });

      setVideo({
        ...pickedVideo,
        persistedUri: newVideoPath,
      });

      setUploadedPath(null);
      setPerspective(null);
    }

    setUploadedPath(null);
    setFeedback(null);
    setPerspective(null);
  };

  // Upload video
  const uploadVideo = async () => {
    if (!video) return;

    const formData = new FormData();
    formData.append("video", {
      uri: video.uri,
      name: "upload.mp4",
      type: "video/mp4",
    });

    try {
      const res = await fetch(`${BACKEND_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("UPLOAD RESPONSE:", data);

      setUploadedPath(data.congempath || data.videoPath || data.videoUrl);

      Alert.alert("Uploaded", "Video uploaded successfully");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Upload failed");
    }
  };

  // Analyze video
  const analyzeVideo = async () => {
    if (!uploadedPath) {
      Alert.alert("Upload first", "Please upload video before analysis");
      return;
    }

    if (!perspective) {
      Alert.alert(
        "Select boxer",
        "Please choose Left, Right, or Alone before analysis"
      );
      return;
    }

    try {
      setLoading(true);
      setFeedback(null);

      const res = await fetch(`${BACKEND_URL}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: uploadedPath,
          perspective,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Analysis failed");
      }

      setFeedback(data.feedback);

      const session = {
        id: Date.now(),
        videoUri: video.persistedUri,
        feedback: data.feedback,
        perspective,
        createdAt: new Date().toISOString(),
      };

      await saveSession(session);
      Alert.alert("AI Feedback", data.feedback);
    } catch (err) {
      // Alert.alert("Error", err.message || "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
      {/* Animated Background Elements */}
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />
      <View style={styles.bgCircle3} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View 
          style={[
            styles.headerContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <LinearGradient
              colors={['#FF3B30', '#FF6B6B']}
              style={styles.headerIcon}
            >
              <Text style={styles.headerEmoji}>🥊</Text>
            </LinearGradient>
          </Animated.View>
          
          <Text style={styles.headerTitle}>AI Boxing Coach</Text>
          <Text style={styles.headerSubtitle}>
            Get instant feedback on your technique
          </Text>
        </Animated.View>

        {/* Instructions Card */}
        <Animated.View 
          style={[
            styles.instructionsCard,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.instructionsHeader}>
            <Text style={styles.instructionsEmoji}>⚡</Text>
            <Text style={styles.instructionsTitle}>Quick Guide</Text>
          </View>
          <Text style={styles.instructionsText}>
            • Upload a boxing video (10-20 seconds){"\n"}
            • Select your position if multiple boxers{"\n"}
            • Get AI-powered technique analysis
          </Text>
        </Animated.View>

        {/* Perspective Selection */}
        <Animated.View 
          style={[
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
          ]}
        >
          <Text style={styles.sectionTitle}>Select Your Position</Text>
          <View style={styles.perspectiveContainer}>
            <PerspectiveButton
              title="Left"
              isSelected={perspective === "left"}
              onPress={() => setPerspective("left")}
              gradient={['#FF3B30', '#FF6B6B']}
              icon="👈"
            />
            <PerspectiveButton
              title="Right"
              isSelected={perspective === "right"}
              onPress={() => setPerspective("right")}
              gradient={['#FF9500', '#FFAA00']}
              icon="👉"
            />
            <PerspectiveButton
              title="Alone"
              isSelected={perspective === "alone"}
              onPress={() => setPerspective("alone")}
              gradient={['#007AFF', '#0096FF']}
              icon="🥊"
            />
          </View>
        </Animated.View>

        {perspective && (
          <Animated.View 
            entering={{ opacity: 0, scale: 0.9 }}
            style={styles.selectedBadge}
          >
            <Text style={styles.selectedBadgeText}>
              ✓ Position: {perspective.toUpperCase()}
            </Text>
          </Animated.View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            onPress={pickVideo}
            activeOpacity={0.85}
            style={styles.actionButton}
          >
            <LinearGradient
              colors={['#1a1a1a', '#2d2d2d']}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonIcon}>📹</Text>
              <Text style={styles.buttonText}>Pick Video</Text>
            </LinearGradient>
          </TouchableOpacity>

          {video && (
            <>
              <View style={styles.videoSelectedCard}>
                <View style={styles.videoIconContainer}>
                  <Text style={styles.videoCheckIcon}>✓</Text>
                </View>
                <View style={styles.videoTextContainer}>
                  <Text style={styles.videoSelectedTitle}>Video Ready</Text>
                  <Text style={styles.videoSelectedSubtitle}>Ready to upload</Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={uploadVideo}
                activeOpacity={0.85}
                style={styles.actionButton}
              >
                <LinearGradient
                  colors={['#8B45FF', '#A855F7']}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.buttonIcon}>⬆️</Text>
                  <Text style={styles.buttonText}>Upload Video</Text>
                </LinearGradient>
              </TouchableOpacity>

              {uploadedPath && (
                <TouchableOpacity
                  onPress={analyzeVideo}
                  activeOpacity={0.85}
                  style={styles.actionButton}
                >
                  <LinearGradient
                    colors={['#FF3B30', '#FF6B6B']}
                    style={styles.buttonGradient}
                  >
                    <Text style={styles.buttonIcon}>🤖</Text>
                    <Text style={styles.buttonText}>Analyze Technique</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>

        {/* Loading Animation */}
        {loading && (
          <Animated.View style={styles.loadingCard}>
            <Animated.View style={{ transform: [{ rotate: spin }] }}>
              <Text style={styles.loadingEmoji}>🧠</Text>
            </Animated.View>
            <Text style={styles.loadingTitle}>Analyzing Your Form</Text>
            <Text style={styles.loadingSubtitle}>
              AI is reviewing your boxing technique...
            </Text>
            <View style={styles.loadingBar}>
              <View style={styles.loadingBarFill} />
            </View>
          </Animated.View>
        )}

        {/* Feedback Card */}
        {feedback && (
          <View style={styles.feedbackCard}>
            <LinearGradient
              colors={['#34C759', '#4CD964']}
              style={styles.feedbackHeader}
            >
              <View style={styles.feedbackHeaderContent}>
                <Text style={styles.feedbackIcon}>🥊</Text>
                <View>
                  <Text style={styles.feedbackTitle}>AI Analysis Complete</Text>
                  <Text style={styles.feedbackSubtitle}>Your technique breakdown</Text>
                </View>
              </View>
            </LinearGradient>

            <View style={styles.feedbackContent}>
              <Text style={styles.feedbackText}>{feedback}</Text>

              <View style={styles.disclaimerCard}>
                <Text style={styles.disclaimerIcon}>⚠️</Text>
                <Text style={styles.disclaimerText}>
                  This analysis is based on visible movement and posture. Use it as training guidance, not professional or medical advice.
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------- PERSPECTIVE BUTTON COMPONENT ---------- */

function PerspectiveButton({ title, isSelected, onPress, gradient, icon }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={styles.perspectiveButton}
    >
      {isSelected ? (
        <LinearGradient
          colors={gradient}
          style={styles.perspectiveButtonSelected}
        >
          <Text style={styles.perspectiveIcon}>{icon}</Text>
          <Text style={styles.perspectiveTextSelected}>{title}</Text>
        </LinearGradient>
      ) : (
        <View style={styles.perspectiveButtonUnselected}>
          <Text style={styles.perspectiveIconUnselected}>{icon}</Text>
          <Text style={styles.perspectiveTextUnselected}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  bgCircle1: {
    position: "absolute",
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: "rgba(255, 59, 48, 0.15)",
    top: -150,
    right: -100,
  },
  bgCircle2: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(139, 69, 255, 0.12)",
    bottom: 100,
    left: -80,
  },
  bgCircle3: {
    position: "absolute",
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: "rgba(255, 149, 0, 0.1)",
    top: "50%",
    left: -60,
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 32,
    marginTop: 20,
  },
  headerIcon: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#FF3B30",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  headerEmoji: {
    fontSize: 45,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "900",
    color: "#FFFFFF",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.7)",
    fontWeight: "500",
  },
  instructionsCard: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    padding: 20,
    borderRadius: 20,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  instructionsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  instructionsEmoji: {
    fontSize: 24,
    marginRight: 10,
  },
  instructionsTitle: {
    fontWeight: "800",
    fontSize: 18,
    color: "#FFFFFF",
  },
  instructionsText: {
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.7)",
    lineHeight: 24,
    fontWeight: "500",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 16,
    color: "#FFFFFF",
  },
  perspectiveContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  perspectiveButton: {
    flex: 1,
  },
  perspectiveButtonSelected: {
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#FF3B30",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  perspectiveButtonUnselected: {
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  perspectiveIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  perspectiveIconUnselected: {
    fontSize: 24,
    marginBottom: 4,
    opacity: 0.6,
  },
  perspectiveTextSelected: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
  },
  perspectiveTextUnselected: {
    color: "rgba(255, 255, 255, 0.6)",
    fontWeight: "600",
    fontSize: 15,
  },
  selectedBadge: {
    backgroundColor: "rgba(52, 199, 89, 0.15)",
    padding: 14,
    borderRadius: 12,
    marginBottom: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(52, 199, 89, 0.3)",
  },
  selectedBadgeText: {
    color: "#34C759",
    fontWeight: "700",
    fontSize: 15,
  },
  actionsContainer: {
    gap: 16,
  },
  actionButton: {
    marginBottom: 0,
  },
  buttonGradient: {
    padding: 20,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  buttonIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },
  videoSelectedCard: {
    backgroundColor: "rgba(52, 199, 89, 0.15)",
    padding: 18,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(52, 199, 89, 0.3)",
  },
  videoIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#34C759",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  videoCheckIcon: {
    fontSize: 26,
    color: "#FFFFFF",
  },
  videoTextContainer: {
    flex: 1,
  },
  videoSelectedTitle: {
    fontWeight: "700",
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 2,
  },
  videoSelectedSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
  },
  loadingCard: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    padding: 32,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  loadingEmoji: {
    fontSize: 60,
    marginBottom: 20,
  },
  loadingTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  loadingSubtitle: {
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
    marginBottom: 20,
  },
  loadingBar: {
    width: "100%",
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 2,
    overflow: "hidden",
  },
  loadingBarFill: {
    width: "70%",
    height: "100%",
    backgroundColor: "#8B45FF",
  },
  feedbackCard: {
    marginTop: 28,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  feedbackHeader: {
    padding: 24,
  },
  feedbackHeaderContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  feedbackIcon: {
    fontSize: 36,
    marginRight: 16,
  },
  feedbackTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  feedbackSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "500",
  },
  feedbackContent: {
    padding: 24,
  },
  feedbackText: {
    lineHeight: 26,
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 24,
    fontWeight: "500",
  },
  disclaimerCard: {
    backgroundColor: "rgba(255, 149, 0, 0.15)",
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#FF9500",
    flexDirection: "row",
  },
  disclaimerIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.8)",
    lineHeight: 20,
    fontWeight: "500",
  },
});