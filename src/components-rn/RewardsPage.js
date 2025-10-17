import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function RewardsPage({ milestones, totalPoints }) {
  const availableRewards = [
    { id: 1, name: 'Coffee Voucher', cost: 100, icon: 'local-cafe', description: 'Free coffee at your favorite cafe' },
    { id: 2, name: 'Movie Ticket', cost: 200, icon: 'movie', description: 'One movie ticket for any show' },
    { id: 3, name: 'Gym Day Pass', cost: 150, icon: 'fitness-center', description: 'One day access to premium gym' },
    { id: 4, name: 'Healthy Meal', cost: 250, icon: 'restaurant', description: 'Healthy meal delivery' },
    { id: 5, name: 'Spa Treatment', cost: 500, icon: 'spa', description: '1-hour relaxation spa session' },
    { id: 6, name: 'Fitness Tracker', cost: 1000, icon: 'watch', description: 'Premium fitness tracking device' },
  ];

  const completedMilestones = milestones.filter(m => m.completed);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Rewards Store</Text>
        <View style={styles.pointsContainer}>
          <Icon name="stars" size={20} color="#f59e0b" />
          <Text style={styles.pointsText}>{totalPoints} points</Text>
        </View>
      </View>

      {/* Recent Achievements */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Achievements</Text>
        {completedMilestones.slice(0, 3).map(milestone => (
          <View key={milestone.id} style={styles.achievementCard}>
            <Icon name="emoji-events" size={24} color="#f59e0b" />
            <View style={styles.achievementInfo}>
              <Text style={styles.achievementTitle}>{milestone.title}</Text>
              <Text style={styles.achievementReward}>+{milestone.reward} points earned</Text>
            </View>
            <Icon name="check-circle" size={20} color="#10b981" />
          </View>
        ))}
      </View>

      {/* Available Rewards */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Available Rewards</Text>
        {availableRewards.map(reward => {
          const canAfford = totalPoints >= reward.cost;
          
          return (
            <View key={reward.id} style={styles.rewardCard}>
              <View style={styles.rewardHeader}>
                <View style={[styles.rewardIconContainer, { opacity: canAfford ? 1 : 0.5 }]}>
                  <Icon name={reward.icon} size={24} color="#10b981" />
                </View>
                <View style={styles.rewardInfo}>
                  <Text style={[styles.rewardName, { opacity: canAfford ? 1 : 0.5 }]}>
                    {reward.name}
                  </Text>
                  <Text style={[styles.rewardDescription, { opacity: canAfford ? 1 : 0.5 }]}>
                    {reward.description}
                  </Text>
                </View>
                <View style={styles.rewardCostContainer}>
                  <Icon name="stars" size={16} color="#f59e0b" />
                  <Text style={styles.rewardCost}>{reward.cost}</Text>
                </View>
              </View>
              
              <TouchableOpacity
                style={[
                  styles.redeemButton,
                  !canAfford && styles.redeemButtonDisabled
                ]}
                disabled={!canAfford}
              >
                <Text style={[
                  styles.redeemButtonText,
                  !canAfford && styles.redeemButtonTextDisabled
                ]}>
                  {canAfford ? 'Redeem' : 'Not enough points'}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>

      {/* Points Summary */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Points Summary</Text>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Earned</Text>
          <Text style={styles.summaryValue}>{totalPoints}</Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>From Milestones</Text>
          <Text style={styles.summaryValue}>
            {completedMilestones.reduce((sum, m) => sum + m.reward, 0)}
          </Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Available to Spend</Text>
          <Text style={[styles.summaryValue, styles.summaryHighlight]}>{totalPoints}</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  pointsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400e',
    marginLeft: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  achievementInfo: {
    flex: 1,
    marginLeft: 12,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  achievementReward: {
    fontSize: 14,
    color: '#10b981',
    marginTop: 2,
  },
  rewardCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  rewardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rewardIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0fdf4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rewardInfo: {
    flex: 1,
  },
  rewardName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  rewardDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  rewardCostContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  rewardCost: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400e',
    marginLeft: 4,
  },
  redeemButton: {
    backgroundColor: '#10b981',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  redeemButtonDisabled: {
    backgroundColor: '#f3f4f6',
  },
  redeemButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  redeemButtonTextDisabled: {
    color: '#9ca3af',
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  summaryHighlight: {
    color: '#10b981',
  },
});
