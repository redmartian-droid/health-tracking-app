import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// Import components (we'll create these next)
import Dashboard from './src/components-rn/Dashboard';
import HeartRatePage from './src/components-rn/HeartRatePage';
import StepsPage from './src/components-rn/StepsPage';
import MedicinePage from './src/components-rn/MedicinePage';
import MilestonesPage from './src/components-rn/MilestonesPage';
import RewardsPage from './src/components-rn/RewardsPage';
import SettingsPage from './src/components-rn/SettingsPage';
import SignIn from './src/components-rn/SignIn';
import SignUp from './src/components-rn/SignUp';

// Import API service
import { API } from './src/services/api';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HealthTracker() {
  const [heartRate, setHeartRate] = useState(72);
  const [steps, setSteps] = useState(5420);
  const [medicines, setMedicines] = useState([]);
  const [milestones, setMilestones] = useState([
    {
      id: 1,
      title: 'First 5K Steps',
      target: 5000,
      current: 5420,
      completed: true,
      type: 'steps',
      reward: 50,
    },
    {
      id: 2,
      title: 'Healthy Heart Week',
      target: 7,
      current: 6,
      completed: false,
      type: 'heart',
      reward: 100,
    },
    {
      id: 3,
      title: 'Medicine Compliance',
      target: 14,
      current: 12,
      completed: false,
      type: 'medicine',
      reward: 75,
    },
    {
      id: 4,
      title: '10K Steps Champion',
      target: 10000,
      current: 5420,
      completed: false,
      type: 'steps',
      reward: 150,
    },
  ]);
  const [totalPoints, setTotalPoints] = useState(250);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [hr, st, med, ms] = await Promise.all([
        API.getHeartRate(),
        API.getSteps(),
        API.getMedicines(),
        API.getMilestones(),
      ]);
      setHeartRate(hr);
      setSteps(st);
      setMedicines(med);
      setMilestones(ms);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const toggleMedicine = async (medicineId, time) => {
    const medicine = medicines.find(m => m.id === medicineId);
    const newTaken = !medicine.taken[time];

    try {
      await API.updateMedicine(medicineId, time, newTaken);
      setMedicines(
        medicines.map(m =>
          m.id === medicineId
            ? { ...m, taken: { ...m.taken, [time]: newTaken } }
            : m
        )
      );

      if (newTaken) {
        setTotalPoints(prev => prev + 10);
      }
    } catch (error) {
      console.error('Error updating medicine:', error);
    }
  };

  const addMedicine = async newMed => {
    try {
      const medicine = await API.addMedicine({
        ...newMed,
        taken: newMed.times.reduce(
          (acc, time) => ({ ...acc, [time]: false }),
          {}
        ),
      });
      setMedicines([...medicines, medicine]);
    } catch (error) {
      console.error('Error adding medicine:', error);
    }
  };

  const completeMilestone = async milestoneId => {
    try {
      await API.completeMilestone(milestoneId);
      setMilestones(
        milestones.map(m =>
          m.id === milestoneId ? { ...m, completed: true } : m
        )
      );

      const milestone = milestones.find(m => m.id === milestoneId);
      setTotalPoints(prev => prev + milestone.reward);
    } catch (error) {
      console.error('Error completing milestone:', error);
    }
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = 'dashboard';
          } else if (route.name === 'Heart') {
            iconName = 'favorite';
          } else if (route.name === 'Steps') {
            iconName = 'directions-walk';
          } else if (route.name === 'Medicine') {
            iconName = 'medication';
          } else if (route.name === 'Milestones') {
            iconName = 'emoji-events';
          } else if (route.name === 'Rewards') {
            iconName = 'card-giftcard';
          } else if (route.name === 'Settings') {
            iconName = 'settings';
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#10b981',
        tabBarInactiveTintColor: 'gray',
        headerStyle: {
          backgroundColor: '#10b981',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        options={{ title: 'Health Dashboard' }}
      >
        {() => (
          <Dashboard
            heartRate={heartRate}
            steps={steps}
            medicines={medicines}
            milestones={milestones}
          />
        )}
      </Tab.Screen>
      <Tab.Screen 
        name="Heart" 
        options={{ title: 'Heart Rate' }}
      >
        {() => <HeartRatePage heartRate={heartRate} />}
      </Tab.Screen>
      <Tab.Screen 
        name="Steps" 
        options={{ title: 'Steps' }}
      >
        {() => <StepsPage steps={steps} />}
      </Tab.Screen>
      <Tab.Screen 
        name="Medicine" 
        options={{ title: 'Medicine' }}
      >
        {() => (
          <MedicinePage
            medicines={medicines}
            toggleMedicine={toggleMedicine}
            addMedicine={addMedicine}
          />
        )}
      </Tab.Screen>
      <Tab.Screen 
        name="Milestones" 
        options={{ title: 'Milestones' }}
      >
        {() => (
          <MilestonesPage
            milestones={milestones}
            totalPoints={totalPoints}
            completeMilestone={completeMilestone}
          />
        )}
      </Tab.Screen>
      <Tab.Screen 
        name="Rewards" 
        options={{ title: 'Rewards' }}
      >
        {() => (
          <RewardsPage 
            milestones={milestones} 
            totalPoints={totalPoints} 
          />
        )}
      </Tab.Screen>
      <Tab.Screen 
        name="Settings" 
        options={{ title: 'Settings' }}
        component={SettingsPage}
      />
    </Tab.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
    </Stack.Navigator>
  );
}

function App() {
  // Skip authentication for now - go directly to the main app
  const isAuthenticated = true;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#10b981" />
      <NavigationContainer>
        {isAuthenticated ? <HealthTracker /> : <AuthStack />}
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0fdf4',
  },
});

export default App;
