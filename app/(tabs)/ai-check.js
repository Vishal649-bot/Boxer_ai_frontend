import { View, Text, TouchableOpacity, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { saveSession } from "../../utils/sessionStorage";
import { ScrollView } from "react-native";
import * as FileSystem from "expo-file-system/legacy";
import { LinearGradient } from 'expo-linear-gradient';

const BACKEND_URL = "http://192.168.1.6:5000";

export default function AICheck() {
  const [video, setVideo] = useState(null);
  const [uploadedPath, setUploadedPath] = useState(null);
  const [perspective, setPerspective] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);

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
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        paddingVertical: 40,
        paddingHorizontal: 20,
      }}
    >
      {/* Header */}
      <View style={{ alignItems: "center", marginBottom: 30, marginTop: 40 }}>
        <LinearGradient
          colors={['#ff6b6b', '#ee5a6f']}
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 16,
            shadowColor: "#ff6b6b",
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.3,
            shadowRadius: 10,
            elevation: 8,
          }}
        >
          <Text style={{ fontSize: 40 }}>🥊</Text>
        </LinearGradient>
        <Text
          style={{
            fontSize: 28,
            fontWeight: "800",
            marginBottom: 8,
            color: "#1a1a1a",
            letterSpacing: -0.5,
          }}
        >
          AI Boxing Check
        </Text>
        <Text
          style={{
            fontSize: 15,
            color: "#666",
            textAlign: "center",
            fontWeight: "500",
          }}
        >
          Get instant feedback on your technique
        </Text>
      </View>

      {/* Instructions Card */}
      <View
        style={{
          backgroundColor: "#fff",
          padding: 20,
          borderRadius: 20,
          marginBottom: 24,
          borderLeftWidth: 4,
          borderLeftColor: "#4facfe",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4,
        }}
      >
        <Text
          style={{
            fontWeight: "700",
            fontSize: 16,
            marginBottom: 12,
            color: "#1a1a1a",
          }}
        >
          📋 How it works
        </Text>
        <Text style={{ fontSize: 14, color: "#555", lineHeight: 22 }}>
          • Upload a short boxing video (10–20 seconds){"\n"}
          • If more than one boxer is visible, select which one is you{"\n"}
          • Get AI-powered feedback on your technique
        </Text>
      </View>

      {/* Perspective Selection */}
      <Text
        style={{
          fontSize: 18,
          fontWeight: "700",
          marginBottom: 12,
          color: "#1a1a1a",
        }}
      >
        Select Boxer Position
      </Text>
      <View
        style={{
          flexDirection: "row",
          gap: 10,
          marginBottom: 24,
        }}
      >
        <PerspectiveButton
          title="Left"
          isSelected={perspective === "left"}
          onPress={() => setPerspective("left")}
          gradient={['#667eea', '#764ba2']}
        />
        <PerspectiveButton
          title="Right"
          isSelected={perspective === "right"}
          onPress={() => setPerspective("right")}
          gradient={['#f093fb', '#f5576c']}
        />
        <PerspectiveButton
          title="Alone"
          isSelected={perspective === "alone"}
          onPress={() => setPerspective("alone")}
          gradient={['#4facfe', '#00f2fe']}
        />
      </View>

      {perspective && (
        <View
          style={{
            backgroundColor: "#43e97b",
            padding: 12,
            borderRadius: 12,
            marginBottom: 24,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "700", fontSize: 14 }}>
            ✓ Selected: {perspective.toUpperCase()}
          </Text>
        </View>
      )}

      {/* Pick Video Button */}
      <TouchableOpacity
        onPress={pickVideo}
        activeOpacity={0.8}
        style={{ marginBottom: 16 }}
      >
        <LinearGradient
          colors={['#1a1a1a', '#2d2d2d']}
          style={{
            padding: 18,
            borderRadius: 16,
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 5,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "700" }}>
            📹 Pick Boxing Video
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      {video && (
        <>
          <View
            style={{
              backgroundColor: "#fff",
              padding: 16,
              borderRadius: 16,
              marginBottom: 16,
              flexDirection: "row",
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 6,
              elevation: 2,
            }}
          >
            <View
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: "#43e97b",
                justifyContent: "center",
                alignItems: "center",
                marginRight: 12,
              }}
            >
              <Text style={{ fontSize: 24 }}>✓</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontWeight: "700",
                  fontSize: 15,
                  color: "#1a1a1a",
                  marginBottom: 2,
                }}
              >
                Video Selected
              </Text>
              <Text style={{ fontSize: 13, color: "#666" }}>
                Ready to upload
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={uploadVideo}
            activeOpacity={0.8}
            style={{ marginBottom: 16 }}
          >
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={{
                padding: 18,
                borderRadius: 16,
                alignItems: "center",
                shadowColor: "#667eea",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 5,
              }}
            >
              <Text style={{ color: "#fff", fontSize: 16, fontWeight: "700" }}>
                ⬆️ Upload Video
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {uploadedPath && (
            <TouchableOpacity
              onPress={analyzeVideo}
              activeOpacity={0.8}
              style={{ marginBottom: 16 }}
            >
              <LinearGradient
                colors={['#ff6b6b', '#ee5a6f']}
                style={{
                  padding: 18,
                  borderRadius: 16,
                  alignItems: "center",
                  shadowColor: "#ff6b6b",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 5,
                }}
              >
                <Text
                  style={{ color: "#fff", fontSize: 16, fontWeight: "700" }}
                >
                  🤖 Analyze with AI
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          )}

          {loading && (
            <View
              style={{
                backgroundColor: "#fff",
                padding: 24,
                borderRadius: 20,
                alignItems: "center",
                marginTop: 20,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              <Text style={{ fontSize: 48, marginBottom: 16 }}>🧠</Text>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "700",
                  color: "#1a1a1a",
                  marginBottom: 8,
                }}
              >
                Analyzing Your Technique
              </Text>
              <Text style={{ fontSize: 14, color: "#666", textAlign: "center" }}>
                Our AI is reviewing your boxing form...
              </Text>
            </View>
          )}

          {feedback && (
            <View
              style={{
                marginTop: 24,
                backgroundColor: "#fff",
                borderRadius: 20,
                overflow: "hidden",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.15,
                shadowRadius: 12,
                elevation: 8,
              }}
            >
              <LinearGradient
                colors={['#43e97b', '#38f9d7']}
                style={{
                  padding: 20,
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "800",
                    color: "#fff",
                    marginBottom: 4,
                  }}
                >
                  🥊 AI Feedback
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    color: "rgba(255,255,255,0.9)",
                    fontWeight: "500",
                  }}
                >
                  Analysis complete
                </Text>
              </LinearGradient>

              <View style={{ padding: 20 }}>
                <Text
                  style={{
                    lineHeight: 24,
                    fontSize: 15,
                    color: "#333",
                    marginBottom: 20,
                  }}
                >
                  {feedback}
                </Text>

                <View
                  style={{
                    backgroundColor: "#f8f9fa",
                    padding: 16,
                    borderRadius: 12,
                    borderLeftWidth: 4,
                    borderLeftColor: "#ffa502",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#666",
                      lineHeight: 18,
                      fontWeight: "500",
                    }}
                  >
                    ⚠️ Disclaimer:{"\n"}
                    This analysis is based on visible movement and posture. Use
                    it as training guidance, not professional or medical advice.
                  </Text>
                </View>
              </View>
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
}

/* ---------- PERSPECTIVE BUTTON COMPONENT ---------- */

function PerspectiveButton({ title, isSelected, onPress, gradient }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={{ flex: 1 }}
    >
      {isSelected ? (
        <LinearGradient
          colors={gradient}
          style={{
            padding: 16,
            borderRadius: 16,
            alignItems: "center",
            shadowColor: gradient[0],
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 6,
            elevation: 5,
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontWeight: "700",
              fontSize: 15,
            }}
          >
            {title}
          </Text>
        </LinearGradient>
      ) : (
        <View
          style={{
            padding: 16,
            borderRadius: 16,
            alignItems: "center",
            backgroundColor: "#fff",
            borderWidth: 2,
            borderColor: "#e0e0e0",
          }}
        >
          <Text
            style={{
              color: "#666",
              fontWeight: "600",
              fontSize: 15,
            }}
          >
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}