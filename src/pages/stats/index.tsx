import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  Animated,
} from 'react-native';
import { LearningStatsRepository } from '@/entity/statistics/repository';
import { LearningStats } from '@/entity/statistics/interface';
import { theme } from '@/shared/constants/theme';

type StatCardProps = {
  title: string;
  value: string;
  subtitle: string;
  icon: string;
  color: string;
};

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color,
}) => (
  <View style={[styles.statCard, { borderColor: color + '30' }]}>
    <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
      <Text style={[styles.iconText, { color }]}>{icon}</Text>
    </View>
    <View style={styles.statContent}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={styles.statSubtitle}>{subtitle}</Text>
    </View>
  </View>
);

type ProgressBarProps = {
  progress: number;
  color: string;
  label: string;
  value: string;
  maxValue: string;
};

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color,
  label,
  value,
  maxValue,
}) => {
  const [animatedValue] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: progress,
      duration: 1500,
      useNativeDriver: false,
    }).start();
  }, [progress, animatedValue]);

  return (
    <View style={styles.progressBarContainer}>
      <View style={styles.progressBarHeader}>
        <Text style={styles.progressBarLabel}>{label}</Text>
        <Text style={styles.progressBarValue}>
          {value} / {maxValue}
        </Text>
      </View>
      <View style={styles.progressBarTrack}>
        <Animated.View
          style={[
            styles.progressBarFill,
            {
              backgroundColor: color,
              width: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>
      <Text style={styles.progressBarPercentage}>
        {Math.round(progress * 100)}% complete
      </Text>
    </View>
  );
};

type CircularProgressProps = {
  progress: number;
  size: number;
  color: string;
  label: string;
  value: number;
  maxValue: number;
};

const CircularProgress: React.FC<CircularProgressProps> = ({
  progress,
  size,
  color,
  label,
  value,
  maxValue,
}) => {
  const [animatedValue] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: progress,
      duration: 2000,
      useNativeDriver: false,
    }).start();
  }, [progress, animatedValue]);

  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <View style={styles.circularProgressContainer}>
      <View
        style={[styles.circularProgressWrapper, { width: size, height: size }]}
      >
        <View
          style={[
            styles.circularProgressBg,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              borderWidth: strokeWidth,
              borderColor: color + '20',
            },
          ]}
        />

        <View style={styles.circularProgressOverlay}>
          <Text style={styles.circularProgressText}>
            {value}/{maxValue}
          </Text>
          <Text
            style={[
              styles.circularProgressText,
              { fontSize: 14, marginTop: 4 },
            ]}
          >
            ({Math.round(progress * 100)}%)
          </Text>
        </View>
      </View>
      <Text style={styles.circularProgressLabel}>{label}</Text>
    </View>
  );
};

const LearningStatsScreen: React.FC = () => {
  const [stats, setStats] = useState<LearningStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  console.log('Stats', stats);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      await LearningStatsRepository.ensureDefault();
      const learningStats = await LearningStatsRepository.get();
      setStats(learningStats);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadStats();
  };

  const getProgressToGoal = (): number => {
    const goal = 50000; // 50K words goal
    const progress = stats?.learned_words_count || 0;
    return Math.min(progress / goal, 1);
  };

  const getTimeProgressToGoal = (): number => {
    const goal = 10000; // 10K minutes goal (166+ hours)
    const progress = stats?.time_spent || 0;
    return Math.min(progress / goal, 1);
  };

  const getDaysStudied = (): number => {
    const totalMinutes = stats?.time_spent || 0;
    return Math.max(1, Math.floor(totalMinutes / 30));
  };

  const getWordsPerDay = (): number => {
    const totalWords = stats?.learned_words_count || 0;
    const days = getDaysStudied();
    return Math.round(totalWords / days);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading your progress...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={theme.colors.primary}
          colors={[theme.colors.primary]}
        />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Your Learning Journey</Text>
        <Text style={styles.subtitle}>Every word counts towards your goal</Text>
      </View>

      {/* Main Stats Cards */}
      <View style={styles.statsGrid}>
        <StatCard
          title="Words Mastered"
          value={stats?.learned_words_count?.toString() || '0'}
          subtitle="total learned"
          icon="🎯"
          color={theme.colors.primary}
        />
        <StatCard
          title="Study Time"
          value={
            stats?.time_spent
              ? (stats.time_spent / 60).toFixed(1) + ' min'
              : '0'
          }
          subtitle="total invested"
          icon="⏱️"
          color={theme.colors.yellow}
        />
      </View>

      {/* Secondary Stats */}
      <View style={styles.statsGrid}>
        <StatCard
          title="Days Active"
          value={getDaysStudied().toString()}
          subtitle="learning days"
          icon="📅"
          color={theme.colors.red}
        />
        <StatCard
          title="Daily Average"
          value={getWordsPerDay().toString()}
          subtitle="words per day"
          icon="📈"
          color={theme.colors.secondary}
        />
      </View>

      {/* Last Activity */}
      <View style={styles.activityCard}>
        <View style={styles.activityHeader}>
          <Text style={styles.activityTitle}>Recent Activity</Text>
          <Text style={styles.activityIcon}>📚</Text>
        </View>
        <Text style={styles.lastLearnedText}>
          Last studied:{' '}
          <Text style={styles.lastLearnedDate}>
            {stats?.last_learned_at
              ? stats.last_learned_at.toString().split('T')[0]
              : '0'}
          </Text>
        </Text>
      </View>

      <View style={styles.progressContainer}>
        <Text style={styles.sectionTitle}>Goal Progress</Text>

        <ProgressBar
          progress={getProgressToGoal()}
          color={theme.colors.primary}
          label="Words Learning Goal"
          value={(stats?.learned_words_count || 0).toString()}
          maxValue="50K"
        />

        <ProgressBar
          progress={getTimeProgressToGoal()}
          color={theme.colors.yellow}
          label="Study Time Goal"
          value={(stats?.time_spent || 0).toString()}
          maxValue="167h"
        />
      </View>

      {/* Circular Progress */}
      <View style={styles.circularContainer}>
        <Text style={styles.sectionTitle}>Overall Progress</Text>
        <View style={styles.circularProgressRow}>
          <CircularProgress
            progress={getProgressToGoal()}
            size={120}
            color={theme.colors.primary}
            label="Words Goal"
            value={stats?.learned_words_count || 0}
            maxValue={50000}
          />
          <CircularProgress
            progress={getTimeProgressToGoal()}
            size={120}
            color={theme.colors.yellow}
            label="Time Goal"
            value={stats?.time_spent || 0}
            maxValue={167}
          />
        </View>
      </View>

      {/* Achievement Section */}
      <View style={styles.achievementCard}>
        <Text style={styles.achievementTitle}>🏆 Your Achievement</Text>
        <Text style={styles.achievementText}>
          You've mastered{' '}
          <Text style={styles.highlightText}>
            {stats?.learned_words_count || 0} words
          </Text>
          !
        </Text>
        <Text style={styles.achievementSubtext}>
          {(stats?.learned_words_count || 0) >= 10000
            ? "Outstanding! You're in the top tier of language learners."
            : (stats?.learned_words_count || 0) >= 5000
            ? "Impressive progress! You're building serious vocabulary skills."
            : (stats?.learned_words_count || 0) >= 1000
            ? "Great work! You're building a strong foundation."
            : 'Every word is progress! Keep up the momentum.'}
        </Text>
      </View>

      {/* Fun Stats */}
      <View style={styles.funStatsCard}>
        <Text style={styles.funStatsTitle}>📊 Fun Facts</Text>
        <View style={styles.funStatItem}>
          <Text style={styles.funStatLabel}>Average session time:</Text>
          <Text style={styles.funStatValue}>
            {Math.round((stats?.time_spent || 0) / getDaysStudied())} minutes
          </Text>
        </View>
        <View style={styles.funStatItem}>
          <Text style={styles.funStatLabel}>Words learned per hour:</Text>
          <Text style={styles.funStatValue}>
            {Math.round(
              (stats?.learned_words_count || 0) /
                Math.max(1, (stats?.time_spent || 0) / 60),
            )}
          </Text>
        </View>
        <View style={styles.funStatItem}>
          <Text style={styles.funStatLabel}>Estimated vocabulary level:</Text>
          <Text style={styles.funStatValue}>
            {(stats?.learned_words_count || 0) >= 10000
              ? 'Advanced'
              : (stats?.learned_words_count || 0) >= 5000
              ? 'Upper Intermediate'
              : (stats?.learned_words_count || 0) >= 2000
              ? 'Intermediate'
              : (stats?.learned_words_count || 0) >= 1000
              ? 'Pre-Intermediate'
              : 'Beginner+'}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    color: theme.colors.white,
    fontSize: 16,
    fontFamily: theme.fonts.medium,
    marginTop: 16,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  title: {
    fontSize: 32,
    fontFamily: theme.fonts.bold,
    color: theme.colors.white,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: theme.fonts.regular,
    color: theme.colors.secondary,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.white,
    marginBottom: 20,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    elevation: 4,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconText: {
    fontSize: 24,
  },
  statContent: {
    alignItems: 'flex-start',
  },
  statValue: {
    fontSize: 28,
    fontFamily: theme.fonts.bold,
    color: theme.colors.white,
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 16,
    fontFamily: theme.fonts.medium,
    color: theme.colors.white,
    marginBottom: 2,
  },
  statSubtitle: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: theme.colors.secondary,
  },
  activityCard: {
    marginHorizontal: 16,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: theme.colors.primary + '30',
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  activityTitle: {
    fontSize: 18,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.white,
  },
  activityIcon: {
    fontSize: 24,
  },
  lastLearnedText: {
    fontSize: 16,
    fontFamily: theme.fonts.regular,
    color: theme.colors.secondary,
  },
  lastLearnedDate: {
    color: theme.colors.primary,
    fontFamily: theme.fonts.medium,
  },
  motivationContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: theme.colors.primary + '15',
    borderRadius: 12,
  },
  motivationText: {
    fontSize: 14,
    fontFamily: theme.fonts.medium,
    color: theme.colors.primary,
    textAlign: 'center',
  },
  progressContainer: {
    marginHorizontal: 16,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  progressBarContainer: {
    marginBottom: 24,
  },
  progressBarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressBarLabel: {
    fontSize: 16,
    fontFamily: theme.fonts.medium,
    color: theme.colors.white,
  },
  progressBarValue: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: theme.colors.secondary,
  },
  progressBarTrack: {
    height: 10,
    backgroundColor: theme.colors.background,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  progressBarPercentage: {
    fontSize: 12,
    fontFamily: theme.fonts.regular,
    color: theme.colors.secondary,
    marginTop: 4,
    textAlign: 'right',
  },
  circularContainer: {
    marginHorizontal: 16,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  circularProgressRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  circularProgressContainer: {
    alignItems: 'center',
  },
  circularProgressWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  circularProgressBg: {
    position: 'absolute',
  },
  circularProgressOverlay: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  circularProgressText: {
    fontSize: 18,
    fontFamily: theme.fonts.bold,
    color: theme.colors.white,
  },
  circularProgressLabel: {
    fontSize: 14,
    fontFamily: theme.fonts.medium,
    color: theme.colors.secondary,
    textAlign: 'center',
  },
  achievementCard: {
    marginHorizontal: 16,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.primary + '40',
  },
  achievementTitle: {
    fontSize: 22,
    fontFamily: theme.fonts.bold,
    color: theme.colors.white,
    marginBottom: 12,
  },
  achievementText: {
    fontSize: 18,
    fontFamily: theme.fonts.medium,
    color: theme.colors.white,
    textAlign: 'center',
    marginBottom: 8,
  },
  highlightText: {
    color: theme.colors.primary,
    fontFamily: theme.fonts.bold,
  },
  achievementSubtext: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: theme.colors.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  funStatsCard: {
    marginHorizontal: 16,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: 20,
    padding: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: theme.colors.yellow + '30',
  },
  funStatsTitle: {
    fontSize: 18,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.white,
    marginBottom: 16,
    textAlign: 'center',
  },
  funStatItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  funStatLabel: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: theme.colors.secondary,
    flex: 1,
  },
  funStatValue: {
    fontSize: 14,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.yellow,
  },
});

export default LearningStatsScreen;
