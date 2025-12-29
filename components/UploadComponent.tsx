// import {View, Text, TouchableOpacity, Alert, Animated, StyleSheet} from "react-native";
// import * as ImagePicker from "expo-image-picker";
// import {useState} from "react";
// import {LinearGradient} from 'expo-linear-gradient';
// import {Ionicons} from "@expo/vector-icons";
// import {UploadLoadingComponent} from "./loading_screen";
// import React from "react";
// const BACKEND_URL = "http://192.168.1.7:5000";

// export default function UploadComponent({
//   video,
//   setVideo,
//   uploadedPath,
//   setUploadedPath,
//   fadeAnim,
//   slideAnim,
// }:any) {
//   const [loading, setLoading] = useState(false);

//   const pickVideo = async () => {
//     try {
//       const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
//       if (!permission.granted) {
//         Alert.alert("Permission Denied", "You need to grant media library permission");
//         return;
//       }

//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ["videos"],
//         quality: 0.5,
//       });

//       if (!result.canceled && result.assets.length > 0) {
//         const pickedVideo = result.assets[0];
//         console.log("Video Selected:", {
//           uri: pickedVideo.uri,
//           duration: pickedVideo.duration,
//           size: pickedVideo.fileSize,
//         });

//         setVideo({
//           uri: pickedVideo.uri,
//           name: `video-${Date.now()}.mp4`,
//           type: "video/mp4",
//           size: pickedVideo.fileSize,
//           duration: pickedVideo.duration,
//         });

//         setUploadedPath(null);
//       }
//     } catch (err) {
//       console.error("Error picking video:", err);
//       Alert.alert("Error", "Failed to pick video");
//     }
//   };

//   const uploadVideo = async () => {
//     if (!video) {
//       Alert.alert("No Video", "Please select a video first");
//       return;
//     }

//     if (video.size && video.size > 50 * 1024 * 1024) {
//       Alert.alert("File Too Large", "Video must be less than 50MB");
//       return;
//     }

//     setLoading(true);

//     try {
//       const formData = new FormData();
//       formData.append("video", {
//         uri: video.uri,
//         name: video.name,
//         type: video.type,
//       });

//       console.log("Starting upload...");

//       const res = await fetch(`${BACKEND_URL}/upload`, {
//         method: "POST",
//         body: formData,
//         timeout: 60000,
//       });

//       if (!res.ok) {
//         throw new Error(`HTTP Error: ${res.status}`);
//       }

//       const data = await res.json();
//       console.log("Upload successful:", data);

//       if (data.videoPath || data.videoUrl || data.congempath) {
//         setUploadedPath(data.videoPath || data.videoUrl || data.congempath);
//         Alert.alert("Success", "Video uploaded successfully!");
//       } else {
//         throw new Error("No video path returned from server");
//       }
//     } catch (err:any) {
//       console.error("Upload error:", err);
//       Alert.alert("Upload Failed", err.message || "Failed to upload video. Check your connection.");
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
//           onPress={pickVideo}
//           activeOpacity={0.85}
//           style={styles.actionButton}
//           disabled={loading}
//         >
//           <LinearGradient
//             colors={['#1a1a1a', '#2d2d2d']}
//             style={styles.buttonGradient}
//           >
//             <Ionicons name="videocam" size={20} color="#fff" style={{marginRight: 10}} />
//             <Text style={styles.buttonText}>Pick Video</Text>
//           </LinearGradient>
//         </TouchableOpacity>

//         {video && (
//           <>
//             <View style={styles.videoSelectedCard}>
//               <View style={styles.videoIconContainer}>
//                 <Ionicons name="checkmark" size={28} color="#fff" />
//               </View>
//               <View style={styles.videoTextContainer}>
//                 <Text style={styles.videoSelectedTitle}>Video Ready</Text>
//                 <Text style={styles.videoSelectedSubtitle}>
//                   {video.duration ? `${Math.round(video.duration / 1000)}s` : "Ready to upload"}
//                 </Text>
//               </View>
//             </View>

//             <TouchableOpacity
//               onPress={uploadVideo}
//               activeOpacity={0.85}
//               style={styles.actionButton}
//               disabled={loading}
//             >
//               <LinearGradient
//                 colors={loading ? ['#888', '#999'] : ['#8B45FF', '#A855F7']}
//                 style={styles.buttonGradient}
//               >
//                 <Ionicons name="cloud-upload" size={20} color="#fff" style={{marginRight: 10}} />
//                 <Text style={styles.buttonText}>
//                   {loading ? "Uploading..." : "Upload Video"}
//                 </Text>
//               </LinearGradient>
//             </TouchableOpacity>
//           </>
//         )}
//       </View>

//       {loading && <UploadLoadingComponent />}
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
//   videoSelectedCard: {
//     backgroundColor: "rgba(52, 199, 89, 0.15)",
//     padding: 18,
//     borderRadius: 16,
//     flexDirection: "row",
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: "rgba(52, 199, 89, 0.3)",
//   },
//   videoIconContainer: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     backgroundColor: "#34C759",
//     justifyContent: "center",
//     alignItems: "center",
//     marginRight: 14,
//   },
//   videoTextContainer: {
//     flex: 1,
//   },
//   videoSelectedTitle: {
//     fontWeight: "700",
//     fontSize: 16,
//     color: "#FFFFFF",
//     marginBottom: 2,
//   },
//   videoSelectedSubtitle: {
//     fontSize: 14,
//     color: "rgba(255, 255, 255, 0.7)",
//   },
// });