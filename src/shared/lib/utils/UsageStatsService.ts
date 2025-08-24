import { NativeModules, NativeEventEmitter, Platform } from 'react-native';

export interface UsageStats {
  usageMinutes: number;
  usageSeconds: number;
  thresholdMinutes: number;
  thresholdSeconds: number;
  shouldBlock: boolean;
  isDevelopmentMode: boolean;
}

interface UsageStatistics {
  totalBlocks: number;
  totalLearningTime: number;
  averageSessionTime: number;
}

const { UsageStatsModule } = NativeModules;

class UsageStatsService {
  private eventEmitter: NativeEventEmitter | null = null;
  private listeners: { [key: string]: any } = {};

  constructor() {
    if (Platform.OS === 'android' && UsageStatsModule) {
      this.eventEmitter = new NativeEventEmitter(UsageStatsModule);
    }
  }

  /**
   * Check if the app has usage stats permission
   */
  async hasPermission(): Promise<boolean> {
    if (Platform.OS !== 'android' || !UsageStatsModule) {
      return false;
    }

    try {
      return await UsageStatsModule.hasUsageStatsPermission();
    } catch (error) {
      console.error('Error checking usage stats permission:', error);
      return false;
    }
  }

  /**
   * Request usage stats permission
   */
  async requestPermission(): Promise<void> {
    if (Platform.OS !== 'android' || !UsageStatsModule) {
      throw new Error('Usage stats only available on Android');
    }

    try {
      await UsageStatsModule.requestUsageStatsPermission();
    } catch (error) {
      console.error('Error requesting usage stats permission:', error);
      throw error;
    }
  }

  /**
   * Enable development mode with shorter intervals
   */
  setDevelopmentMode(enabled: boolean, thresholdSeconds: number = 5): void {
    if (Platform.OS !== 'android' || !UsageStatsModule) {
      return;
    }

    UsageStatsModule.setDevelopmentMode(enabled, thresholdSeconds);
  }

  /**
   * Set blocking threshold in minutes
   */
  setBlockThreshold(minutes: number): void {
    if (Platform.OS !== 'android' || !UsageStatsModule) {
      return;
    }

    UsageStatsModule.setBlockThreshold(minutes);
  }

  /**
   * Get current usage stats
   */
  async getCurrentUsage(): Promise<UsageStats> {
    if (Platform.OS !== 'android' || !UsageStatsModule) {
      return {
        usageMinutes: 0,
        usageSeconds: 0,
        thresholdMinutes: 30,
        thresholdSeconds: 30 * 60,
        shouldBlock: false,
        isDevelopmentMode: false,
      };
    }

    try {
      return await UsageStatsModule.getCurrentUsage();
    } catch (error) {
      console.error('Error getting current usage:', error);
      throw error;
    }
  }

  /**
   * Start monitoring usage
   */
  startMonitoring(): void {
    if (Platform.OS !== 'android' || !UsageStatsModule) {
      return;
    }

    UsageStatsModule.startUsageMonitoring();
  }

  /**
   * Reset usage tracking (call after learning session)
   */
  resetUsageTracking(): void {
    if (Platform.OS !== 'android' || !UsageStatsModule) {
      return;
    }

    UsageStatsModule.resetUsageTracking();
  }

  /**
   * Get usage statistics for stats screen
   */
  async getUsageStatistics(): Promise<UsageStatistics> {
    if (Platform.OS !== 'android' || !UsageStatsModule) {
      return {
        totalBlocks: 0,
        totalLearningTime: 0,
        averageSessionTime: 0,
      };
    }

    try {
      return await UsageStatsModule.getUsageStatistics();
    } catch (error) {
      console.error('Error getting usage statistics:', error);
      throw error;
    }
  }

  /**
   * Listen for block screen events
   */
  onShouldShowBlockScreen(callback: (data: any) => void): () => void {
    if (Platform.OS !== 'android' || !this.eventEmitter) {
      return () => {};
    }

    const listener = this.eventEmitter.addListener(
      'shouldShowBlockScreen',
      callback,
    );
    this.listeners['shouldShowBlockScreen'] = listener;

    return () => {
      listener?.remove();
      delete this.listeners['shouldShowBlockScreen'];
    };
  }

  /**
   * Listen for usage stats errors
   */
  onUsageStatsError(callback: (error: string) => void): () => void {
    if (Platform.OS !== 'android' || !this.eventEmitter) {
      return () => {};
    }

    const listener = this.eventEmitter.addListener('usageStatsError', callback);
    this.listeners['usageStatsError'] = listener;

    return () => {
      listener?.remove();
      delete this.listeners['usageStatsError'];
    };
  }

  /**
   * Clean up all listeners
   */
  removeAllListeners(): void {
    Object.values(this.listeners).forEach(listener => {
      listener?.remove();
    });
    this.listeners = {};
  }

  /**
   * Get available blocking intervals for development
   */
  getDevelopmentIntervals(): { label: string; value: number }[] {
    return [
      { label: '5 seconds', value: 5 },
      { label: '10 seconds', value: 10 },
      { label: '30 seconds', value: 30 },
      { label: '1 minute', value: 60 },
      { label: '2 minutes', value: 120 },
    ];
  }

  /**
   * Get available blocking intervals
   */
  getBlockingIntervals(): { label: string; value: number }[] {
    return [
      { label: '15 minutes', value: 15 },
      { label: '20 minutes', value: 20 },
      { label: '30 minutes', value: 30 },
      { label: '60 minutes', value: 60 },
      { label: '1 day', value: 24 * 60 },
    ];
  }
}

export default new UsageStatsService();
