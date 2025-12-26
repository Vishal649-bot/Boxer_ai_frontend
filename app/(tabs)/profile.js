import { View, Text, StyleSheet, TouchableOpacity, Alert,ScrollView } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useOnboarding } from "../../context/OnboardingContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';

export default function Profile() {
  const { user, logout } = useAuth();
  const { profile } = useOnboarding();
  const router = useRouter();

  const resetOnboarding = async () => {
    Alert.alert(
      "Reset onboarding?",
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

  return (
     <ScrollView
    style={{ flex: 1 }}
    contentContainerStyle={{ paddingBottom: 40 }}
    showsVerticalScrollIndicator={false}
  >
    <View style={styles.container}>
      {/* Gradient Header Background */}
      <LinearGradient
        colors={['#1a1a1a', '#2d2d2d', '#f8f9fa']}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />

      {/* Profile Avatar Circle */}
      <View style={styles.avatarContainer}>
        <LinearGradient
          colors={['#ff6b6b', '#ee5a6f', '#c44569']}
          style={styles.avatarGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.avatarInner}>
            <Text style={styles.avatarText}>
              {profile.name ? profile.name.charAt(0).toUpperCase() : '👤'}
            </Text>
          </View>
        </LinearGradient>
      </View>

      {/* Header */}
      <Text style={styles.title}>{profile.name || 'Boxer'}</Text>
      <Text style={styles.subtitle}>{user?.email}</Text>

      {/* Info Cards Grid */}
      <View style={styles.cardsContainer}>
        <InfoCard 
          icon="🥊" 
          label="Experience" 
          value={profile.experience} 
          gradient={['#667eea', '#764ba2']}
        />
        <InfoCard 
          icon="🎯" 
          label="Goal" 
          value={profile.goal} 
          gradient={['#f093fb', '#f5576c']}
        />
      </View>

      <View style={styles.cardsContainer}>
        <InfoCard 
          icon="🥋" 
          label="Stance" 
          value={profile.stance} 
          gradient={['#4facfe', '#00f2fe']}
        />
        <InfoCard 
          icon="⚡" 
          label="Status" 
          value="Active" 
          gradient={['#43e97b', '#38f9d7']}
        />
      </View>

      {/* Detailed Info Section */}
      <View style={styles.detailsCard}>
        <Text style={styles.detailsTitle}>Profile Details</Text>
        <ProfileRow label="Full Name" value={profile.name} icon="👤" />
        <View style={styles.divider} />
        <ProfileRow label="Experience Level" value={profile.experience} icon="📊" />
        <View style={styles.divider} />
        <ProfileRow label="Training Goal" value={profile.goal} icon="🎯" />
        <View style={styles.divider} />
        <ProfileRow label="Fighting Stance" value={profile.stance} icon="🥊" />
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <ActionButton
          text="Reset Onboarding"
          icon="🔄"
          type="secondary"
          onPress={resetOnboarding}
        />
        <ActionButton
          text="Logout"
          icon="🚪"
          type="danger"
          onPress={async () => {
            await logout();
            router.replace("/(auth)/login");
          }}
        />
      </View>
    </View>
    </ScrollView>
  );
}

/* ---------- SMALL REUSABLE PARTS ---------- */

function InfoCard({ icon, label, value, gradient }) {
  return (
    <View style={styles.infoCardWrapper}>
      <LinearGradient
        colors={gradient}
        style={styles.infoCard}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.infoIcon}>{icon}</Text>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value || '—'}</Text>
      </LinearGradient>
    </View>
  );
}

function ProfileRow({ label, value, icon }) {
  return (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <Text style={styles.rowIcon}>{icon}</Text>
        <Text style={styles.label}>{label}</Text>
      </View>
      <Text style={styles.value}>{value || "—"}</Text>
    </View>
  );
}

function ActionButton({ text, onPress, type, icon }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        type === "danger" && styles.dangerButton,
        type === "secondary" && styles.secondaryButton,
      ]}
      activeOpacity={0.8}
    >
      <Text style={styles.buttonIcon}>{icon}</Text>
      <Text
        style={[
          styles.buttonText,
          type === "danger" && { color: "#fff" },
        ]}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
}

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 280,
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: 80,
    marginBottom: 16,
  },
  avatarGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    padding: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  avatarInner: {
    width: '100%',
    height: '100%',
    borderRadius: 56,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    textAlign: 'center',
    color: '#1a1a1a',
    letterSpacing: -0.5,
  },
  subtitle: {
    color: "#666",
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '500',
  },
  cardsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 12,
    gap: 12,
  },
  infoCardWrapper: {
    flex: 1,
  },
  infoCard: {
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  infoIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '700',
  },
  detailsCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  detailsTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    color: '#1a1a1a',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowIcon: {
    fontSize: 20,
  },
  label: {
    fontSize: 15,
    color: "#666",
    fontWeight: '500',
  },
  value: {
    fontSize: 15,
    fontWeight: "700",
    color: '#1a1a1a',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
  },
  actions: {
    paddingHorizontal: 20,
    gap: 12,
    paddingBottom: 40,
  },
  button: {
    flexDirection: 'row',
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: 'center',
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  secondaryButton: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  dangerButton: {
    backgroundColor: "#ff4757",
  },
  buttonIcon: {
    fontSize: 18,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "700",
    color: '#1a1a1a',
  },
});