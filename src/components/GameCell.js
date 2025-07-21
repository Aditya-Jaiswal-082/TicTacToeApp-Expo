import React, { useState } from 'react';
import { TouchableOpacity, Animated, Platform } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { AppStyles } from '../styles/app';
import * as Haptics from 'expo-haptics';

export default function GameCell({ index, value, size, onPress, isWinning, disabled }) {
  const theme = useTheme();
  const [scaleAnim] = useState(new Animated.Value(1));
  const [fadeAnim] = useState(new Animated.Value(0));

  React.useEffect(() => {
    if (value) {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [value]);

  React.useEffect(() => {
    if (isWinning && value) {
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch (error) {
        console.log('Haptics not supported');
      }

      const pulse = () => {
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]).start(() => {
          if (isWinning && value) {
            pulse();
          }
        });
      };
      pulse();
    }
  }, [isWinning]);

  const handlePress = () => {
    if (disabled || value !== null) return;
    
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      console.log('Haptics not supported');
    }

    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    onPress();
  };

  const getCellBackgroundColor = () => {
    if (isWinning) {
      return theme.colors.primaryContainer;
    }
    if (value === 'X') {
      return theme.colors.errorContainer;
    }
    if (value === 'O') {
      return theme.colors.tertiaryContainer;
    }
    return theme.colors.surface;
  };

  const getTextColor = () => {
    if (isWinning) {
      return theme.colors.primary;
    }
    if (value === 'X') {
      return theme.colors.error;
    }
    if (value === 'O') {
      return theme.colors.tertiary;
    }
    return theme.colors.onSurface;
  };

  const getBorderColor = () => {
    if (isWinning) {
      return theme.colors.primary;
    }
    if (value === 'X') {
      return theme.colors.error;
    }
    if (value === 'O') {
      return theme.colors.tertiary;
    }
    return theme.colors.outline;
  };

  const cellStyle = [
    AppStyles.gameCell,
    {
      width: size,
      height: size,
      backgroundColor: getCellBackgroundColor(),
      borderColor: getBorderColor(),
      opacity: disabled && !value ? 0.5 : 1,
      ...(Platform.OS === 'web' && !disabled && !value && {
        cursor: 'pointer',
      }),
    }
  ];

  const textStyle = [
    AppStyles.gameCellText,
    {
      color: getTextColor(),
      fontSize: size * 0.35,
      textShadowColor: Platform.select({
        ios: theme.colors.shadow,
        android: theme.colors.shadow,
        web: 'rgba(0,0,0,0.2)',
        default: theme.colors.shadow,
      }),
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
    }
  ];

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={cellStyle}
        onPress={handlePress}
        disabled={disabled || value !== null}
        activeOpacity={0.8}
        onMouseEnter={Platform.OS === 'web' ? (e) => {
          if (!disabled && !value) {
            e.target.style.transform = 'scale(1.05)';
            e.target.style.transition = 'transform 0.2s ease';
          }
        } : undefined}
        onMouseLeave={Platform.OS === 'web' ? (e) => {
          if (!disabled && !value) {
            e.target.style.transform = 'scale(1)';
          }
        } : undefined}
      >
        <Animated.View style={{ opacity: value ? fadeAnim : 1 }}>
          <Text style={textStyle}>
            {value || ''}
          </Text>
        </Animated.View>
        
        {!value && !disabled && (
          <Animated.View 
            style={[
              AppStyles.gameCellEmptyIndicator,
              {
                opacity: 0.3,
                backgroundColor: theme.colors.onSurface,
              }
            ]}
          />
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}
