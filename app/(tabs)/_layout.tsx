import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, StyleSheet, Platform } from "react-native";
// import { BlurView } from 'expo-blur';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#FF3B30",
        tabBarInactiveTintColor: "rgba(255, 255, 255, 0.5)",
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: Platform.OS === 'ios' ? 'rgba(26, 26, 26, 0.8)' : '#1a1a1a',
          borderTopWidth: 0,
          elevation: 0,
          height: 88,
          paddingBottom: 28,
          paddingTop: 8,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.3,
          shadowRadius: 16,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          letterSpacing: 0.5,
          textTransform: 'uppercase',
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Progress",
          tabBarIcon: ({ color, size, focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
              <Ionicons 
                name={focused ? "stats-chart" : "stats-chart-outline"} 
                size={focused ? 26 : 24} 
                color={color} 
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="ai-check"
        options={{
          title: "Analyze",
          tabBarIcon: ({ color, size, focused }) => (
            <View style={[styles.iconContainer, styles.centerIcon, focused && styles.centerIconActive]}>
              <Ionicons 
                name={focused ? "camera" : "camera-outline"} 
                size={focused ? 28 : 26} 
                color="#FFFFFF" 
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size, focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
              <Ionicons 
                name={focused ? "person" : "person-outline"} 
                size={focused ? 26 : 24} 
                color={color} 
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  iconContainerActive: {
    backgroundColor: 'rgba(255, 59, 48, 0.15)',
  },
  centerIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FF3B30',
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 10,
    marginTop: -20,
  },
  centerIconActive: {
    backgroundColor: '#FF6B6B',
    transform: [{ scale: 1.05 }],
  },
});