import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

export default function StepsPage({ steps }) {
  const dailyGoal = 10000;
  const progress = Math.min((steps / dailyGoal) * 100, 100);
  const remainingSteps = Math.max(dailyGoal - steps, 0);

  // Mock data for steps history
  const stepsHistory = [
    { time: '6:00', value: 0 },
    { time: '9:00', value: 1200 },
    { time: '12:00', value: 3500 },
    { time: '15:00', value: steps },
    { time: '18:00', value: steps + 800 },
  ];

  const weeklyData = [
    { day: 'Mon', steps: 8500 },
    { day: 'Tue', steps: 9200 },
    { day: 'Wed', steps: 7800 },
    { day: 'Thu', steps: 10500 },
    { day: 'Fri', steps: 9800 },
    { day: 'Sat', steps: 6200 },
    { day: 'Sun', steps: steps },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Current Steps Card */}
      <View style={styles.currentCard}>
        <View style={styles.currentHeader}>
          <Icon name="directions-walk" size={32} color="#10b981" />
          <Text style={styles.currentTitle}>Steps Today</Text>
        </View>
        
        <View style={styles.currentValueContainer}>
          <Text style={styles.currentValue}>{steps.toLocaleString()}</Text>
          <Text style={styles.currentUnit}>steps</Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {progress.toFixed(0)}% of daily goal
          </Text>
        </View>

        <View style={styles.goalContainer}>
          <Text style={styles.goalText}>
            {remainingSteps > 0 
              ? `${remainingSteps.toLocaleString()} steps to reach your goal`
              : 'Goal achieved! 🎉'
            }
          </Text>
        </View>
      </View>

      {/* Weekly Overview */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>This Week</Text>
        
        {weeklyData.map((entry, index) => (
          <View key={index} style={styles.weeklyItem}>
            <Text style={styles.weeklyDay}>{entry.day}</Text>
            <View style={styles.weeklyBarContainer}>
              <View style={styles.weeklyBar}>
                <View 
                  style={[
                    styles.weeklyBarFill, 
                    { width: `${(entry.steps / 12000) * 100}%` }
                  ]} 
                />
              </View>
              <Text style={styles.weeklySteps}>
                {entry.steps.toLocaleString()}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Today's Activity */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Today's Activity</Text>
        
        {stepsHistory.map((entry, index) => (
          <View key={index} style={styles.historyItem}>
            <Text style={styles.historyTime}>{entry.time}</Text>
            <View style={styles.historyValueContainer}>
              <Text style={styles.historyValue}>
                {entry.value.toLocaleString()}
              </Text>
              <Text style={styles.historyUnit}>steps</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Stats */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Statistics</Text>
        
        <View style={styles.statItem}>
          <Icon name="trending-up" size={20} color="#10b981" />
          <View style={styles.statInfo}>
            <Text style={styles.statLabel}>Average Daily Steps</Text>
            <Text style={styles.statValue}>8,743 steps</Text>
          </View>
        </View>

        <View style={styles.statItem}>
          <Icon name="local-fire-department" size={20} color="#f59e0b" />
          <View style={styles.statInfo}>
            <Text style={styles.statLabel}>Calories Burned</Text>
            <Text style={styles.statValue}>~{Math.round(steps * 0.04)} cal</Text>
          </View>
        </View>

        <View style={styles.statItem}>
          <Icon name="straighten" size={20} color="#3b82f6" />
          <View style={styles.statInfo}>
            <Text style={styles.statLabel}>Distance Walked</Text>
            <Text style={styles.statValue}>~{(steps * 0.0008).toFixed(1)} km</Text>
          </View>
        </View>
      </View>

      {/* Tips */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Walking Tips</Text>
        
        <View style={styles.tipItem}>
          <Icon name="schedule" size={20} color="#10b981" />
          <Text style={styles.tipText}>
            Take a 10-minute walk every hour to stay active
          </Text>
        </View>

        <View style={styles.tipItem}>
          <Icon name="stairs" size={20} color="#10b981" />
          <Text style={styles.tipText}>
            Use stairs instead of elevators when possible
          </Text>
        </View>

        <View style={styles.tipItem}>
          <Icon name="park" size={20} color="#10b981" />
          <Text style={styles.tipText}>
            Walk in nature for better mental health benefits
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0fdf4',
    padding: 20,
  },
  currentCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },
  currentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  currentTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginLeft: 12,
  },
  currentValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginBottom: 20,
  },
  currentValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  currentUnit: {
    fontSize: 20,
    color: '#6b7280',
    marginLeft: 8,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  goalContainer: {
    alignItems: 'center',
  },
  goalText: {
    fontSize: 16,
    color: '#10b981',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  weeklyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  weeklyDay: {
    fontSize: 14,
    color: '#6b7280',
    width: 40,
  },
  weeklyBarContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  weeklyBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#f3f4f6',
    borderRadius: 3,
    marginRight: 12,
  },
  weeklyBarFill: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 3,
  },
  weeklySteps: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '600',
    width: 60,
    textAlign: 'right',
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  historyTime: {
    fontSize: 16,
    color: '#6b7280',
  },
  historyValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  historyValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  historyUnit: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 4,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  statInfo: {
    marginLeft: 12,
    flex: 1,
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 2,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  tipText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 12,
    flex: 1,
  },
});
