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
    // Entrance animations
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

    // Pulse animation for CTA button
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
      {/* Animated Background Elements */}
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
              <View style={styles.headerIcon}>
                <Text style={styles.headerIconText}>🥊</Text>
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
              colors={['#FF3B30', '#FF6B6B']}
              style={styles.cta}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.ctaIconContainer}>
                <View style={styles.ctaIcon}>
                  <Text style={styles.ctaIconText}>🤖</Text>
                </View>
              </View>
              <View style={styles.ctaContent}>
                <Text style={styles.ctaText}>Start AI Analysis</Text>
                <Text style={styles.ctaSub}>Upload video • Get instant feedback</Text>
              </View>
              <View style={styles.ctaArrowContainer}>
                <Text style={styles.ctaArrow}>→</Text>
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
            colors={['rgba(52, 199, 89, 0.15)', 'rgba(48, 209, 88, 0.15)']}
            style={styles.motivationGradient}
          >
            <Text style={styles.motivationIcon}>💪</Text>
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
            <View style={styles.sectionBadge}>
              <Text style={styles.sectionBadgeText}>LIVE</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <StatCard 
              label="AI Checks" 
              value={sessions.length.toString()}
              icon="📊"
              gradient={['#FF3B30', '#FF6B6B']}
            />
            <StatCard 
              label="Sessions" 
              value={sessions.length.toString()}
              icon="🎯"
              gradient={['#FF9500', '#FFAA00']}
            />
          </View>

          <View style={styles.statsRow}>
            <StatCard 
              label="Stance" 
              value={profile.stance || "—"}
              icon="🥋"
              gradient={['#007AFF', '#0096FF']}
            />
            <StatCard 
              label="Level" 
              value={profile.experience || "—"}
              icon="⚡"
              gradient={['#34C759', '#4CD964']}
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
              <View style={styles.emptyStateIconContainer}>
                <Text style={styles.emptyStateIcon}>📹</Text>
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
                  colors={['#8B45FF', '#A855F7']}
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
                        <Text style={styles.playIcon}>▶</Text>
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
                      <Text style={styles.historyEmoji}>🥊</Text>
                      <Text style={styles.historyTitle}>
                        {item.perspective.toUpperCase()} Boxer
                      </Text>
                    </View>
                    <View style={styles.historyBadge}>
                      <Text style={styles.historyBadgeText}>✓ Analyzed</Text>
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
                    <Text style={styles.historyArrow}>→</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        {/* Bottom Spacer */}
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
                        colors={['rgba(255, 59, 48, 0.15)', 'rgba(255, 107, 107, 0.15)']}
                        style={styles.modalMetaCard}
                      >
                        <Text style={styles.modalMetaIcon}>🥊</Text>
                        <View>
                          <Text style={styles.modalMetaLabel}>Position</Text>
                          <Text style={styles.modalMetaValue}>
                            {selectedSession.perspective.toUpperCase()}
                          </Text>
                        </View>
                      </LinearGradient>
                      
                      <LinearGradient
                        colors={['rgba(139, 69, 255, 0.15)', 'rgba(168, 85, 247, 0.15)']}
                        style={styles.modalMetaCard}
                      >
                        <Text style={styles.modalMetaIcon}>📅</Text>
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
                        colors={['#34C759', '#4CD964']}
                        style={styles.modalFeedbackHeader}
                      >
                        <Text style={styles.modalFeedbackIcon}>🤖</Text>
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

function StatCard({ label, value, icon, gradient }) {
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
        <Text style={styles.cardIcon}>{icon}</Text>
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
    backgroundColor: "rgba(255, 59, 48, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerIconText: {
    fontSize: 26,
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
  ctaIconText: {
    fontSize: 26,
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
  ctaArrow: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  motivationCard: {
    marginHorizontal: 20,
    marginBottom: 32,
  },
  motivationGradient: {
    padding: 16,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(52, 199, 89, 0.3)",
  },
  motivationIcon: {
    fontSize: 24,
    marginRight: 12,
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
    backgroundColor: "rgba(255, 59, 48, 0.2)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 59, 48, 0.3)",
  },
  sectionBadgeText: {
    color: "#FF3B30",
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
  cardIcon: {
    fontSize: 36,
    marginBottom: 12,
  },
  cardValue: {
    fontSize: 28,
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
    backgroundColor: "rgba(139, 69, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyStateIcon: {
    fontSize: 40,
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
  playIcon: {
    fontSize: 20,
    marginLeft: 4,
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
  },
  historyEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  historyTitle: {
    fontWeight: "800",
    fontSize: 16,
    color: "#FFFFFF",
  },
  historyBadge: {
    backgroundColor: "rgba(52, 199, 89, 0.2)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(52, 199, 89, 0.3)",
  },
  historyBadgeText: {
    color: "#34C759",
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
  historyArrow: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 16,
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
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  modalMetaIcon: {
    fontSize: 28,
  },
  modalMetaLabel: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.6)",
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  modalMetaValue: {
    fontSize: 15,
  }
,  })