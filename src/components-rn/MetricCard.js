import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function MetricCard({ title, value, unit, iconName, trend }) {
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon name={iconName} size={24} color="#10b981" />
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
});
