import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MetricCard from './MetricCard';
import HeartRateMetricCard from './HeartRateMetricCard';

const { width } = Dimensions.get('window');

export default function Dashboard({ heartRate, steps, medicines, milestones }) {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Health Dashboard</Text>
        <Text style={styles.subtitle}>
          Track your daily health metrics and achieve your goals
        </Text>
        <Text style={styles.welcome}>Welcome back, User!</Text>
      </View>

      {/* Metrics Grid */}
      <View style={styles.metricsGrid}>
        <HeartRateMetricCard
          title="Heart Rate"
          value={heartRate}
          unit="BPM"
          trend={2}
        />

        <MetricCard
          title="Steps Today"
          value={steps}
          unit="steps"
          iconName="directions-walk"
          trend={15}
        />

        <MetricCard
          title="Medicines Today"
          value={medicines.reduce(
            (acc, m) => acc + Object.values(m.taken).filter(Boolean).length,
            0
          )}
          unit={`/ ${medicines.reduce((acc, m) => acc + m.times.length, 0)}`}
          iconName="medication"
          trend={-5}
        />
      </View>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        {/* Recent Milestones */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Recent Milestones</Text>
          {milestones
            .filter(m => m.completed)
            .slice(0, 3)
            .map(milestone => (
              <View key={milestone.id} style={styles.milestoneItem}>
                <Icon name="check-circle" size={20} color="#10b981" />
                <View style={styles.milestoneContent}>
                  <Text style={styles.milestoneTitle}>{milestone.title}</Text>
                  <Text style={styles.milestoneReward}>
                    +{milestone.reward} points earned
                  </Text>
                </View>
              </View>
            ))}
        </View>

        {/* Quick Medicine Check */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Quick Medicine Check</Text>
          {medicines.slice(0, 3).map(medicine => (
            <View key={medicine.id} style={styles.medicineItem}>
              <View style={styles.medicineInfo}>
                <Text style={styles.medicineName}>{medicine.name}</Text>
                <Text style={styles.medicineDosage}>{medicine.dosage}</Text>
              </View>
              <View style={styles.medicineTimesContainer}>
                {medicine.times.map(time => (
                  <View
                    key={time}
                    style={[
                      styles.medicineTime,
                      medicine.taken[time] && styles.medicineTimeTaken,
                    ]}
                  >
                    <Text
                      style={[
                        styles.medicineTimeText,
                        medicine.taken[time] && styles.medicineTimeTextTaken,
                      ]}
                    >
                      {time}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
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
  header: {
    padding: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 4,
  },
  welcome: {
    fontSize: 16,
    color: '#6b7280',
  },
  metricsGrid: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  bottomSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
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
  milestoneItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  milestoneContent: {
    marginLeft: 12,
    flex: 1,
  },
  milestoneTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  milestoneReward: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  medicineItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  medicineInfo: {
    flex: 1,
  },
  medicineName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  medicineDosage: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  medicineTimesContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  medicineTime: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  medicineTimeTaken: {
    backgroundColor: '#d1fae5',
  },
  medicineTimeText: {
    fontSize: 12,
    color: '#6b7280',
  },
  medicineTimeTextTaken: {
    color: '#065f46',
  },
});
