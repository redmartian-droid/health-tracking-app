import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Dashboard({ heartRate, steps, medicines, milestones, navigation }) {
  const completedMedicines = medicines.reduce(
    (acc, m) => acc + Object.values(m.taken).filter(Boolean).length,
    0
  );
  const totalMedicines = medicines.reduce((acc, m) => acc + m.times.length, 0);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Health Dashboard</Text>
          <Text style={styles.headerSubtitle}>
            Track your daily health metrics and achieve your goals
          </Text>
          <Text style={styles.welcomeText}>Welcome back, User!</Text>
        </View>

        <View style={styles.metricsGrid}>
          <TouchableOpacity
            style={styles.metricCard}
            onPress={() => navigation.navigate('Heart')}
          >
            <View style={styles.cardHeader}>
              <Ionicons name="heart" size={24} color="#ef4444" />
              <Text style={styles.cardTitle}>Heart Rate</Text>
            </View>
            <Text style={styles.cardValue}>{heartRate}</Text>
            <Text style={styles.cardUnit}>BPM</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.metricCard}
            onPress={() => navigation.navigate('Steps')}
          >
            <View style={styles.cardHeader}>
              <Ionicons name="footsteps" size={24} color="#3b82f6" />
              <Text style={styles.cardTitle}>Steps Today</Text>
            </View>
            <Text style={styles.cardValue}>{steps}</Text>
            <Text style={styles.cardUnit}>steps</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.metricCard}
            onPress={() => navigation.navigate('Medicine')}
          >
            <View style={styles.cardHeader}>
              <Ionicons name="medical" size={24} color="#8b5cf6" />
              <Text style={styles.cardTitle}>Medicines Today</Text>
            </View>
            <Text style={styles.cardValue}>
              {completedMedicines} / {totalMedicines}
            </Text>
            <Text style={styles.cardUnit}>taken</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.sectionCard}
          onPress={() => navigation.navigate('Milestones')}
        >
          <Text style={styles.sectionTitle}>Recent Milestones</Text>
          {milestones
            .filter((m) => m.completed)
            .slice(0, 3)
            .map((milestone) => (
              <View key={milestone.id} style={styles.milestoneItem}>
                <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
                <View style={styles.milestoneText}>
                  <Text style={styles.milestoneName}>{milestone.title}</Text>
                  <Text style={styles.milestoneReward}>
                    +{milestone.reward} points earned
                  </Text>
                </View>
              </View>
            ))}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.sectionCard}
          onPress={() => navigation.navigate('Medicine')}
        >
          <Text style={styles.sectionTitle}>Quick Medicine Check</Text>
          {medicines.slice(0, 3).map((medicine) => (
            <View key={medicine.id} style={styles.medicineItem}>
              <View>
                <Text style={styles.medicineName}>{medicine.name}</Text>
                <Text style={styles.medicineDosage}>{medicine.dosage}</Text>
              </View>
              <View style={styles.medicineTimesContainer}>
                {medicine.times.map((time) => (
                  <View
                    key={time}
                    style={[
                      styles.medicineTimeChip,
                      medicine.taken[time] && styles.medicineTimeTaken,
                    ]}
                  >
                    <Text style={styles.medicineTimeText}>{time}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </TouchableOpacity>
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
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  welcomeText: {
    fontSize: 14,
    color: '#6b7280',
  },
  metricsGrid: {
    marginBottom: 24,
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
  sectionCard: {
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
    marginBottom: 16,
  },
  milestoneItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  milestoneText: {
    marginLeft: 12,
    flex: 1,
  },
  milestoneName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  milestoneReward: {
    fontSize: 12,
    color: '#6b7280',
  },
  medicineItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  medicineName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  medicineDosage: {
    fontSize: 12,
    color: '#6b7280',
  },
  medicineTimesContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  medicineTimeChip: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  medicineTimeTaken: {
    backgroundColor: '#d1d5db',
  },
  medicineTimeText: {
    fontSize: 12,
    color: '#374151',
  },
});
