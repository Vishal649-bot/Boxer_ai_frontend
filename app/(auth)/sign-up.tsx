import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useOAuth, useSignUp } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import * as React from 'react';
import { ActivityIndicator, StyleSheet, TextInput, TouchableOpacity, View, Animated, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState('');
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

  // Handle Google OAuth sign-up
  const onGoogleSignUpPress = async () => {
    try {
      setIsGoogleLoading(true);
      const { createdSessionId, setActive: setActiveSession } = await startOAuthFlow();

      if (createdSessionId && setActiveSession) {
        await setActiveSession({ session: createdSessionId });
        router.replace('/onboarding/step1-name');
      }
    } catch (err: any) {
      console.error('OAuth error', err);
      alert(err.errors?.[0]?.message || 'An error occurred during Google sign up');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Handle the submission of the sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return;

    try {
      setIsEmailLoading(true);
      await signUp.create({
        emailAddress,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setPendingVerification(true);
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      alert(err.errors?.[0]?.message || 'An error occurred during sign up');
    } finally {
      setIsEmailLoading(false);
    }
  };

  // Handle the submission of the verification form
  const onPressVerify = async () => {
    if (!isLoaded) return;

    try {
      setIsEmailLoading(true);
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === 'complete' && setActive) {
        await setActive({ session: completeSignUp.createdSessionId });
        router.replace('/onboarding/step1-name');
      } else {
        console.error(JSON.stringify(completeSignUp, null, 2));
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      alert(err.errors?.[0]?.message || 'An error occurred during verification');
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
          {!pendingVerification && (
            <Animated.View style={[styles.headerSection, { transform: [{ translateY: slideAnim }] }]}>
              <LinearGradient
                colors={['#FF3B30', '#FF6B6B', '#FF9500']}
                style={styles.logoContainer}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <ThemedText style={styles.appIcon}>🥊</ThemedText>
              </LinearGradient>
              
              <ThemedText style={styles.appName}>BOXER AI</ThemedText>
              <ThemedText style={styles.tagline}>Start Your Training Journey</ThemedText>
            </Animated.View>
          )}

          {/* Sign Up / Verification Content */}
          <Animated.View 
            style={[
              styles.contentSection, 
              { 
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            {!pendingVerification ? (
              // Sign Up Form
              <View style={styles.formContainer}>
                <ThemedText style={styles.formTitle}>Create Account</ThemedText>
                <ThemedText style={styles.formSubtitle}>
                  Join the next generation of boxing training
                </ThemedText>

                {/* Google Sign Up Button */}
                <TouchableOpacity 
                  onPress={onGoogleSignUpPress} 
                  style={styles.googleButton}
                  disabled={isGoogleLoading || !isLoaded}
                  activeOpacity={0.8}
                >
                  {isGoogleLoading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <>
                      <ThemedText style={styles.googleIcon}>G</ThemedText>
                      <ThemedText style={styles.googleButtonText}>
                        Sign up with Google
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

                {/* Sign Up Button */}
                <LinearGradient
                  colors={['#FF3B30', '#FF6B6B']}
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <TouchableOpacity 
                    onPress={onSignUpPress} 
                    style={styles.button}
                    disabled={isEmailLoading}
                    activeOpacity={0.8}
                  >
                    {isEmailLoading ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <ThemedText style={styles.buttonText}>Create Account</ThemedText>
                    )}
                  </TouchableOpacity>
                </LinearGradient>

                {/* Sign In Link */}
                <View style={styles.signInContainer}>
                  <ThemedText style={styles.signInText}>Already have an account? </ThemedText>
                  <Link href="/(auth)/sign-in">
                    <ThemedText style={styles.signInLink}>Sign in</ThemedText>
                  </Link>
                </View>
              </View>
            ) : (
              // Verification Form
              <View style={styles.formContainer}>
                <View style={styles.verificationHeader}>
                  <ThemedText style={styles.verificationIcon}>✉️</ThemedText>
                </View>

                <ThemedText style={styles.formTitle}>Verify Your Email</ThemedText>
                <ThemedText style={styles.formSubtitle}>
                  We've sent a verification code to {emailAddress}
                </ThemedText>

                {/* Verification Code Input */}
                <View style={styles.inputWrapper}>
                  <ThemedText style={styles.inputLabel}>Verification Code</ThemedText>
                  <TextInput
                    value={code}
                    placeholder="000000"
                    placeholderTextColor="rgba(255, 255, 255, 0.4)"
                    onChangeText={(code) => setCode(code)}
                    style={[styles.input, styles.codeInput]}
                    keyboardType="number-pad"
                    editable={!isEmailLoading}
                  />
                </View>

                <ThemedText style={styles.codeHint}>
                  Check your email for the code (also check spam folder)
                </ThemedText>

                {/* Verify Button */}
                <LinearGradient
                  colors={['#FF3B30', '#FF6B6B']}
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <TouchableOpacity 
                    onPress={onPressVerify} 
                    style={styles.button}
                    disabled={isEmailLoading}
                    activeOpacity={0.8}
                  >
                    {isEmailLoading ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <ThemedText style={styles.buttonText}>Verify Email</ThemedText>
                    )}
                  </TouchableOpacity>
                </LinearGradient>

                {/* Back to Sign Up */}
                <TouchableOpacity 
                  onPress={() => setPendingVerification(false)}
                  style={styles.backButton}
                >
                  <ThemedText style={styles.backButtonText}>← Change Email</ThemedText>
                </TouchableOpacity>
              </View>
            )}
          </Animated.View>
        </Animated.ScrollView>
      </LinearGradient>
    </SafeAreaView>
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
    textAlign: 'center',
  },
  formSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 24,
    fontWeight: '500',
    textAlign: 'center',
  },
  verificationHeader: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 59, 48, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.3)',
  },
  verificationIcon: {
    fontSize: 32,
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
  codeInput: {
    textAlign: 'center',
    fontSize: 18,
    letterSpacing: 4,
    fontWeight: '700',
  },
  codeHint: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    marginBottom: 20,
    fontWeight: '500',
    textAlign: 'center',
  },
  buttonGradient: {
    borderRadius: 16,
    marginTop: 8,
    marginBottom: 16,
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
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  signInText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    fontWeight: '500',
  },
  signInLink: {
    color: '#FF3B30',
    fontWeight: '800',
    fontSize: 14,
  },
  backButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  backButtonText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
    fontWeight: '600',
  },
});