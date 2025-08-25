import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from 'react';
import { NativeModules, NativeEventEmitter, AppState } from 'react-native';

const { AppBlocker } = NativeModules;
const AppBlockerEvents = new NativeEventEmitter(AppBlocker);

// Define the shape of our context data
interface BlockingContextType {
  isServiceActive: boolean;
  isBlocked: boolean;
  remainingSeconds: number;
  startBlocking: (minutes: number) => void;
  stopBlocking: () => void;
}

// Create the context with a default value
const BlockingContext = createContext<BlockingContextType | undefined>(
  undefined,
);

// Create the Provider component
export const BlockingProvider = ({ children }: { children: ReactNode }) => {
  const [isServiceActive, setIsServiceActive] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  const syncStateWithNative = async () => {
    try {
      const status: 'INACTIVE' | 'COUNTING_DOWN' | 'BLOCKING' =
        await AppBlocker.getServiceStatus();
      console.log('Syncing state, native module status:', status);

      if (status === 'BLOCKING') {
        setIsServiceActive(false);
        setIsBlocked(true);
      } else if (status === 'COUNTING_DOWN') {
        // We don't know the exact time, but we know it's active.
        // The next countdown tick event will correct the time.
        setIsServiceActive(true);
        setIsBlocked(false);
      } else {
        // INACTIVE
        setIsServiceActive(false);
        setIsBlocked(false);
      }
    } catch (e) {
      console.error('Failed to sync state with native module', e);
    }
  };

  useEffect(() => {
    syncStateWithNative();

    const appStateSubscription = AppState.addEventListener(
      'change',
      nextAppState => {
        if (nextAppState === 'active') {
          console.log('App has come to the foreground, syncing state...');
          syncStateWithNative();
        }
      },
    );
    // Set up the listener for countdown ticks from the native service
    const countdownSubscription = AppBlockerEvents.addListener(
      'onCountdownTick',
      (event: { remainingSeconds: number }) => {
        if (event.remainingSeconds > 0) {
          setIsServiceActive(true);
          setIsBlocked(false);
          setRemainingSeconds(event.remainingSeconds);
        } else {
          // Countdown finished, time to block!
          setIsServiceActive(false);
          setRemainingSeconds(0);
          setIsBlocked(true);
        }
      },
    );
    const blockingStartedSubscription = AppBlockerEvents.addListener(
      'onBlockingStarted',
      () => {
        console.log('Received onBlockingStarted event! Updating state.');
        setIsServiceActive(false); // The countdown part of the service is done
        setRemainingSeconds(0);
        setIsBlocked(true); // Set the app to blocked!
      },
    );

    // Clean up the listener when the component unmounts
    return () => {
      countdownSubscription.remove();
      appStateSubscription.remove();
      blockingStartedSubscription.remove();
    };
  }, []);

  const startBlocking = (minutes: number) => {
    AppBlocker.startAppBlocking(minutes);
    setIsServiceActive(true);
    setRemainingSeconds(minutes * 60); // Set initial time immediately for better UX
    setIsBlocked(false);
  };

  const stopBlocking = () => {
    AppBlocker.stopAppBlocking();
    setIsServiceActive(false);
    setIsBlocked(false);
    setRemainingSeconds(0);
  };

  const value = {
    isServiceActive,
    isBlocked,
    remainingSeconds,
    startBlocking,
    stopBlocking,
  };

  return (
    <BlockingContext.Provider value={value}>
      {children}
    </BlockingContext.Provider>
  );
};

// Create a custom hook for easy access to the context
export const useBlocking = () => {
  const context = useContext(BlockingContext);
  if (context === undefined) {
    throw new Error('useBlocking must be used within a BlockingProvider');
  }
  return context;
};
