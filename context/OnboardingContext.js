import { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const OnboardingContext = createContext();

export function OnboardingProvider({ children }) {
  const [profile, setProfile] = useState({
    name: "",
    experience: "",
    goal: "",
    stance: "",
  });

  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);

  // Load saved onboarding
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedProfile = await AsyncStorage.getItem("onboardingProfile");
        const done = await AsyncStorage.getItem("onboardingCompleted");

        if (savedProfile) {
          setProfile(JSON.parse(savedProfile));
        }

        if (done === "true") {
          setCompleted(true);
        }
      } catch (e) {
        console.log("Error loading onboarding data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Save profile to storage
  const updateProfile = async (newData) => {
    const updated = { ...profile, ...newData };
    setProfile(updated);
    await AsyncStorage.setItem(
      "onboardingProfile",
      JSON.stringify(updated)
    );
  };

  // Mark onboarding complete
  const finishOnboarding = async () => {
    setCompleted(true);
    await AsyncStorage.setItem("onboardingCompleted", "true");
  };

  return (
    <OnboardingContext.Provider
      value={{
        profile,
        updateProfile,
        completed,
        finishOnboarding,
        loading,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  // console.log('OnboardingContext value:', context); // Debugging log
  return context;
}
