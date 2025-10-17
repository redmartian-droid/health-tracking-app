import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function MilestonesPage({ milestones, totalPoints, completeMilestone }) {
  const getIconForType = (type) => {
    switch (type) {
      case 'steps': return 'directions-walk';
      case 'heart': return 'favorite';
      case 'medicine': return 'medication';
      default: return 'emoji-events';
    }
  };

  const getColorForType = (type) => {
    switch (type) {
      case 'steps': return '#10b981';
      case 'heart': return '#ef4444';
      case 'medicine': return '#3b82f6';
      default: return '#f59e0b';
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Milestones</Text>
        <View style={styles.pointsContainer}>
          <Icon name="stars" size={20} color="#f59e0b" />
          <Text style={styles.pointsText}>{totalPoints} points</Text>
        </View>
      </View>

      {/* Milestones List */}
      {milestones.map(milestone => {
        const progress = Math.min((milestone.current / milestone.target) * 100, 100);
        const iconName = getIconForType(milestone.type);
        const color = getColorForType(milestone.type);

        return (
          <View key={milestone.id} style={styles.milestoneCard}>
            <View style={styles.milestoneHeader}>
              <View style={styles.milestoneIconContainer}>
                <Icon name={iconName} size={24} color={color} />
              </View>
              <View style={styles.milestoneInfo}>
                <Text style={styles.milestoneTitle}>{milestone.title}</Text>
                <Text style={styles.milestoneProgress}>
                  {milestone.current} / {milestone.target}
                </Text>
              </View>
              <View style={styles.rewardContainer}>
                <Icon name="stars" size={16} color="#f59e0b" />
                <Text style={styles.rewardText}>{milestone.reward}</Text>
              </View>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${progress}%`, backgroundColor: color }
                  ]} 
                />
              </View>
              <Text style={styles.progressText}>{progress.toFixed(0)}%</Text>
            </View>

            {/* Complete Button */}
            {milestone.completed ? (
              <View style={styles.completedContainer}>
                <Icon name="check-circle" size={20} color="#10b981" />
                <Text style={styles.completedText}>Completed!</Text>
              </View>
            ) : progress >= 100 ? (
              <TouchableOpacity
                style={styles.completeButton}
                onPress={() => completeMilestone(milestone.id)}
              >
                <Text style={styles.completeButtonText}>Claim Reward</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.inProgressContainer}>
                <Text style={styles.inProgressText}>In Progress</Text>
              </View>
            )}
          </View>
        );
      })}

      {/* Achievement Stats */}
      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>Achievement Stats</Text>
        
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Completed Milestones</Text>
          <Text style={styles.statValue}>
            {milestones.filter(m => m.completed).length} / {milestones.length}
          </Text>
        </View>

        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Total Points Earned</Text>
          <Text style={styles.statValue}>{totalPoints}</Text>
        </View>

        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Completion Rate</Text>
          <Text style={styles.statValue}>
            {((milestones.filter(m => m.completed).length / milestones.length) * 100).toFixed(0)}%
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
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
  milestoneCard: {
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
  milestoneHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  milestoneIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  milestoneInfo: {
    flex: 1,
  },
  milestoneTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  milestoneProgress: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  rewardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  rewardText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400e',
    marginLeft: 4,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 4,
    marginRight: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '600',
    width: 35,
    textAlign: 'right',
  },
  completedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  completedText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10b981',
    marginLeft: 8,
  },
  completeButton: {
    backgroundColor: '#10b981',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  inProgressContainer: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  inProgressText: {
    fontSize: 14,
    color: '#6b7280',
  },
  statsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
});
