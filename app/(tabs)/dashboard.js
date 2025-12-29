import { View, Text, StyleSheet, TouchableOpacity, Modal, Animated } from "react-native";
import { useOnboarding } from "../../context/OnboardingContext";
import { useRouter } from "expo-router";
import { useState, useEffect, useRef } from "react";
import { getSessions } from "../../utils/sessionStorage";
import { ScrollView } from "react-native";
import { useFocusEffect } from "expo-router";
import { Video } from "expo-av";
import { LinearGradient } from 'expo-linear-gradient';
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// Color Scheme
const COLORS = {
  red: { main: '#FF3B30', light: 'rgba(255, 59, 48, 0.15)', border: 'rgba(255, 59, 48, 0.3)', gradient: ['#FF3B30', '#FF6B6B'] },
  yellow: { main: '#FFD60A', light: 'rgba(255, 195, 0, 0.15)', border: 'rgba(255, 195, 0, 0.3)', gradient: ['#FFD60A', '#FFC300'] },
  blue: { main: '#007AFF', light: 'rgba(0, 122, 255, 0.15)', border: 'rgba(0, 122, 255, 0.3)', gradient: ['#007AFF', '#0096FF'] },
  green: { main: '#34C759', light: 'rgba(52, 199, 89, 0.15)', border: 'rgba(52, 199, 89, 0.3)', gradient: ['#34C759', '#4CD964'] },
  purple: { main: '#8B45FF', light: 'rgba(139, 69, 255, 0.15)', border: 'rgba(139, 69, 255, 0.3)', gradient: ['#8B45FF', '#A855F7'] },
};

export default function Dashboard() {
  const { profile } = useOnboarding();
  const router = useRouter();

  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const statsScale = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(statsScale, {
        toValue: 1,
        tension: 50,
        friction: 7,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

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
    <SafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />
      <View style={styles.bgCircle3} />

      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Animated Header */}
        <Animated.View 
          style={[
            styles.headerContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <LinearGradient
            colors={['rgba(255, 59, 48, 0.1)', 'rgba(139, 69, 255, 0.1)']}
            style={styles.headerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.headerContent}>
              <View>
                <Text style={styles.greeting}>
                  Hey{profile.name ? `, ${profile.name}` : ""} 👋
                </Text>
                <Text style={styles.subtext}>
                  Ready to train harder today?
                </Text>
              </View>
              <View style={[styles.headerIcon, { backgroundColor: COLORS.red.light }]}>
                <MaterialCommunityIcons name="boxing-glove" size={28} color={COLORS.red.main} />
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Main CTA with Pulse Animation */}
        <Animated.View 
          style={[
            styles.ctaWrapper,
            { 
              transform: [{ scale: pulseAnim }],
              opacity: fadeAnim,
            }
          ]}
        >
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/ai-check")}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={COLORS.red.gradient}
              style={styles.cta}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.ctaIconContainer}>
                <View style={styles.ctaIcon}>
                  <MaterialCommunityIcons name="robot-happy" size={26} color="#fff" />
                </View>
              </View>
              <View style={styles.ctaContent}>
                <Text style={styles.ctaText}>Start AI Analysis</Text>
                <Text style={styles.ctaSub}>Upload video • Get instant feedback</Text>
              </View>
              <View style={styles.ctaArrowContainer}>
                <MaterialCommunityIcons name="arrow-right" size={20} color="#fff" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Motivation Card */}
        <Animated.View 
          style={[
            styles.motivationCard,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <LinearGradient
            colors={COLORS.green.gradient}
            style={[styles.motivationGradient, { borderColor: COLORS.green.border }]}
          >
            <MaterialCommunityIcons name="lightning-bolt" size={24} color="#fff" style={{ marginRight: 12 }} />
            <Text style={styles.motivationText}>
              Train daily for maximum improvement
            </Text>
          </LinearGradient>
        </Animated.View>

        {/* Stats Section */}
        <Animated.View 
          style={[
            { opacity: fadeAnim, transform: [{ scale: statsScale }] }
          ]}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Stats</Text>
            <View style={[styles.sectionBadge, { backgroundColor: COLORS.red.light, borderColor: COLORS.red.border }]}>
              <Text style={[styles.sectionBadgeText, { color: COLORS.red.main }]}>LIVE</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <StatCard 
              label="AI Checks" 
              value={sessions.length.toString()}
              icon="chart-box"
              gradient={COLORS.red.gradient}
              iconColor={COLORS.red.main}
              bgColor={COLORS.red.light}
            />
            <StatCard 
              label="Sessions" 
              value={sessions.length.toString()}
              icon="target"
              gradient={COLORS.yellow.gradient}
              iconColor={COLORS.yellow.main}
              bgColor={COLORS.yellow.light}
            />
          </View>

          <View style={styles.statsRow}>
            <StatCard 
              label="Stance" 
              value={profile.stance || "—"}
              icon="shield-half-full"
              gradient={COLORS.blue.gradient}
              iconColor={COLORS.blue.main}
              bgColor={COLORS.blue.light}
            />
            <StatCard 
              label="Level" 
              value={profile.experience || "—"}
              icon="lightning-bolt"
              gradient={COLORS.green.gradient}
              iconColor={COLORS.green.main}
              bgColor={COLORS.green.light}
            />
          </View>
        </Animated.View>

        {/* History Section */}
        <View style={styles.historySection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Sessions</Text>
            {sessions.length > 0 && (
              <Text style={styles.sectionCount}>{sessions.length}</Text>
            )}
          </View>

          {sessions.length === 0 && (
            <View style={styles.emptyState}>
              <View style={[styles.emptyStateIconContainer, { backgroundColor: COLORS.purple.light }]}>
                <MaterialCommunityIcons name="video" size={40} color={COLORS.purple.main} />
              </View>
              <Text style={styles.emptyStateText}>No Sessions Yet</Text>
              <Text style={styles.emptyStateSubtext}>
                Upload your first boxing video to start tracking progress
              </Text>
              <TouchableOpacity
                style={styles.emptyStateButton}
                onPress={() => router.push("/(tabs)/ai-check")}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={COLORS.purple.gradient}
                  style={styles.emptyStateButtonGradient}
                >
                  <Text style={styles.emptyStateButtonText}>Get Started</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}

          {sessions.map((item, index) => (
            <Animated.View
              key={item.id}
              style={[
                {
                  opacity: fadeAnim,
                  transform: [{
                    translateY: Animated.multiply(slideAnim, new Animated.Value(1 + index * 0.1))
                  }]
                }
              ]}
            >
              <TouchableOpacity
                style={styles.historyCard}
                onPress={() => {
                  setSelectedSession(item);
                  setModalVisible(true);
                }}
                activeOpacity={0.9}
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
                    <LinearGradient
                      colors={['transparent', 'rgba(0,0,0,0.7)']}
                      style={styles.videoGradient}
                    >
                      <View style={styles.playButton}>
                        <MaterialCommunityIcons name="play" size={20} color="#000" />
                      </View>
                    </LinearGradient>
                  </View>
                )}

                <LinearGradient
                  colors={['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.02)']}
                  style={styles.historyContent}
                >
                  <View style={styles.historyHeader}>
                    <View style={styles.historyTitleContainer}>
                      <MaterialCommunityIcons name="boxing-glove" size={20} color={COLORS.red.main} />
                      <Text style={styles.historyTitle}>
                        {item.perspective.toUpperCase()} Boxer
                      </Text>
                    </View>
                    <View style={[styles.historyBadge, { backgroundColor: COLORS.green.light, borderColor: COLORS.green.border }]}>
                      <MaterialCommunityIcons name="check-circle" size={12} color={COLORS.green.main} />
                      <Text style={[styles.historyBadgeText, { color: COLORS.green.main }]}> Analyzed</Text>
                    </View>
                  </View>

                  <Text style={styles.historyDate}>
                    {new Date(item.createdAt).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Text>

                  <Text numberOfLines={2} style={styles.historyText}>
                    {item.feedback}
                  </Text>

                  <View style={styles.historyFooter}>
                    <Text style={styles.historyFooterText}>Tap to view details</Text>
                    <MaterialCommunityIcons name="arrow-right" size={16} color="rgba(255, 255, 255, 0.5)" />
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        <View style={styles.bottomSpacer} />

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
                    {/* Modal Header */}
                    <View style={styles.modalHeader}>
                      <View style={styles.modalDragHandle} />
                      <Text style={styles.modalHeaderTitle}>Session Details</Text>
                    </View>

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

                    {/* Meta Info */}
                    <View style={styles.modalMetaContainer}>
                      <LinearGradient
                        colors={COLORS.red.gradient}
                        style={[styles.modalMetaCard, { borderColor: COLORS.red.border }]}
                      >
                        <MaterialCommunityIcons name="boxing-glove" size={28} color="#fff" />
                        <View>
                          <Text style={styles.modalMetaLabel}>Position</Text>
                          <Text style={styles.modalMetaValue}>
                            {selectedSession.perspective.toUpperCase()}
                          </Text>
                        </View>
                      </LinearGradient>
                      
                      <LinearGradient
                        colors={COLORS.purple.gradient}
                        style={[styles.modalMetaCard, { borderColor: COLORS.purple.border }]}
                      >
                        <MaterialCommunityIcons name="calendar" size={28} color="#fff" />
                        <View>
                          <Text style={styles.modalMetaLabel}>Date</Text>
                          <Text style={styles.modalMetaValue}>
                            {new Date(selectedSession.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </Text>
                        </View>
                      </LinearGradient>
                    </View>

                    {/* Feedback Card */}
                    <View style={styles.modalFeedbackCard}>
                      <LinearGradient
                        colors={COLORS.green.gradient}
                        style={styles.modalFeedbackHeader}
                      >
                        <MaterialCommunityIcons name="robot-happy" size={24} color="#fff" />
                        <Text style={styles.modalFeedbackTitle}>AI Analysis</Text>
                      </LinearGradient>

                      <View style={styles.modalFeedbackContent}>
                        <Text style={styles.modalFeedbackText}>
                          {selectedSession.feedback}
                        </Text>
                      </View>
                    </View>

                    {/* Close Button */}
                    <TouchableOpacity
                      onPress={() => setModalVisible(false)}
                      activeOpacity={0.8}
                    >
                      <LinearGradient
                        colors={['#1a1a1a', '#2d2d2d']}
                        style={styles.closeBtn}
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
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------- STAT CARD COMPONENT ---------- */

function StatCard({ label, value, icon, gradient, iconColor, bgColor }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View 
      style={[styles.cardWrapper, { transform: [{ scale: scaleAnim }] }]}
      onTouchStart={handlePressIn}
      onTouchEnd={handlePressOut}
    >
      <LinearGradient
        colors={gradient}
        style={styles.card}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={[styles.cardIconContainer, { backgroundColor: bgColor }]}>
          <MaterialCommunityIcons name={icon} size={32} color="#fff" />
        </View>
        <Text style={styles.cardValue}>{value}</Text>
        <Text style={styles.cardLabel}>{label}</Text>
      </LinearGradient>
    </Animated.View>
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
    width: 350,
    height: 350,
    borderRadius: 175,
    backgroundColor: "rgba(139, 69, 255, 0.12)",
    top: "30%",
    left: -120,
  },
  bgCircle3: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(255, 149, 0, 0.1)",
    bottom: 100,
    right: -80,
  },
  container: {
    flex: 1,
  },
  headerContainer: {
    marginBottom: 24,
  },
  headerGradient: {
    padding: 24,
    paddingTop: 20,
    paddingBottom: 24,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: {
    fontSize: 28,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subtext: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 15,
    fontWeight: "600",
  },
  headerIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  ctaWrapper: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  cta: {
    padding: 20,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#FF3B30",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  ctaIconContainer: {
    marginRight: 16,
  },
  ctaIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  ctaContent: {
    flex: 1,
  },
  ctaText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 4,
  },
  ctaSub: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 13,
    fontWeight: "500",
  },
  ctaArrowContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  motivationGradient: {
    padding: 16,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
  },
  motivationCard: {
    marginHorizontal: 20,
    marginBottom: 32,
  },
  motivationText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    flex: 1,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    marginHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#FFFFFF",
  },
  sectionBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  sectionBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },
  sectionCount: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 16,
    fontWeight: "700",
  },
  statsRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 16,
  },
  cardWrapper: {
    flex: 1,
  },
  card: {
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  cardIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  cardValue: {
    fontSize: 18,
    fontWeight: "900",
    color: "#FFFFFF",
    marginBottom: 6,
  },
  cardLabel: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  historySection: {
    marginTop: 32,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 48,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  emptyStateIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyStateText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 8,
  },
  emptyStateSubtext: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  emptyStateButton: {
    width: "100%",
  },
  emptyStateButtonGradient: {
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  emptyStateButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  historyCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  videoContainer: {
    position: "relative",
    height: 200,
  },
  video: {
    width: "100%",
    height: "100%",
    backgroundColor: "#000",
  },
  videoGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 20,
  },
  playButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  historyContent: {
    padding: 20,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  historyTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  historyTitle: {
    fontWeight: "800",
    fontSize: 16,
    color: "#FFFFFF",
  },
  historyBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  historyBadgeText: {
    fontSize: 10,
    fontWeight: "800",
  },
  historyDate: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.5)",
    marginBottom: 12,
    fontWeight: "600",
  },
  historyText: {
    color: "rgba(255, 255, 255, 0.8)",
    lineHeight: 22,
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 12,
  },
  historyFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  historyFooterText: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 12,
    fontWeight: "600",
  },
  bottomSpacer: {
    height: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#1a1a1a",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    maxHeight: "90%",
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  modalContent: {
    padding: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  modalDragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    marginBottom: 16,
  },
  modalHeaderTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  modalVideoContainer: {
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 24,
    backgroundColor: "#000",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  modalVideo: {
    width: "100%",
    height: 220,
  },
  modalMetaContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  modalMetaCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    gap: 12,
    borderWidth: 1,
  },
  modalMetaLabel: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.7)",
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  modalMetaValue: {
    fontSize: 15,
    color: "#FFFFFF",
    fontWeight: "800",
  },
  modalFeedbackCard: {
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 20,
  },
  modalFeedbackHeader: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  modalFeedbackTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  modalFeedbackIcon: {
    fontSize: 24,
  },
  modalFeedbackContent: {
    padding: 20,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  modalFeedbackText: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 14,
    lineHeight: 22,
    fontWeight: "500",
  },
  closeBtn: {
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  closeBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
});