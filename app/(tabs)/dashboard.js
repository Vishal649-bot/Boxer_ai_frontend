import { View, Text, StyleSheet, TouchableOpacity,Modal } from "react-native";
import { useOnboarding } from "../../context/OnboardingContext";
import { useRouter } from "expo-router";
import {  useState } from "react";
import { getSessions } from "../../utils/sessionStorage";
import { ScrollView } from "react-native";
import { useFocusEffect } from "expo-router";
import { Video } from "expo-av";



export default function Dashboard() {
  const { profile } = useOnboarding();
  const router = useRouter();

  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
const [modalVisible, setModalVisible] = useState(false);

useFocusEffect(
  React.useCallback(() => {
    const load = async () => {
      const data = await getSessions();
      setSessions(data);
    };

    load();
  }, [])
);



  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <Text style={styles.greeting}>
        Welcome{profile.name ? `, ${profile.name}` : ""} 👋
      </Text>
      <Text style={styles.subtext}>
        Let’s improve your boxing today.
      </Text>
      

      {/* Main CTA */}
      <TouchableOpacity
        style={styles.cta}
        onPress={() => router.push("/(tabs)/ai-check")}
      >
        <Text style={styles.ctaText}>🥊 Start AI Check</Text>
        <Text style={styles.ctaSub}>
          Upload a video and get feedback
        </Text>
      </TouchableOpacity>

      <Text style={{ color: "#444", marginBottom: 10 }}>
  Try to analyze at least one session EveryDay  🥊
</Text>

      {/* Stats Section */}
      <Text style={styles.sectionTitle}>Your Progress</Text>

      <View style={styles.statsRow}>
        <StatCard label="AI Checks" 
        value={sessions.length.toString()}
        />
        <StatCard label="Sessions" 
        value={sessions.length.toString()}
        />
      </View>

      <View style={styles.statsRow}>
        <StatCard label="Stance" value={profile.stance || "—"} />
        <StatCard label="Level" value={profile.experience || "—"} />
      </View>

      {/* Footer note */}
      <Text style={styles.footer}>
        More stats coming soon 🚀
      </Text>

      {/* History Section */}
<Text style={[styles.sectionTitle, { marginTop: 30 }]}>
  Previous AI Checks
</Text>

{sessions.length === 0 && (
  <Text style={{ color: "#666", marginBottom: 20 }}>
    No previous AI checks yet
  </Text>
)}

{sessions.map((item) => (
  <TouchableOpacity
    key={item.id}
    style={styles.historyCard}
    onPress={() => {
      setSelectedSession(item);
      setModalVisible(true);
    }}
  >
    {/* 🎥 VIDEO PREVIEW */}
    {item.videoUri && (
      <Video
        source={{ uri: item.videoUri }}
        style={styles.video}
        resizeMode="cover"
        isMuted
        shouldPlay={false}
        useNativeControls={false}
      />
    )}

    <Text style={styles.historyTitle}>
      🥊 {item.perspective.toUpperCase()} boxer
    </Text>

    <Text style={styles.historyDate}>
      {new Date(item.createdAt).toLocaleString()}
    </Text>

    <Text numberOfLines={2} style={styles.historyText}>
      {item.feedback}
    </Text>
  </TouchableOpacity>
))}


<Modal
  visible={modalVisible}
  animationType="slide"
  transparent={true}
  onRequestClose={() => setModalVisible(false)}
>
  <View style={styles.modalOverlay}>
    <ScrollView
    contentContainerStyle={styles.modalContent}
    showsVerticalScrollIndicator={false}
  >
      {selectedSession && (
        <>

        {/* 🎥 VIDEO GOES HERE (TOP) */}
          {selectedSession.videoUri && (
            <Video
              source={{ uri: selectedSession.videoUri }}
              style={{
                width: "100%",
                height: 220,
                borderRadius: 10,
                marginBottom: 12,
                backgroundColor: "#000",
              }}
              resizeMode="contain"
              useNativeControls
            />
          )}
          <Text style={styles.modalTitle}>🥊 AI Feedback</Text>

          <Text style={styles.modalMeta}>
            Boxer: {selectedSession.perspective.toUpperCase()}
          </Text>

          <Text style={styles.modalMeta}>
            Date: {new Date(selectedSession.createdAt).toLocaleString()}
          </Text>

          <View style={styles.modalCard}>
            <Text style={{ lineHeight: 22 }}>
              {selectedSession.feedback}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={styles.closeBtn}
          >
            <Text style={{ color: "#fff" }}>Close</Text>
          </TouchableOpacity>
        </>
      )}
    
  </ScrollView>
  </View>
</Modal>


     </ScrollView>
  );
}

/* ---------- SMALL COMPONENT ---------- */

function StatCard({ label, value }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardValue}>{value}</Text>
      <Text style={styles.cardLabel}>{label}</Text>
    </View>
  );
}

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 100,
    backgroundColor: "#fff",
  },
  greeting: {
    fontSize: 26,
    fontWeight: "bold",
  },
  subtext: {
    color: "#666",
    marginBottom: 20,
  },
  cta: {
    backgroundColor: "#000",
    padding: 18,
    borderRadius: 12,
    marginBottom: 30,
  },
  ctaText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  ctaSub: {
    color: "#ccc",
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#f2f2f2",
    width: "48%",
    padding: 16,
    borderRadius: 10,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: "bold",
  },
  cardLabel: {
    color: "#666",
    marginTop: 4,
  },
  footer: {
    marginTop: 20,
    color: "#888",
    textAlign: "center",
  },
  historyCard: {
  backgroundColor: "#f4f4f4",
  padding: 14,
  borderRadius: 10,
  marginBottom: 12,
},
historyTitle: {
  fontWeight: "600",
  marginBottom: 4,
},
historyDate: {
  fontSize: 12,
  color: "#666",
  marginBottom: 6,
},
historyText: {
  color: "#333",
},
modalOverlay: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.5)",
  justifyContent: "center",
  padding: 20,
},
modalContent: {
  backgroundColor: "#fff",
  borderRadius: 12,
  padding: 20,
  paddingBottom: 40, // 🔑 allows scrolling past Close button
},

modalTitle: {
  fontSize: 20,
  fontWeight: "bold",
  marginBottom: 10,
},
modalMeta: {
  color: "#666",
  marginBottom: 6,
},
modalCard: {
  backgroundColor: "#f4f4f4",
  padding: 14,
  borderRadius: 10,
  marginTop: 10,
  marginBottom: 20,
},
closeBtn: {
  backgroundColor: "#000",
  padding: 12,
  borderRadius: 8,
  alignItems: "center",
},
video: {
  width: "100%",
  height: 180,
  borderRadius: 8,
  marginBottom: 8,
  backgroundColor: "#000",
},

});
