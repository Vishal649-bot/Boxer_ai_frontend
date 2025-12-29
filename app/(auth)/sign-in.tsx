import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useOAuth, useSignIn } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import * as React from 'react';
import { ActivityIndicator, StyleSheet, TextInput, TouchableOpacity, View, Animated, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, AntDesign, Ionicons } from '@expo/vector-icons';

export default function SignInScreen() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);
  const [isEmailLoading, setIsEmailLoading] = React.useState(false);
  
  // Animation refs
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Handle Google OAuth sign-in
  const onGoogleSignInPress = async () => {
    try {
      setIsGoogleLoading(true);
      const { createdSessionId, setActive: setActiveSession } = await startOAuthFlow();

      if (createdSessionId && setActiveSession) {
        await setActiveSession({ session: createdSessionId });
        router.replace('/onboarding/step1-name');
      }
    } catch (err: any) {
      console.error('OAuth error', err);
      alert(err.errors?.[0]?.message || 'An error occurred during Google sign in');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    if (!isLoaded) return;

    try {
      setIsEmailLoading(true);
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === 'complete' && setActive) {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace('/onboarding/step1-name');
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      alert(err.errors?.[0]?.message || 'An error occurred during sign in');
    } finally {
      setIsEmailLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#0a0a0a', '#1a1a2e', '#16213e']}
        style={styles.container}
      >
        {/* Background Elements */}
        <View style={styles.bgCircle1} />
        <View style={styles.bgCircle2} />

        <Animated.ScrollView 
          style={{ opacity: fadeAnim }}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <Animated.View style={[styles.headerSection, { transform: [{ translateY: slideAnim }] }]}>
            <LinearGradient
              colors={['#FF3B30', '#FF6B6B', '#FF9500']}
              style={styles.logoContainer}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
<MaterialCommunityIcons name="boxing-glove" size={52} color="#fff" />
            </LinearGradient>
            
            <ThemedText style={styles.appName}>BOXER AI</ThemedText>
            <ThemedText style={styles.tagline}>Your Personal Boxing Coach</ThemedText>
          </Animated.View>

          {/* Sign In Content */}
          <Animated.View 
            style={[
              styles.contentSection, 
              { 
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <View style={styles.formContainer}>
              <ThemedText style={styles.formTitle}>Sign In</ThemedText>
              <ThemedText style={styles.formSubtitle}>
                Get back to your training
              </ThemedText>

              {/* Google Sign In Button */}
              <TouchableOpacity 
                onPress={onGoogleSignInPress} 
                style={styles.googleButton}
                disabled={isGoogleLoading || !isLoaded}
                activeOpacity={0.8}
              >
                {isGoogleLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <>
<AntDesign name="google" size={20} color="#fff" />
                    <ThemedText style={styles.googleButtonText}>
                      Continue with Google
                    </ThemedText>
                  </>
                )}
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <ThemedText style={styles.dividerText}>OR</ThemedText>
                <View style={styles.dividerLine} />
              </View>

              {/* Email Input */}
              <View style={styles.inputWrapper}>
                <ThemedText style={styles.inputLabel}>Email</ThemedText>
                <TextInput
                  autoCapitalize="none"
                  value={emailAddress}
                  placeholder="you@example.com"
                  placeholderTextColor="rgba(255, 255, 255, 0.4)"
                  onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
                  style={styles.input}
                  editable={!isEmailLoading}
                />
              </View>

              {/* Password Input */}
              <View style={styles.inputWrapper}>
                <ThemedText style={styles.inputLabel}>Password</ThemedText>
                <TextInput
                  value={password}
                  placeholder="••••••••"
                  placeholderTextColor="rgba(255, 255, 255, 0.4)"
                  secureTextEntry={true}
                  onChangeText={(password) => setPassword(password)}
                  style={styles.input}
                  editable={!isEmailLoading}
                />
              </View>

              {/* Sign In Button */}
              <LinearGradient
                colors={['#FF3B30', '#FF6B6B']}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <TouchableOpacity 
                  onPress={onSignInPress} 
                  style={styles.button}
                  disabled={isEmailLoading}
                  activeOpacity={0.8}
                >
                  {isEmailLoading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <ThemedText style={styles.buttonText}>Continue with Email</ThemedText>
                  )}
                </TouchableOpacity>
              </LinearGradient>

              {/* Sign Up Link */}
              <View style={styles.signUpContainer}>
                <ThemedText style={styles.signUpText}>Don't have an account? </ThemedText>
                <Link href="/(auth)/sign-up">
                  <ThemedText style={styles.signUpLink}>Create one</ThemedText>
                </Link>
              </View>
            </View>

            {/* Features Section */}
            <View style={styles.featuresSection}>
<FeatureItem
  icon={<MaterialCommunityIcons name="target" size={22} color="#FF3B30" />}
  title="AI-Powered"
  subtitle="Personalized training"
/>

<FeatureItem
  icon={<Ionicons name="stats-chart" size={22} color="#FF3B30" />}
  title="Track Progress"
  subtitle="Monitor improvements"
/>

<FeatureItem
  icon={<Ionicons name="flash" size={22} color="#FF3B30" />}
  title="Real-time Feedback"
  subtitle="Instant coaching"
/>
            </View>
          </Animated.View>
        </Animated.ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

function FeatureItem({ icon, title, subtitle }:any) {
  return (
    <View style={styles.featureItem}>
      <View style={styles.featureIconContainer}>
        {icon}
      </View>
      <View style={styles.featureContent}>
        <ThemedText style={styles.featureTitle}>{title}</ThemedText>
        <ThemedText style={styles.featureSubtitle}>{subtitle}</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  container: {
    flex: 1,
  },
  bgCircle1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(255, 59, 48, 0.12)',
    top: -100,
    right: -50,
  },
  bgCircle2: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(139, 69, 255, 0.08)',
    bottom: 100,
    left: -80,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  headerSection: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 50,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
  },
  appIcon: {
    fontSize: 50,
  },
  appName: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 2,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  contentSection: {
    flex: 1,
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 30,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  formSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 24,
    fontWeight: '500',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4285F4',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    gap: 12,
    shadowColor: '#4285F4',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  googleIcon: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  googleButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  dividerText: {
    marginHorizontal: 16,
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 12,
    fontWeight: '600',
  },
  inputWrapper: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 14,
    padding: 14,
    fontSize: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    color: '#FFFFFF',
    fontWeight: '500',
  },
  buttonGradient: {
    borderRadius: 16,
    marginTop: 8,
    overflow: 'hidden',
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    flexWrap: 'wrap',
  },
  signUpText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    fontWeight: '500',
  },
  signUpLink: {
    color: '#FF3B30',
    fontWeight: '800',
    fontSize: 14,
  },
  featuresSection: {
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  featureIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 59, 48, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.2)',
  },
  featureIcon: {
    fontSize: 22,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  featureSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '500',
  },
});