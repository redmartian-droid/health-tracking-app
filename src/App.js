import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase/config";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";

// Native components (ensure each component is converted to RN)
import Navigation from "./components/Navbar";
import BottomNavigation from "./components/BottomNavbar";
import Dashboard from "./components/Dashboard";
import HeartRatePage from "./components/HeartRatePage";
import StepsPage from "./components/StepsPage";
import MedicinePage from "./components/MedicinePage";
import MilestonesPage from "./components/MilestonesPage";
import RewardsPage from "./components/RewardPage";

// HealthDataContext moved to src/context
import { HealthDataProvider, useHealthData } from "./context/HealthDataContext";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <SafeAreaView style={{ flex: 1 }}>
          <StatusBar barStyle="dark-content" />
          <AuthWrapper />
        </SafeAreaView>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

function AuthWrapper() {
  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    return (
      <View style={styles.container}>
        {/* ActivityIndicator is the standard loading spinner in React Native */}
        <ActivityIndicator size="large" color="#22c55e" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    console.error("Authentication error:", error);
    return (
      <View style={styles.container}>
        <Text style={styles.errorTitle}>Authentication Error</Text>
        <Text style={styles.errorText}>{error.message}</Text>
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <Stack.Screen name="HealthTracker">
          {() => (
            <HealthDataProvider>
              <HealthTracker />
            </HealthDataProvider>
          )}
        </Stack.Screen>
      ) : (
        <Stack.Screen name="Auth" component={AuthRoutes} />
      )}
    </Stack.Navigator>
  );
}

function AuthRoutes() {
  return (
    <Stack.Navigator
      initialRouteName="SignIn"
      screenOptions={{
        headerStyle: { backgroundColor: "#111827" },
        headerTintColor: "#fff",
      }}
    >
      <Stack.Screen name="SignIn" component={SignIn} options={{ title: "Sign In" }} />
      <Stack.Screen name="SignUp" component={SignUp} options={{ title: "Sign Up" }} />
    </Stack.Navigator>
  );
}

function HealthTracker() {
  const { totalPoints } = useHealthData();

  return (
    // Using a Tab Navigator for the main app interface
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // The top header is now part of the navigator
        header: (props) => <Navigation {...props} totalPoints={totalPoints} />,
        tabBar: (props) => <BottomNavigation {...props} />,
        tabBarStyle: { backgroundColor: "#f0fdf4" },
      })}
    >
      <Tab.Screen name="dashboard" component={Dashboard} />
      <Tab.Screen name="heart" component={HeartRatePage} />
      <Tab.Screen name="steps" component={StepsPage} />
      <Tab.Screen name="medicine" component={MedicinePage} />
      <Tab.Screen name="milestones" component={MilestonesPage} />
      {/* You can add more screens here or handle them differently */}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0fdf4", // bg-green-50
    padding: 16,
  },
  loadingText: {
    marginTop: 16,
    color: "#1f2937", // text-gray-800
  },
  errorTitle: {
    fontSize: 20,
    marginBottom: 16,
    color: "#ef4444", // text-red-500
    fontWeight: "bold",
  },
  errorText: {
    color: "#ef4444", // text-red-500
    textAlign: "center",
  },
});

export default App;
