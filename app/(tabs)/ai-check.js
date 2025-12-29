import {View, Text, TouchableOpacity, Alert, Animated, StyleSheet, Modal} from "react-native";
import * as ImagePicker from "expo-image-picker";
import {useState, useEffect, useRef} from "react";
import {saveSession} from "../../utils/sessionStorage";
import {ScrollView} from "react-native";
import * as FileSystem from "expo-file-system/legacy";
import {LinearGradient} from 'expo-linear-gradient';
import {SafeAreaView} from "react-native-safe-area-context";
import {MaterialCommunityIcons, Ionicons} from "@expo/vector-icons";
import {UploadLoadingModal, AnalysisLoadingModal} from "../../components/loading_screen";

const BACKEND_URL="http://192.168.1.7:5000";

export default function AICheck() {
  const [video, setVideo]=useState(null);
  const [uploadedPath, setUploadedPath]=useState(null);
  const [perspective, setPerspective]=useState(null);
  const [feedback, setFeedback]=useState(null);
  const [loading, setLoading]=useState(false);
  const [uploadingVideo, setUploadingVideo]=useState(false);

  // Animations
  const fadeAnim=useRef(new Animated.Value(0)).current;
  const slideAnim=useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const pickVideo=async () => {
    try {
      const permission=await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Permission Denied", "You need to grant media library permission");
        return;
      }

      const result=await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["videos"],
        quality: 0.5,
      });

      if (!result.canceled && result.assets.length > 0) {
        const pickedVideo=result.assets[0];
        console.log("Video Selected:", {
          uri: pickedVideo.uri,
          duration: pickedVideo.duration,
          size: pickedVideo.fileSize,
        });

        setVideo({
          uri: pickedVideo.uri,
          name: `video-${Date.now()}.mp4`,
          type: "video/mp4",
          size: pickedVideo.fileSize,
          duration: pickedVideo.duration,
        });

        setUploadedPath(null);
        setFeedback(null);
        setPerspective(null);
      }
    } catch (err) {
      console.error("Error picking video:", err);
      Alert.alert("Error", "Failed to pick video");
    }
  };

  const uploadVideo=async () => {
    if (!video) {
      Alert.alert("No Video", "Please select a video first");
      return;
    }

    if (video.size && video.size > 50 * 1024 * 1024) {
      Alert.alert("File Too Large", "Video must be less than 50MB");
      return;
    }

    setUploadingVideo(true);
    setLoading(true);

    try {
      const formData=new FormData();
      formData.append("video", {
        uri: video.uri,
        name: video.name,
        type: video.type,
      });

      console.log("Starting upload...");
      
      const res=await fetch(`${BACKEND_URL}/upload`, {
        method: "POST",
        body: formData,
        timeout: 60000,
      });

      if (!res.ok) {
        throw new Error(`HTTP Error: ${res.status}`);
      }

      const data=await res.json();
      console.log("Upload successful:", data);

      if (data.videoPath || data.videoUrl || data.congempath) {
        setUploadedPath(data.videoPath || data.videoUrl || data.congempath);
        Alert.alert("Success", "Video uploaded successfully!");
      } else {
        throw new Error("No video path returned from server");
      }
    } catch (err) {
      console.error("Upload error:", err);
      Alert.alert("Upload Failed", err.message || "Failed to upload video. Check your connection.");
    } finally {
      setUploadingVideo(false);
      setLoading(false);
    }
  };

  const analyzeVideo=async () => {
    if (!uploadedPath) {
      Alert.alert("Upload First", "Please upload video before analysis");
      return;
    }

    if (!perspective) {
      Alert.alert("Select Position", "Please choose Left, Right, or Alone");
      return;
    }

    setUploadingVideo(false);
    setLoading(true);
    setFeedback(null);

    try {
      const res=await fetch(`${BACKEND_URL}/analyze`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          path: uploadedPath,
          perspective,
        }),
      });

      const data=await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Analysis failed");
      }

      setFeedback(data.feedback);

      const session={
        id: Date.now(),
        videoUri: video.uri,
        feedback: data.feedback,
        perspective,
        createdAt: new Date().toISOString(),
      };

      await saveSession(session);
      Alert.alert("Analysis Complete", data.feedback);
    } catch (err) {
      console.error("Analysis error:", err);
      Alert.alert("Error", err.message || "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
      {/* Subtle Background Elements */}
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Compact Header */}
        <Animated.View
          style={[
            styles.headerContainer,
            {
              opacity: fadeAnim,
              transform: [{translateY: slideAnim}]
            }
          ]}
        >
          <LinearGradient
            colors={['#FF3B30', '#FF6B6B']}
            style={styles.headerIcon}
          >
            <MaterialCommunityIcons name="boxing-glove" size={32} color="#fff" />
          </LinearGradient>

          <Text style={styles.headerTitle}>AI Boxing Coach</Text>
          <Text style={styles.headerSubtitle}>
            Instant technique analysis
          </Text>
        </Animated.View>

        {/* Perspective Selection */}
        <Animated.View
          style={[
            {opacity: fadeAnim, transform: [{translateY: slideAnim}]}
          ]}
        >
          <Text style={styles.sectionTitle}>Your Position</Text>
          <View style={styles.perspectiveContainer}>
            <PerspectiveButton
              title="Left"
              isSelected={perspective==="left"}
              onPress={() => setPerspective("left")}
              gradient={['#FF3B30', '#FF6B6B']}
              icon="arrow-back"
            />
            <PerspectiveButton
              title="Right"
              isSelected={perspective==="right"}
              onPress={() => setPerspective("right")}
              gradient={['#FF9500', '#FFAA00']}
              icon="arrow-forward"
            />
            <PerspectiveButton
              title="Alone"
              isSelected={perspective==="alone"}
              onPress={() => setPerspective("alone")}
              gradient={['#007AFF', '#0096FF']}
              icon="person"
            />
          </View>
        </Animated.View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            onPress={pickVideo}
            activeOpacity={0.7}
            style={styles.actionButton}
            disabled={loading}
          >
            <LinearGradient
              colors={['#1a1a1a', '#2d2d2d']}
              style={styles.buttonGradient}
            >
              <Ionicons name="videocam" size={18} color="#fff" style={{marginRight: 8}} />
              <Text style={styles.buttonText}>Select Video</Text>
            </LinearGradient>
          </TouchableOpacity>

          {video&&(
            <>
              <View style={styles.videoSelectedCard}>
                <View style={styles.videoIconContainer}>
                  <Ionicons name="checkmark-circle" size={20} color="#34C759" />
                </View>
                <Text style={styles.videoSelectedText}>
                  Video ready • {video.duration ? `${Math.round(video.duration / 1000)}s` : "Ready"}
                </Text>
              </View>

              <TouchableOpacity
                onPress={uploadVideo}
                activeOpacity={0.7}
                style={styles.actionButton}
                disabled={loading}
              >
                <LinearGradient
                  colors={loading ? ['#555', '#666'] : ['#8B45FF', '#A855F7']}
                  style={styles.buttonGradient}
                >
                  <Ionicons name="cloud-upload" size={18} color="#fff" style={{marginRight: 8}} />
                  <Text style={styles.buttonText}>Upload</Text>
                </LinearGradient>
              </TouchableOpacity>

              {uploadedPath&&(
                <TouchableOpacity
                  onPress={analyzeVideo}
                  activeOpacity={0.7}
                  style={styles.actionButton}
                  disabled={loading}
                >
                  <LinearGradient
                    colors={loading ? ['#555', '#666'] : ['#FF3B30', '#FF6B6B']}
                    style={styles.buttonGradient}
                  >
                    <MaterialCommunityIcons name="robot" size={18} color="#fff" style={{marginRight: 8}} />
                    <Text style={styles.buttonText}>Analyze</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>

        {/* Feedback Card */}
        {feedback&&(
          <View style={styles.feedbackCard}>
            <View style={styles.feedbackHeader}>
              <MaterialCommunityIcons name="check-circle" size={24} color="#34C759" />
              <Text style={styles.feedbackTitle}>Analysis Complete</Text>
            </View>

            <Text style={styles.feedbackText}>{feedback}</Text>

            <View style={styles.disclaimerCard}>
              <Ionicons name="information-circle" size={16} color="#FF9500" />
              <Text style={styles.disclaimerText}>
                AI analysis for training guidance only
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Loading Modals */}
      <UploadLoadingModal visible={loading && uploadingVideo} />
      <AnalysisLoadingModal visible={loading && !uploadingVideo} />
    </SafeAreaView>
  );
}

/* ---------- PERSPECTIVE BUTTON COMPONENT ---------- */

function PerspectiveButton({title, isSelected, onPress, gradient, icon}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={styles.perspectiveButton}
    >
      {isSelected? (
        <LinearGradient
          colors={gradient}
          style={styles.perspectiveButtonSelected}
        >
          <Ionicons name={icon} size={18} color="#fff" />
          <Text style={styles.perspectiveTextSelected}>{title}</Text>
        </LinearGradient>
      ):(
        <View style={styles.perspectiveButtonUnselected}>
          <Ionicons name={icon} size={18} color="rgba(255, 255, 255, 0.5)" />
          <Text style={styles.perspectiveTextUnselected}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

/* ---------- STYLES ---------- */

const styles=StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  bgCircle1: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(255, 59, 48, 0.08)",
    top: -100,
    right: -80,
  },
  bgCircle2: {
    position: "absolute",
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: "rgba(139, 69, 255, 0.08)",
    bottom: 80,
    left: -60,
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  headerIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#FF3B30",
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.6)",
    fontWeight: "500",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
    color: "#FFFFFF",
  },
  perspectiveContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 24,
  },
  perspectiveButton: {
    flex: 1,
  },
  perspectiveButtonSelected: {
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    shadowColor: "#FF3B30",
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  perspectiveButtonUnselected: {
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  perspectiveTextSelected: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 13,
  },
  perspectiveTextUnselected: {
    color: "rgba(255, 255, 255, 0.5)",
    fontWeight: "600",
    fontSize: 13,
  },
  actionsContainer: {
    gap: 12,
  },
  actionButton: {
    marginBottom: 0,
  },
  buttonGradient: {
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  videoSelectedCard: {
    backgroundColor: "rgba(52, 199, 89, 0.12)",
    padding: 14,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(52, 199, 89, 0.25)",
  },
  videoIconContainer: {
    marginRight: 10,
  },
  videoSelectedText: {
    fontWeight: "600",
    fontSize: 14,
    color: "#FFFFFF",
  },
  feedbackCard: {
    marginTop: 24,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  feedbackHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 10,
  },
  feedbackTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  feedbackText: {
    lineHeight: 22,
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 16,
    fontWeight: "500",
  },
  disclaimerCard: {
    backgroundColor: "rgba(255, 149, 0, 0.12)",
    padding: 12,
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: "#FF9500",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
    fontWeight: "500",
  },
});