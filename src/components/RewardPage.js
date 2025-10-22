import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function RewardsPage({ milestones, totalPoints }) {
  const completedMilestones = milestones.filter((m) => m.completed);
  const totalRewardsEarned = completedMilestones.reduce(
    (sum, m) => sum + m.reward,
    0
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Rewards & Points</Text>

        <View style={styles.pointsCard}>
          <Text style={styles.pointsTitle}>Total Points Earned</Text>
          <Text style={styles.pointsValue}>{totalPoints}</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{completedMilestones.length}</Text>
              <Text style={styles.statLabel}>Rewards Unlocked</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{totalRewardsEarned}</Text>
              <Text style={styles.statLabel}>Bonus Points Earned</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="gift" size={24} color="#8b5cf6" />
            <Text style={styles.sectionTitle}>Earned Rewards</Text>
          </View>

          {completedMilestones.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="gift-outline" size={64} color="#d1d5db" />
              <Text style={styles.emptyTitle}>No rewards earned yet!</Text>
              <Text style={styles.emptySubtitle}>
                Complete milestones to unlock rewards
              </Text>
            </View>
          ) : (
            <View style={styles.rewardsGrid}>
              {completedMilestones.map((milestone) => (
                <View key={milestone.id} style={styles.rewardCard}>
                  <View style={styles.rewardIcon}>
                    <Text style={styles.trophyEmoji}>🏆</Text>
                  </View>
                  <View style={styles.rewardContent}>
                    <Text style={styles.rewardTitle}>{milestone.title}</Text>
                    <Text style={styles.rewardCompleted}>
                      Completed: {milestone.target.toLocaleString()}{' '}
                      {milestone.type}
                    </Text>
                    <View style={styles.pointsBadge}>
                      <Text style={styles.pointsBadgeText}>
                        +{milestone.reward} Points
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="star" size={24} color="#f59e0b" />
            <Text style={styles.sectionTitle}>Available Rewards</Text>
          </View>

          {milestones.filter((m) => !m.completed).length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="trophy" size={64} color="#d1d5db" />
              <Text style={styles.emptyTitle}>All rewards unlocked!</Text>
              <Text style={styles.emptySubtitle}>
                Congratulations on completing all milestones!
              </Text>
            </View>
          ) : (
            <View style={styles.rewardsGrid}>
              {milestones
                .filter((m) => !m.completed)
                .map((milestone) => {
                  const progress = (milestone.current / milestone.target) * 100;
                  return (
                    <View key={milestone.id} style={styles.availableRewardCard}>
                      <View style={styles.availableRewardHeader}>
                        <Text style={styles.availableRewardTitle}>
                          {milestone.title}
                        </Text>
                        <View style={styles.pointsBadge}>
                          <Text style={styles.pointsBadgeText}>
                            +{milestone.reward} pts
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.availableRewardDesc}>
                        Complete {milestone.target.toLocaleString()}{' '}
                        {milestone.type} to unlock
                      </Text>
                      <View style={styles.progressSection}>
                        <View style={styles.progressInfo}>
                          <Text style={styles.progressLabel}>
                            {milestone.current.toLocaleString()}
                          </Text>
                          <Text style={styles.progressLabel}>
                            {milestone.target.toLocaleString()}
                          </Text>
                        </View>
                        <View style={styles.progressBarContainer}>
                          <View
                            style={[
                              styles.progressBarFill,
                              { width: `${Math.min(progress, 100)}%` },
                            ]}
                          />
                        </View>
                        <Text style={styles.progressPercent}>
                          {Math.round(progress)}% complete
                        </Text>
                      </View>
                    </View>
                  );
                })}
            </View>
          )}
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
  pointsCard: {
    backgroundColor: '#e5e7eb',
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
    alignItems: 'center',
  },
  pointsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  pointsValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#d1d5db',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
    textAlign: 'center',
  },
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyTitle: {
    fontSize: 18,
    color: '#6b7280',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 8,
    textAlign: 'center',
  },
  rewardsGrid: {
    gap: 16,
  },
  rewardCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 16,
  },
  rewardIcon: {
    backgroundColor: '#d1d5db',
    borderRadius: 24,
    padding: 12,
  },
  trophyEmoji: {
    fontSize: 24,
  },
  rewardContent: {
    flex: 1,
  },
  rewardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  rewardCompleted: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 8,
  },
  pointsBadge: {
    backgroundColor: '#d1d5db',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  pointsBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  availableRewardCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  availableRewardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  availableRewardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
  },
  availableRewardDesc: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 12,
  },
  progressSection: {
    marginTop: 8,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 12,
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
  progressPercent: {
    fontSize: 10,
    color: '#9ca3af',
  },
});
