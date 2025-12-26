import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { useOnboarding } from "../../context/OnboardingContext";
import { useRouter } from "expo-router";
import { useState } from "react";
import { getSessions } from "../../utils/sessionStorage";
import { ScrollView } from "react-native";
import { useFocusEffect } from "expo-router";
import { Video } from "expo-av";
import { LinearGradient } from 'expo-linear-gradient';
import React from "react";

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
      {/* Gradient Header */}
      <LinearGradient
        colors={['#1a1a1a', '#2d2d2d']}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.greeting}>
          Welcome{profile.name ? `, ${profile.name}` : ""} 👋
        </Text>
        <Text style={styles.subtext}>
          Let's improve your boxing today.
        </Text>
      </LinearGradient>

      {/* Main CTA */}
      <TouchableOpacity
        style={styles.ctaContainer}
        onPress={() => router.push("/(tabs)/ai-check")}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={['#ff6b6b', '#ee5a6f']}
          style={styles.cta}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.ctaIcon}>
            <Text style={styles.ctaIconText}>🥊</Text>
          </View>
          <View style={styles.ctaContent}>
            <Text style={styles.ctaText}>Start AI Check</Text>
            <Text style={styles.ctaSub}>Upload a video and get feedback</Text>
          </View>
          <Text style={styles.ctaArrow}>→</Text>
        </LinearGradient>
      </TouchableOpacity>

      <View style={styles.motivationCard}>
        <Text style={styles.motivationText}>
          💪 Try to analyze at least one session every day
        </Text>
      </View>

      {/* Stats Section */}
      <Text style={styles.sectionTitle}>Your Progress</Text>

      <View style={styles.statsRow}>
        <StatCard 
          label="AI Checks" 
          value={sessions.length.toString()}
          icon="📊"
          gradient={['#667eea', '#764ba2']}
        />
        <StatCard 
          label="Sessions" 
          value={sessions.length.toString()}
          icon="🎯"
          gradient={['#f093fb', '#f5576c']}
        />
      </View>

      <View style={styles.statsRow}>
        <StatCard 
          label="Stance" 
          value={profile.stance || "—"}
          icon="🥋"
          gradient={['#4facfe', '#00f2fe']}
        />
        <StatCard 
          label="Level" 
          value={profile.experience || "—"}
          icon="⚡"
          gradient={['#43e97b', '#38f9d7']}
        />
      </View>

      {/* Footer note */}
      <View style={styles.footerNote}>
        <Text style={styles.footer}>🚀 More stats coming soon</Text>
      </View>

      {/* History Section */}
      <Text style={[styles.sectionTitle, { marginTop: 30 }]}>
        Previous AI Checks
      </Text>

      {sessions.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateIcon}>📹</Text>
          <Text style={styles.emptyStateText}>No previous AI checks yet</Text>
          <Text style={styles.emptyStateSubtext}>
            Upload your first boxing video to get started
          </Text>
        </View>
      )}

      {sessions.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.historyCard}
          onPress={() => {
            setSelectedSession(item);
            setModalVisible(true);
          }}
          activeOpacity={0.8}
        >
          {/* VIDEO PREVIEW */}
          {item.videoUri && (
            <View style={styles.videoContainer}>
              <Video
                source={{ uri: item.videoUri }}
                style={styles.video}
                resizeMode="cover"
                isMuted
                shouldPlay={false}
                useNativeControls={false}
              />
              <View style={styles.playOverlay}>
                <Text style={styles.playIcon}>▶️</Text>
              </View>
            </View>
          )}

          <View style={styles.historyContent}>
            <View style={styles.historyHeader}>
              <Text style={styles.historyTitle}>
                🥊 {item.perspective.toUpperCase()} boxer
              </Text>
              <View style={styles.historyBadge}>
                <Text style={styles.historyBadgeText}>Analyzed</Text>
              </View>
            </View>

            <Text style={styles.historyDate}>
              {new Date(item.createdAt).toLocaleString()}
            </Text>

            <Text numberOfLines={2} style={styles.historyText}>
              {item.feedback}
            </Text>
          </View>
        </TouchableOpacity>
      ))}

      {/* Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ScrollView
              contentContainerStyle={styles.modalContent}
              showsVerticalScrollIndicator={false}
            >
              {selectedSession && (
                <>
                  {/* VIDEO */}
                  {selectedSession.videoUri && (
                    <View style={styles.modalVideoContainer}>
                      <Video
                        source={{ uri: selectedSession.videoUri }}
                        style={styles.modalVideo}
                        resizeMode="contain"
                        useNativeControls
                      />
                    </View>
                  )}

                  <Text style={styles.modalTitle}>🥊 AI Feedback</Text>

                  <View style={styles.modalMetaContainer}>
                    <View style={styles.modalMetaItem}>
                      <Text style={styles.modalMetaLabel}>Boxer:</Text>
                      <Text style={styles.modalMetaValue}>
                        {selectedSession.perspective.toUpperCase()}
                      </Text>
                    </View>
                    <View style={styles.modalMetaItem}>
                      <Text style={styles.modalMetaLabel}>Date:</Text>
                      <Text style={styles.modalMetaValue}>
                        {new Date(selectedSession.createdAt).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.modalCard}>
                    <Text style={styles.modalCardTitle}>Analysis Results</Text>
                    <Text style={styles.modalCardText}>
                      {selectedSession.feedback}
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    style={styles.closeBtnContainer}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={['#1a1a1a', '#2d2d2d']}
                      style={styles.closeBtn}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <Text style={styles.closeBtnText}>Close</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

/* ---------- STAT CARD COMPONENT ---------- */

function StatCard({ label, value, icon, gradient }) {
  return (
    <View style={styles.cardWrapper}>
      <LinearGradient
        colors={gradient}
        style={styles.card}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.cardIcon}>{icon}</Text>
        <Text style={styles.cardValue}>{value}</Text>
        <Text style={styles.cardLabel}>{label}</Text>
      </LinearGradient>
    </View>
  );
}

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  headerGradient: {
    padding: 20,
    paddingTop: 80,
    paddingBottom: 30,
    marginBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: -0.5,
  },
  subtext: {
    color: "rgba(255,255,255,0.8)",
    marginTop: 6,
    fontSize: 15,
    fontWeight: "500",
  },
  ctaContainer: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 20,
    shadowColor: "#ff6b6b",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  cta: {
    padding: 20,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  ctaIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  ctaIconText: {
    fontSize: 24,
  },
  ctaContent: {
    flex: 1,
    marginLeft: 16,
  },
  ctaText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  ctaSub: {
    color: "rgba(255,255,255,0.9)",
    marginTop: 2,
    fontSize: 13,
  },
  ctaArrow: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  motivationCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#43e97b",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  motivationText: {
    color: "#333",
    fontSize: 14,
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
    marginHorizontal: 20,
    color: "#1a1a1a",
  },
  statsRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 12,
    gap: 12,
  },
  cardWrapper: {
    flex: 1,
  },
  card: {
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  cardIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 4,
  },
  cardLabel: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  footerNote: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  footer: {
    color: "#888",
    fontSize: 14,
    fontWeight: "500",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  emptyStateSubtext: {
    color: "#999",
    fontSize: 14,
    textAlign: "center",
  },
  historyCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  videoContainer: {
    position: "relative",
  },
  video: {
    width: "100%",
    height: 200,
    backgroundColor: "#000",
  },
  playOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  playIcon: {
    fontSize: 48,
  },
  historyContent: {
    padding: 16,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  historyTitle: {
    fontWeight: "700",
    fontSize: 16,
    color: "#1a1a1a",
  },
  historyBadge: {
    backgroundColor: "#43e97b",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  historyBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  historyDate: {
    fontSize: 12,
    color: "#999",
    marginBottom: 10,
    fontWeight: "500",
  },
  historyText: {
    color: "#555",
    lineHeight: 20,
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    maxHeight: "90%",
  },
  modalContent: {
    padding: 24,
    paddingBottom: 40,
  },
  modalVideoContainer: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 20,
    backgroundColor: "#000",
  },
  modalVideo: {
    width: "100%",
    height: 220,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 16,
    color: "#1a1a1a",
  },
  modalMetaContainer: {
    flexDirection: "row",
    gap: 20,
    marginBottom: 20,
  },
  modalMetaItem: {
    flex: 1,
  },
  modalMetaLabel: {
    fontSize: 12,
    color: "#999",
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  modalMetaValue: {
    fontSize: 15,
    color: "#1a1a1a",
    fontWeight: "700",
  },
  modalCard: {
    backgroundColor: "#f8f9fa",
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: "#ff6b6b",
  },
  modalCardTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  modalCardText: {
    lineHeight: 24,
    color: "#333",
    fontSize: 15,
  },
  closeBtnContainer: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  closeBtn: {
    padding: 18,
    alignItems: "center",
  },
  closeBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});