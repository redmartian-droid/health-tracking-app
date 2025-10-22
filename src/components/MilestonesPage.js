import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function MilestonesPage({ milestones, totalPoints }) {
  const completedCount = milestones.filter((m) => m.completed).length;
  const inProgressCount = milestones.filter((m) => !m.completed).length;
  const nearCompletionCount = milestones.filter(
    (m) => !m.completed && m.current / m.target > 0.8
  ).length;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Milestones & Progress</Text>

        <View style={styles.overviewCard}>
          <Text style={styles.overviewTitle}>Milestone Progress</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{completedCount}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{inProgressCount}</Text>
              <Text style={styles.statLabel}>In Progress</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{nearCompletionCount}</Text>
              <Text style={styles.statLabel}>Almost There</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionsContainer}>
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="checkmark-circle" size={24} color="#22c55e" />
              <Text style={styles.sectionTitle}>Completed Milestones</Text>
            </View>

            {milestones.filter((m) => m.completed).length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="checkmark-circle-outline" size={64} color="#d1d5db" />
                <Text style={styles.emptyTitle}>No milestones completed yet</Text>
                <Text style={styles.emptySubtitle}>
                  Keep working to achieve your first milestone!
                </Text>
              </View>
            ) : (
              milestones
                .filter((m) => m.completed)
                .map((milestone) => (
                  <View key={milestone.id} style={styles.completedMilestone}>
                    <View style={styles.milestoneIcon}>
                      <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
                    </View>
                    <View style={styles.milestoneContent}>
                      <Text style={styles.milestoneName}>{milestone.title}</Text>
                      <Text style={styles.milestoneTarget}>
                        Target: {milestone.target.toLocaleString()} {milestone.type}
                      </Text>
                      <Text style={styles.milestoneAchieved}>✓ Milestone achieved!</Text>
                    </View>
                  </View>
                ))
            )}
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="trending-up" size={24} color="#3b82f6" />
              <Text style={styles.sectionTitle}>In Progress</Text>
            </View>

            {milestones.filter((m) => !m.completed).length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="flag-outline" size={64} color="#d1d5db" />
                <Text style={styles.emptyTitle}>All milestones completed!</Text>
                <Text style={styles.emptySubtitle}>
                  Amazing work! You've achieved everything!
                </Text>
              </View>
            ) : (
              milestones
                .filter((m) => !m.completed)
                .map((milestone) => {
                  const progress = (milestone.current / milestone.target) * 100;
                  const isNearCompletion = progress > 80;

                  return (
                    <View
                      key={milestone.id}
                      style={[
                        styles.inProgressMilestone,
                        isNearCompletion && styles.nearCompletion,
                      ]}
                    >
                      <View style={styles.milestoneHeader}>
                        <Text style={styles.milestoneName}>{milestone.title}</Text>
                        {isNearCompletion && (
                          <View style={styles.almostBadge}>
                            <Text style={styles.almostBadgeText}>Almost there!</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.milestoneTarget}>
                        Target: {milestone.target.toLocaleString()} {milestone.type}
                      </Text>
                      <View style={styles.progressSection}>
                        <View style={styles.progressInfo}>
                          <Text style={styles.progressLabel}>
                            Current: {milestone.current.toLocaleString()}
                          </Text>
                          <Text style={styles.progressLabel}>
                            Goal: {milestone.target.toLocaleString()}
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
                        <View style={styles.progressFooter}>
                          <Text style={styles.progressPercent}>
                            {Math.round(progress)}% complete
                          </Text>
                          <Text style={styles.progressRemaining}>
                            {(milestone.target - milestone.current).toLocaleString()}{' '}
                            remaining
                          </Text>
                        </View>
                      </View>
                    </View>
                  );
                })
            )}
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
  overviewCard: {
    backgroundColor: '#e5e7eb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  overviewTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
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
  },
  sectionsContainer: {
    gap: 16,
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
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
  completedMilestone: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 12,
  },
  milestoneIcon: {
    backgroundColor: '#d1d5db',
    borderRadius: 20,
    padding: 8,
  },
  milestoneContent: {
    flex: 1,
  },
  milestoneName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  milestoneTarget: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  milestoneAchieved: {
    fontSize: 10,
    color: '#9ca3af',
    marginTop: 4,
  },
  inProgressMilestone: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  nearCompletion: {
    backgroundColor: '#e5e7eb',
  },
  milestoneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  almostBadge: {
    backgroundColor: '#d1d5db',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  almostBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#1f2937',
  },
  progressSection: {
    marginTop: 12,
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
  progressFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressPercent: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1f2937',
  },
  progressRemaining: {
    fontSize: 10,
    color: '#9ca3af',
  },
});
