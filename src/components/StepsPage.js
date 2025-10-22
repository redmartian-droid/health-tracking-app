import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function StepsPage({ steps }) {
  const progressPercentage = Math.round((steps / 10000) * 100);
  const caloriesBurned = Math.round(steps * 0.04);
  const stepsRemaining = 10000 - steps;

  const milestones = [
    { milestone: '5,000 steps', target: 5000, achieved: steps >= 5000, reward: 50 },
    { milestone: '7,500 steps', target: 7500, achieved: steps >= 7500, reward: 75 },
    { milestone: '10,000 steps', target: 10000, achieved: steps >= 10000, reward: 100 },
    { milestone: '12,500 steps', target: 12500, achieved: steps >= 12500, reward: 125 },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Step Tracking</Text>

        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <View style={styles.cardHeader}>
              <Ionicons name="footsteps" size={24} color="#3b82f6" />
              <Text style={styles.cardTitle}>Steps Today</Text>
            </View>
            <Text style={styles.cardValue}>{steps.toLocaleString()}</Text>
            <Text style={styles.cardUnit}>steps</Text>
          </View>

          <View style={styles.metricCard}>
            <View style={styles.cardHeader}>
              <Ionicons name="flag" size={24} color="#22c55e" />
              <Text style={styles.cardTitle}>Goal Progress</Text>
            </View>
            <Text style={styles.cardValue}>{progressPercentage}</Text>
            <Text style={styles.cardUnit}>%</Text>
          </View>

          <View style={styles.metricCard}>
            <View style={styles.cardHeader}>
              <Ionicons name="flame" size={24} color="#f59e0b" />
              <Text style={styles.cardTitle}>Calories Burned</Text>
            </View>
            <Text style={styles.cardValue}>{caloriesBurned}</Text>
            <Text style={styles.cardUnit}>cal</Text>
          </View>
        </View>

        <View style={styles.progressCard}>
          <Text style={styles.sectionTitle}>Daily Goal Progress</Text>
          <View style={styles.progressInfo}>
            <Text style={styles.progressLabel}>Progress</Text>
            <Text style={styles.progressPercent}>{progressPercentage}%</Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${Math.min(progressPercentage, 100)}%` },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {stepsRemaining > 0
              ? `${stepsRemaining.toLocaleString()} steps to reach your daily goal`
              : 'Goal achieved! Great work!'}
          </Text>
        </View>

        <View style={styles.milestonesCard}>
          <Text style={styles.sectionTitle}>Step Milestones</Text>
          <View style={styles.milestonesGrid}>
            {milestones.map((item, index) => (
              <View
                key={index}
                style={[
                  styles.milestoneItem,
                  item.achieved && styles.milestoneAchieved,
                ]}
              >
                <Text style={styles.milestoneName}>{item.milestone}</Text>
                <View style={styles.milestoneReward}>
                  <Text
                    style={[
                      styles.milestoneRewardText,
                      item.achieved && styles.milestoneRewardAchieved,
                    ]}
                  >
                    {item.achieved ? '✓' : '○'} +{item.reward} pts
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0fdf4',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  metricsGrid: {
    marginBottom: 16,
  },
  metricCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 8,
  },
  cardValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  cardUnit: {
    fontSize: 14,
    color: '#6b7280',
  },
  progressCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  progressPercent: {
    fontSize: 14,
    color: '#6b7280',
  },
  progressBarContainer: {
    width: '100%',
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4b5563',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#6b7280',
  },
  milestonesCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  milestonesGrid: {
    gap: 12,
  },
  milestoneItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  milestoneAchieved: {
    backgroundColor: '#f9fafb',
    borderColor: '#9ca3af',
  },
  milestoneName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  milestoneReward: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  milestoneRewardText: {
    fontSize: 14,
    color: '#6b7280',
  },
  milestoneRewardAchieved: {
    fontWeight: 'bold',
    color: '#1f2937',
  },
});
