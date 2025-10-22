import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HeartRatePage({ heartRate }) {
  const zones = [
    {
      zone: 'Resting',
      min: 50,
      max: 70,
      current: heartRate >= 50 && heartRate <= 70,
      color: '#10b981',
    },
    {
      zone: 'Fat Burn',
      min: 71,
      max: 85,
      current: heartRate >= 71 && heartRate <= 85,
      color: '#f59e0b',
    },
    {
      zone: 'Cardio',
      min: 86,
      max: 100,
      current: heartRate >= 86 && heartRate <= 100,
      color: '#ef4444',
    },
    {
      zone: 'Peak',
      min: 101,
      max: 120,
      current: heartRate >= 101 && heartRate <= 120,
      color: '#dc2626',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Heart Rate Monitoring</Text>

        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <View style={styles.cardHeader}>
              <Ionicons name="heart" size={24} color="#ef4444" />
              <Text style={styles.cardTitle}>Current Heart Rate</Text>
            </View>
            <Text style={styles.cardValue}>{heartRate}</Text>
            <Text style={styles.cardUnit}>BPM</Text>
          </View>

          <View style={styles.metricCard}>
            <View style={styles.cardHeader}>
              <Ionicons name="heart" size={24} color="#ef4444" />
              <Text style={styles.cardTitle}>Resting HR</Text>
            </View>
            <Text style={styles.cardValue}>68</Text>
            <Text style={styles.cardUnit}>BPM</Text>
          </View>

          <View style={styles.metricCard}>
            <View style={styles.cardHeader}>
              <Ionicons name="heart" size={24} color="#ef4444" />
              <Text style={styles.cardTitle}>Max HR Today</Text>
            </View>
            <Text style={styles.cardValue}>95</Text>
            <Text style={styles.cardUnit}>BPM</Text>
          </View>
        </View>

        <View style={styles.zonesCard}>
          <Text style={styles.zonesTitle}>Heart Rate Zones</Text>
          <View style={styles.zonesContainer}>
            {zones.map((zone) => (
              <View
                key={zone.zone}
                style={[
                  styles.zoneItem,
                  zone.current && styles.zoneItemActive,
                ]}
              >
                <View style={styles.zoneLeft}>
                  <View
                    style={[styles.zoneDot, { backgroundColor: zone.color }]}
                  />
                  <Text style={styles.zoneName}>{zone.zone}</Text>
                  <Text style={styles.zoneRange}>
                    {zone.min}-{zone.max} BPM
                  </Text>
                </View>
                {zone.current && (
                  <View style={styles.currentBadge}>
                    <Text style={styles.currentBadgeText}>Current Zone</Text>
                  </View>
                )}
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
    marginBottom: 24,
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
  zonesCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  zonesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  zonesContainer: {
    gap: 12,
  },
  zoneItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  zoneItemActive: {
    backgroundColor: '#f9fafb',
    borderColor: '#9ca3af',
  },
  zoneLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  zoneDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  zoneName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  zoneRange: {
    fontSize: 12,
    color: '#6b7280',
  },
  currentBadge: {
    backgroundColor: '#d1d5db',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  currentBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1f2937',
  },
});
