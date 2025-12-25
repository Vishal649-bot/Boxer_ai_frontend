import { View, Text, Button, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { saveSession } from "../../utils/sessionStorage";
import { ScrollView } from "react-native";

import * as FileSystem from "expo-file-system/legacy";



const BACKEND_URL = "http://192.168.1.6:5000";

export default function AICheck() {
  const [video, setVideo] = useState(null);
  const [uploadedPath, setUploadedPath] = useState(null); // 🔑
  const [perspective, setPerspective] = useState(null);

  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);

  // 📌 Pick video
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

    // 🔥 COPY VIDEO TO APP STORAGE
    const newVideoPath =
      FileSystem.documentDirectory + `boxing-${Date.now()}.mp4`;

    await FileSystem.copyAsync({
      from: pickedVideo.uri,
      to: newVideoPath,
    });

    setVideo({
      ...pickedVideo,
      persistedUri: newVideoPath, // ✅ SAFE URI
    });

    setUploadedPath(null);
    setPerspective(null);
     
    }


    setUploadedPath(null);
     setFeedback(null);
    setPerspective(null);
    
  };

  // 📤 UPLOAD FUNCTION
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

      // 🔑 store the path/filename returned by backend
      setUploadedPath(data.congempath || data.videoPath || data.videoUrl);

      Alert.alert("Uploaded", "Video uploaded successfully");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Upload failed");
    }
  };

  // 🤖 ANALYZE FUNCTION (SEND PATH ONLY)
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

      // 🔥 SHOW CURRENT SESSION
      setFeedback(data.feedback);

      // 🔥 SAVE TO HISTORY
      const session = {
        id: Date.now(),
        videoUri: video.persistedUri,
        feedback: data.feedback,
        perspective,
        createdAt: new Date().toISOString(),
      };

      await saveSession(session);
      Alert.alert("AI Feedback", ...data.feedback);
    } catch (err) {
      // Alert.alert("Errorrrr", err.message || "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 40,
      }}
    >
      <Text style={{ fontSize: 18, marginBottom: 20 }}>AI Boxing Check</Text>

      <View
        style={{
          backgroundColor: "#f5f5f5",
          padding: 12,
          borderRadius: 8,
          marginBottom: 15,
          width: "100%",
          maxWidth: 500,
        }}
      >
        <Text style={{ fontSize: 13, color: "#555", lineHeight: 18 }}>
          <Text style={{ fontWeight: "bold" }}>How it works{"\n"}</Text>
          Upload a short boxing video (10–20 seconds).{"\n"}
          If more than one boxer is visible, select which one is you.
        </Text>
      </View>

      <View style={{ flexDirection: "row", marginBottom: 10 }}>
        <Button title="Left" onPress={() => setPerspective("left")} />
        <View style={{ width: 10 }} />
        <Button title="Right" onPress={() => setPerspective("right")} />
        <View style={{ width: 10 }} />
        <Button title="Alone" onPress={() => setPerspective("alone")} />
      </View>

      {perspective && (
        <Text style={{ marginBottom: 15 }}>
          Selected: {perspective.toUpperCase()}
        </Text>
      )}

      <Button title="Pick Boxing Video" onPress={pickVideo} />

      {video && (
        <>
          <Text style={{ marginVertical: 10 }}>Video selected ✔</Text>

          <Button title="Upload" onPress={uploadVideo} />

          {uploadedPath && (
            <View style={{ marginTop: 10 }}>
              <Button title="Analyze" onPress={analyzeVideo} />
            </View>
          )}

          {loading && <Text style={{ marginTop: 20 }}>Analyzing… 🧠</Text>}

          {feedback && (
            <View
              style={{
                marginTop: 20,
                padding: 16,
                backgroundColor: "#f4f4f4",
                borderRadius: 10,
                width: "100%",
                maxWidth: 500,
                alignSelf: "center",
              }}
            >
              <Text
                style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}
              >
                🥊 Current AI Feedback
              </Text>

              <Text style={{ lineHeight: 22 }}>{feedback}</Text>

              <Text
                style={{
                  fontSize: 12,
                  color: "#777",
                  borderTopWidth: 1,
                  borderTopColor: "#ddd",
                  paddingTop: 8,
                }}
              >
                About this feedback{"\n"}
                This analysis is based on visible movement and posture. Use it
                as training guidance, not professional or medical advice.
              </Text>
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
}
