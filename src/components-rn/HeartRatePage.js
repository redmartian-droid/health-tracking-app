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

export default function HeartRatePage({ heartRate }) {
  const getHeartRateStatus = () => {
    if (heartRate < 60) return { status: 'Low', color: '#ef4444', description: 'Below normal resting heart rate' };
    if (heartRate > 100) return { status: 'High', color: '#f59e0b', description: 'Above normal resting heart rate' };
    return { status: 'Normal', color: '#10b981', description: 'Healthy resting heart rate' };
  };

  const heartRateStatus = getHeartRateStatus();

  // Mock data for heart rate history
  const heartRateHistory = [
    { time: '6:00', value: 68 },
    { time: '9:00', value: 72 },
    { time: '12:00', value: 75 },
    { time: '15:00', value: heartRate },
    { time: '18:00', value: 70 },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Current Heart Rate Card */}
      <View style={styles.currentCard}>
        <View style={styles.currentHeader}>
          <Icon name="favorite" size={32} color="#ef4444" />
          <Text style={styles.currentTitle}>Current Heart Rate</Text>
        </View>
        
        <View style={styles.currentValueContainer}>
          <Text style={styles.currentValue}>{heartRate}</Text>
          <Text style={styles.currentUnit}>BPM</Text>
        </View>

        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, { backgroundColor: heartRateStatus.color }]} />
          <View style={styles.statusTextContainer}>
            <Text style={[styles.statusText, { color: heartRateStatus.color }]}>
              {heartRateStatus.status}
            </Text>
            <Text style={styles.statusDescription}>
              {heartRateStatus.description}
            </Text>
          </View>
        </View>
      </View>

      {/* Heart Rate Zones */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Heart Rate Zones</Text>
        
        <View style={styles.zoneItem}>
          <View style={[styles.zoneColor, { backgroundColor: '#3b82f6' }]} />
          <View style={styles.zoneInfo}>
            <Text style={styles.zoneName}>Resting</Text>
            <Text style={styles.zoneRange}>50-60 BPM</Text>
          </View>
        </View>

        <View style={styles.zoneItem}>
          <View style={[styles.zoneColor, { backgroundColor: '#10b981' }]} />
          <View style={styles.zoneInfo}>
            <Text style={styles.zoneName}>Fat Burn</Text>
            <Text style={styles.zoneRange}>60-70 BPM</Text>
          </View>
        </View>

        <View style={styles.zoneItem}>
          <View style={[styles.zoneColor, { backgroundColor: '#f59e0b' }]} />
          <View style={styles.zoneInfo}>
            <Text style={styles.zoneName}>Cardio</Text>
            <Text style={styles.zoneRange}>70-85 BPM</Text>
          </View>
        </View>

        <View style={styles.zoneItem}>
          <View style={[styles.zoneColor, { backgroundColor: '#ef4444' }]} />
          <View style={styles.zoneInfo}>
            <Text style={styles.zoneName}>Peak</Text>
            <Text style={styles.zoneRange}>85+ BPM</Text>
          </View>
        </View>
      </View>

      {/* Today's History */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Today's History</Text>
        
        {heartRateHistory.map((entry, index) => (
          <View key={index} style={styles.historyItem}>
            <Text style={styles.historyTime}>{entry.time}</Text>
            <View style={styles.historyValueContainer}>
              <Text style={styles.historyValue}>{entry.value}</Text>
              <Text style={styles.historyUnit}>BPM</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Tips */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Heart Health Tips</Text>
        
        <View style={styles.tipItem}>
          <Icon name="fitness-center" size={20} color="#10b981" />
          <Text style={styles.tipText}>
            Regular exercise helps maintain a healthy heart rate
          </Text>
        </View>

        <View style={styles.tipItem}>
          <Icon name="self-improvement" size={20} color="#10b981" />
          <Text style={styles.tipText}>
            Practice deep breathing to lower your resting heart rate
          </Text>
        </View>

        <View style={styles.tipItem}>
          <Icon name="bedtime" size={20} color="#10b981" />
          <Text style={styles.tipText}>
            Get adequate sleep for optimal heart health
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
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusTextContainer: {
    alignItems: 'center',
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
  },
  statusDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
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
  zoneItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  zoneColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  zoneInfo: {
    flex: 1,
  },
  zoneName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  zoneRange: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
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
