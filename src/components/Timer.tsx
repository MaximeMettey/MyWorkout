import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, IconButton, useTheme } from 'react-native-paper';

interface TimerProps {
  duration: number; // en secondes
  onComplete?: () => void;
  autoStart?: boolean;
}

export const Timer: React.FC<TimerProps> = ({
  duration,
  onComplete,
  autoStart = false,
}) => {
  const theme = useTheme();
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(autoStart);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            onComplete?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, onComplete]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setTimeLeft(duration);
    setIsRunning(false);
  };

  const progress = 1 - timeLeft / duration;
  const isNearEnd = timeLeft <= 10 && timeLeft > 0;

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.timerCircle,
          {
            borderColor: isNearEnd ? theme.colors.error : theme.colors.primary,
          },
        ]}
      >
        <Text
          variant="displaySmall"
          style={[
            styles.timeText,
            { color: isNearEnd ? theme.colors.error : theme.colors.primary },
          ]}
        >
          {formatTime(timeLeft)}
        </Text>
      </View>
      <View style={styles.controls}>
        <IconButton
          icon={isRunning ? 'pause' : 'play'}
          size={32}
          onPress={handlePlayPause}
          iconColor={theme.colors.primary}
        />
        <IconButton
          icon="refresh"
          size={32}
          onPress={handleReset}
          iconColor={theme.colors.secondary}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 16,
  },
  timerCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  timeText: {
    fontWeight: 'bold',
  },
  controls: {
    flexDirection: 'row',
    gap: 16,
  },
});
