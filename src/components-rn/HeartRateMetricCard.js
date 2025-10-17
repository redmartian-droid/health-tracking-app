import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function HeartRateMetricCard({ title, value, unit, trend }) {
  const getTrendColor = () => {
    if (trend > 0) return '#10b981'; // green
    if (trend < 0) return '#ef4444'; // red
    return '#6b7280'; // gray
  };

  const getTrendIcon = () => {
    if (trend > 0) return 'trending-up';
    if (trend < 0) return 'trending-down';
    return 'trending-flat';
  };

  const getHeartRateStatus = () => {
    if (value < 60) return { status: 'Low', color: '#ef4444' };
    if (value > 100) return { status: 'High', color: '#f59e0b' };
    return { status: 'Normal', color: '#10b981' };
  };

  const heartRateStatus = getHeartRateStatus();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon name="favorite" size={24} color="#ef4444" />
        <View style={[styles.trendContainer, { backgroundColor: getTrendColor() + '20' }]}>
          <Icon name={getTrendIcon()} size={16} color={getTrendColor()} />
          <Text style={[styles.trendText, { color: getTrendColor() }]}>
            {Math.abs(trend)}%
          </Text>
        </View>
      </View>
      
      <Text style={styles.title}>{title}</Text>
      
      <View style={styles.valueContainer}>
        <Text style={styles.value}>{value}</Text>
        <Text style={styles.unit}>{unit}</Text>
      </View>

      <View style={styles.statusContainer}>
        <View style={[styles.statusDot, { backgroundColor: heartRateStatus.color }]} />
        <Text style={[styles.statusText, { color: heartRateStatus.color }]}>
          {heartRateStatus.status}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  title: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  value: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  unit: {
    fontSize: 16,
    color: '#6b7280',
    marginLeft: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
