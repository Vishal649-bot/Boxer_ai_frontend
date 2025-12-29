// import {View, Text, TouchableOpacity, Alert, Animated, StyleSheet} from "react-native";
// import {useState} from "react";
// import {LinearGradient} from 'expo-linear-gradient';
// import {MaterialCommunityIcons, Ionicons} from "@expo/vector-icons";
// import {saveSession} from "../utils/sessionStorage";
// import {AnalysisLoadingComponent} from "./loading_screen";
// import React from "react";

// const BACKEND_URL = "http://192.168.1.7:5000";

// export default function AnalyseComponent({
//   uploadedPath,
//   perspective,
//   video,
//   setFeedback,
//   fadeAnim,
//   slideAnim,
// }:any) {
//   const [loading, setLoading] = useState(false);

//   const analyzeVideo = async () => {
//     if (!uploadedPath) {
//       Alert.alert("Upload First", "Please upload video before analysis");
//       return;
//     }

//     if (!perspective) {
//       Alert.alert("Select Position", "Please choose Left, Right, or Alone");
//       return;
//     }

//     setLoading(true);

//     try {
//       const res = await fetch(`${BACKEND_URL}/analyze`, {
//         method: "POST",
//         headers: {"Content-Type": "application/json"},
//         body: JSON.stringify({
//           path: uploadedPath,
//           perspective,
//         }),
//       });

//       const data = await res.json();

//       if (!res.ok || !data.success) {
//         throw new Error(data.message || "Analysis failed");
//       }

//       setFeedback(data.feedback);

//       const session = {
//         id: Date.now(),
//         videoUri: video.uri,
//         feedback: data.feedback,
//         perspective,
//         createdAt: new Date().toISOString(),
//       };

//       await saveSession(session);
//       Alert.alert("Analysis Complete", data.feedback);
//     } catch (err:any) {
//       console.error("Analysis error:", err);
//       Alert.alert("Error", err.message || "Analysis failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Animated.View
//       style={[
//         {
//           opacity: fadeAnim,
//           transform: [{translateY: slideAnim}],
//         },
//       ]}
//     >
//       <View style={styles.actionsContainer}>
//         <TouchableOpacity
//           onPress={analyzeVideo}
//           activeOpacity={0.85}
//           style={styles.actionButton}
//           disabled={loading}
//         >
//           <LinearGradient
//             colors={loading ? ['#888', '#999'] : ['#FF3B30', '#FF6B6B']}
//             style={styles.buttonGradient}
//           >
//             <MaterialCommunityIcons name="robot" size={20} color="#fff" style={{marginRight: 10}} />
//             <Text style={styles.buttonText}>
//               {loading ? "Analyzing..." : "Analyze Technique"}
//             </Text>
//           </LinearGradient>
//         </TouchableOpacity>
//       </View>

//       {loading && <AnalysisLoadingComponent />}
//     </Animated.View>
//   );
// }

// const styles = StyleSheet.create({
//   actionsContainer: {
//     gap: 16,
//   },
//   actionButton: {
//     marginBottom: 0,
//   },
//   buttonGradient: {
//     padding: 20,
//     borderRadius: 16,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     shadowColor: "#000",
//     shadowOffset: {width: 0, height: 6},
//     shadowOpacity: 0.3,
//     shadowRadius: 10,
//     elevation: 8,
//   },
//   buttonText: {
//     color: "#FFFFFF",
//     fontSize: 17,
//     fontWeight: "700",
//   },
// });