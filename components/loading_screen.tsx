import {View, Text, Animated, StyleSheet, Modal} from "react-native";
import {useEffect, useRef} from "react";
import {MaterialCommunityIcons, Ionicons} from "@expo/vector-icons";
import {LinearGradient} from 'expo-linear-gradient';
import React from "react";
import { Easing } from 'react-native';
/* ---------- UPLOAD LOADING MODAL ---------- */

export function UploadLoadingModal({visible}:any) {
  const uploadAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(uploadAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(uploadAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [visible]);

  const uploadProgress = uploadAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.modalOverlay}>
        <Animated.View 
          style={[
            styles.modalContent,
            {opacity: fadeAnim}
          ]}
        >
          {/* Icon */}
          <Animated.View style={{transform: [{scale: pulseAnim}]}}>
            <LinearGradient
              colors={['#8B45FF', '#A855F7']}
              style={styles.modalIcon}
            >
              <Ionicons name="cloud-upload" size={32} color="#fff" />
            </LinearGradient>
          </Animated.View>

          {/* Title */}
          <Text style={styles.modalTitle}>Uploading Video</Text>
          <Text style={styles.modalSubtitle}>Please wait...</Text>

          {/* Progress Bar */}
{/* Circular Loader */}
<Animated.View
  style={[
    styles.circularLoader,
    {
      transform: [{
        rotate: uploadAnim.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '360deg'],
        })
      }]
    }
  ]}
/>


          {/* Steps */}
          <View style={styles.stepsContainer}>
            <StepIndicator 
              icon="compress" 
              text="Processing" 
              status="active" 
            />
            <View style={styles.stepDivider} />
            <StepIndicator 
              icon="cloud-upload" 
              text="Uploading" 
              status="inactive" 
            />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

/* ---------- ANALYSIS LOADING MODAL ---------- */

export function AnalysisLoadingModal({visible}:any) {
  const spinAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;


useEffect(() => {
  if (visible) {
    fadeAnim.setValue(0);
    spinAnim.setValue(0);

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 900,          // spinner speed
        easing: Easing.linear,  // IMPORTANT for real spinner feel
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.timing(waveAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      })
    ).start();
  }
}, [visible]);
  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const waveScale = waveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.4],
  });

  const waveOpacity = waveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 0],
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.modalOverlay}>
        <Animated.View 
          style={[
            styles.modalContent,
            {opacity: fadeAnim}
          ]}
        >
          {/* Animated Waves Background */}
          <Animated.View 
            style={[
              styles.waveBackground,
              {
                transform: [{scale: waveScale}],
                opacity: waveOpacity,
              }
            ]}
          />

          {/* Brain Icon */}
          <Animated.View 
            style={[
              styles.modalIconContainer,
              {
                transform: [{rotate: spin}, {scale: pulseAnim}],
              }
            ]}
          >
            <LinearGradient
              colors={['#FF3B30', '#FF6B6B']}
              style={styles.modalIcon}
            >
              <MaterialCommunityIcons name="robot" size={32} color="#fff" />
            </LinearGradient>
          </Animated.View>

          {/* Title */}
          <Text style={styles.modalTitle}>Analyzing Technique</Text>
          <Text style={styles.modalSubtitle}>
            AI is processing your boxing form...
          </Text>

          {/* Analysis Steps */}
          <View style={styles.analysisStepsContainer}>
            <AnalysisStep 
              icon="human-greeting" 
              text="Detecting stance" 
            />
            <AnalysisStep 
              icon="hand-fist" 
              text="Analyzing punches" 
            />
            <AnalysisStep 
              icon="chart-line" 
              text="Generating feedback" 
            />
          </View>

          {/* Loading Bar */}
{/* Circular Loader */}
<Animated.View
  style={[
    styles.circularLoader,
    {
      borderTopColor: '#FF3B30',
      transform: [{ rotate: spin }]
    }
  ]}
/>

        </Animated.View>
      </View>
    </Modal>
  );
}

/* ---------- HELPER COMPONENTS ---------- */

function StepIndicator({icon, text, status}:any) {
  return (
    <View style={styles.stepContainer}>
      <View style={[
        styles.stepIcon,
        {
          backgroundColor: status === 'active' 
            ? 'rgba(139, 69, 255, 0.2)' 
            : 'rgba(255, 255, 255, 0.08)',
        }
      ]}>
        <Ionicons 
          name={icon} 
          size={16} 
          color={status === 'active' ? '#8B45FF' : 'rgba(255, 255, 255, 0.4)'}
        />
      </View>
      <Text style={[
        styles.stepText,
        {color: status === 'active' ? '#fff' : 'rgba(255, 255, 255, 0.5)'}
      ]}>
        {text}
      </Text>
    </View>
  );
}

function AnalysisStep({icon, text}:any) {
  return (
    <View style={styles.analysisStepContainer}>
      <View style={styles.analysisStepIcon}>
        <MaterialCommunityIcons 
          name={icon} 
          size={16} 
          color="rgba(255, 255, 255, 0.6)"
        />
      </View>
      <Text style={styles.analysisStepText}>{text}</Text>
    </View>
  );
}

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    borderRadius: 24,
    padding: 32,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 20},
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 24,
  },

  /* Icon Styles */
  modalIconContainer: {
    marginBottom: 20,
  },
  modalIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8B45FF',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },

  /* Text Styles */
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 6,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    marginBottom: 24,
  },

  /* Progress Bar (Upload) */
  progressBarContainer: {
    width: '100%',
    marginBottom: 24,
  },
  progressBarBackground: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#8B45FF',
    borderRadius: 2,
  },

  /* Steps (Upload) */
  stepsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
    gap: 16,
  },
  stepContainer: {
    alignItems: 'center',
    gap: 8,
  },
  stepIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  stepText: {
    fontSize: 11,
    fontWeight: '600',
  },
  stepDivider: {
    width: 24,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },

  /* Analysis Steps */
  waveBackground: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 59, 48, 0.15)',
    top: 32,
  },
  analysisStepsContainer: {
    width: '100%',
    marginBottom: 20,
    gap: 10,
  },
  analysisStepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  analysisStepIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  analysisStepText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
    flex: 1,
  },

  /* Loading Bar (Analysis) */
  loadingBar: {
    width: '100%',
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  loadingBarFill: {
    height: '100%',
    backgroundColor: '#FF3B30',
    borderRadius: 2,
  },
  circularLoader: {
  width: 36,
  height: 36,
  borderRadius: 18,
  borderWidth: 3,
  borderColor: 'rgba(255,255,255,0.15)',
  borderTopColor: '#8B45FF',
  marginBottom: 24,
},

});