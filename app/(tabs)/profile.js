import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Animated } from "react-native";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useOnboarding } from "../../context/OnboardingContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function Profile() {
  const { signOut } = useAuth();
  const { user, isLoaded } = useUser();
  const { profile } = useOnboarding();
  const router = useRouter();
  const [userLoaded, setUserLoaded] = useState(false);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const avatarPulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isLoaded) {
      setUserLoaded(true);
    }
  }, [isLoaded, user]);

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
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(avatarPulse, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(avatarPulse, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const resetOnboarding = async () => {
    Alert.alert(
      "Reset Onboarding?",
      "You will need to answer onboarding questions again.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem("onboardingCompleted");
            router.replace("/onboarding/step1-name");
          },
        },
      ]
    );
  };

  const getDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user?.firstName) {
      return user.firstName;
    }
    return profile?.name || 'Fighter';
  };

  const getPrimaryEmail = () => {
    if (user?.primaryEmailAddress?.emailAddress) {
      return user.primaryEmailAddress.emailAddress;
    }
    if (user?.emailAddresses && user.emailAddresses.length > 0) {
      return user.emailAddresses[0].emailAddress;
    }
    return 'No email';
  };

  const getPhone = () => {
    if (user?.phoneNumbers && user.phoneNumbers.length > 0) {
      return user.phoneNumbers[0].phoneNumber;
    }
    return 'Not set';
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    try {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  if (!isLoaded || !userLoaded) {
    return (
      <SafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />
      <View style={styles.bgCircle3} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <Animated.View 
          style={[
            styles.headerSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <LinearGradient
            colors={['rgba(255, 59, 48, 0.15)', 'rgba(139, 69, 255, 0.15)', 'transparent']}
            style={styles.headerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          />

          <Animated.View 
            style={[
              styles.avatarContainer,
              { transform: [{ scale: avatarPulse }] }
            ]}
          >
            <LinearGradient
              colors={['#FF3B30', '#FF6B6B', '#FF9500']}
              style={styles.avatarGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.avatarInner}>
                <Text style={styles.avatarText}>
                  {getDisplayName().charAt(0).toUpperCase()}
                </Text>
              </View>
            </LinearGradient>
          </Animated.View>

          <Text style={styles.title}>{getDisplayName()}</Text>
          <Text style={styles.subtitle}>{getPrimaryEmail()}</Text>

          <View style={styles.profileBadge}>
            <MaterialCommunityIcons name="lightning-bolt" size={12} color="#FF3B30" />
            <Text style={styles.profileBadgeText}>ACTIVE FIGHTER</Text>
          </View>
        </Animated.View>

        {/* Stats Cards Grid */}
        <Animated.View 
          style={[
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          <View style={styles.cardsContainer}>
            <InfoCard 
              icon="dumbbell"
              label="Experience" 
              value={profile?.experience || 'N/A'} 
              gradient={['#FF3B30', '#FF6B6B']}
              colors={{ bg: 'rgba(255, 59, 48, 0.15)', border: 'rgba(255, 59, 48, 0.3)' }}
            />
            <InfoCard 
              icon="target"
              label="Goal" 
              value={profile?.goal || 'N/A'} 
              gradient={['#FFD60A', '#FFC300']}
              colors={{ bg: 'rgba(255, 195, 0, 0.15)', border: 'rgba(255, 195, 0, 0.3)' }}
            />
          </View>

          <View style={styles.cardsContainer}>
            <InfoCard 
              icon="shield-half-full"
              label="Stance" 
              value={profile?.stance || 'N/A'} 
              gradient={['#007AFF', '#0096FF']}
              colors={{ bg: 'rgba(0, 122, 255, 0.15)', border: 'rgba(0, 122, 255, 0.3)' }}
            />
            <InfoCard 
              icon="check-circle"
              label="Status" 
              value="Active" 
              gradient={['#34C759', '#4CD964']}
              colors={{ bg: 'rgba(52, 199, 89, 0.15)', border: 'rgba(52, 199, 89, 0.3)' }}
            />
          </View>
        </Animated.View>

        {/* Clerk User Details Section */}
        <Animated.View 
          style={[
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.detailsCard}>
            <View style={styles.detailsHeader}>
              <Text style={styles.detailsTitle}>Account Details</Text>
              <View style={styles.detailsBadge}>
                <MaterialCommunityIcons name="account" size={18} color="#FF3B30" />
              </View>
            </View>
            
            <ProfileRow 
              label="Full Name" 
              value={getDisplayName()} 
              icon="account"
              iconColor="#FF3B30"
            />
            <View style={styles.divider} />
            <ProfileRow 
              label="Email" 
              value={getPrimaryEmail()} 
              icon="email"
              iconColor="#FFD60A"
            />
            <View style={styles.divider} />
            <ProfileRow 
              label="Phone" 
              value={getPhone()} 
              icon="phone"
              iconColor="#007AFF"
            />
            <View style={styles.divider} />
            <ProfileRow 
              label="Member Since" 
              value={formatDate(user?.createdAt)} 
              icon="calendar"
              iconColor="#34C759"
            />
            <View style={styles.divider} />
            <ProfileRow 
              label="Last Sign In" 
              value={formatDate(user?.lastSignInAt)} 
              icon="clock"
              iconColor="#FF3B30"
            />
          </View>
        </Animated.View>

        {/* Fighter Profile Details Section */}
        {profile && (
          <Animated.View 
            style={[
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <View style={styles.detailsCard}>
              <View style={styles.detailsHeader}>
                <Text style={styles.detailsTitle}>Fighter Profile</Text>
                <View style={styles.detailsBadge}>
                  <MaterialCommunityIcons name="martial-arts" size={18} color="#FF3B30" />
                </View>
              </View>
              
              <ProfileRow label="Name" value={profile.name} icon="tag" iconColor="#FFD60A" />
              <View style={styles.divider} />
              <ProfileRow label="Experience" value={profile.experience} icon="chart-line" iconColor="#007AFF" />
              <View style={styles.divider} />
              <ProfileRow label="Goal" value={profile.goal} icon="target" iconColor="#34C759" />
              <View style={styles.divider} />
              <ProfileRow label="Stance" value={profile.stance} icon="shield-half-full" iconColor="#FF3B30" />
            </View>
          </Animated.View>
        )}

        {/* Actions */}
        <Animated.View 
          style={[
            styles.actions,
            { opacity: fadeAnim }
          ]}
        >
          <ActionButton
            text="Reset Onboarding"
            icon="refresh"
            type="secondary"
            onPress={resetOnboarding}
          />
          <ActionButton
            text="Logout"
            icon="logout"
            type="danger"
            onPress={async () => {
              await signOut();
              router.replace("/(auth)/sign-in");
            }}
          />
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------- INFO CARD COMPONENT ---------- */

function InfoCard({ icon, label, value, gradient, colors }) {
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
      style={[styles.infoCardWrapper, { transform: [{ scale: scaleAnim }] }]}
      onTouchStart={handlePressIn}
      onTouchEnd={handlePressOut}
    >
      <LinearGradient
        colors={gradient}
        style={styles.infoCard}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={[styles.infoIconContainer, { backgroundColor: colors.bg, borderColor: colors.border }]}>
          <MaterialCommunityIcons name={icon} size={28} color="#FFFFFF" />
        </View>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value || '—'}</Text>
      </LinearGradient>
    </Animated.View>
  );
}

/* ---------- PROFILE ROW COMPONENT ---------- */

function ProfileRow({ label, value, icon, iconColor }) {
  return (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <View style={styles.rowIconContainer}>
          <MaterialCommunityIcons name={icon} size={18} color={iconColor} />
        </View>
        <Text style={styles.label}>{label}</Text>
      </View>
      <Text style={[styles.value, styles.valueText]} numberOfLines={2}>{value || "—"}</Text>
    </View>
  );
}

/* ---------- ACTION BUTTON COMPONENT ---------- */

function ActionButton({ text, onPress, type, icon }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
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
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        {type === "danger" ? (
          <LinearGradient
            colors={['#FF3B30', '#FF6B6B']}
            style={styles.button}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <MaterialCommunityIcons name={icon} size={20} color="#fff" />
            <Text style={[styles.buttonText, { color: '#fff' }]}>{text}</Text>
          </LinearGradient>
        ) : (
          <View style={[styles.button, styles.secondaryButton]}>
            <MaterialCommunityIcons name={icon} size={20} color="#FFFFFF" />
            <Text style={styles.buttonText}>{text}</Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
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
    top: "40%",
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  headerSection: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 32,
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 300,
  },
  avatarContainer: {
    marginBottom: 20,
  },
  avatarGradient: {
    width: 130,
    height: 130,
    borderRadius: 65,
    padding: 5,
    shadowColor: "#FF3B30",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 15,
  },
  avatarInner: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 52,
    fontWeight: '900',
    color: '#FF3B30',
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    textAlign: 'center',
    color: '#FFFFFF',
    letterSpacing: -1,
    marginBottom: 8,
  },
  subtitle: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '600',
  },
  profileBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 59, 48, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.3)',
  },
  profileBadgeText: {
    color: '#FF3B30',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  cardsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 16,
  },
  infoCardWrapper: {
    flex: 1,
  },
  infoCard: {
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  infoIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '700',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  infoValue: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '800',
  },
  detailsCard: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 24,
    padding: 24,
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  detailsTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  detailsBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 59, 48, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.3)',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  rowIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.7)",
    fontWeight: '600',
  },
  value: {
    fontSize: 15,
    fontWeight: "800",
    color: '#FFFFFF',
  },
  valueText: {
    maxWidth: '50%',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  actions: {
    paddingHorizontal: 20,
    gap: 16,
  },
  button: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: 'center',
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  secondaryButton: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "800",
    color: '#FFFFFF',
  },
});