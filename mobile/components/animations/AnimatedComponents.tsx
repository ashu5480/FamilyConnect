import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, Easing } from 'react-native-reanimated';
import { Motion } from './Motion';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export interface AnimatedButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  animation?: 'spring' | 'scale' | 'none';
}

export function AnimatedButton({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  icon,
  style,
  textStyle,
  animation = 'spring',
}: AnimatedButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (animation === 'spring') {
      scale.value = withSpring(0.96, { damping: 15, stiffness: 300 });
    } else if (animation === 'scale') {
      scale.value = withTiming(0.96, { duration: 100 });
    }
  };

  const handlePressOut = () => {
    if (animation === 'spring') {
      scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    } else if (animation === 'scale') {
      scale.value = withTiming(1, { duration: 100 });
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return styles.primary;
      case 'secondary':
        return styles.secondary;
      case 'outline':
        return styles.outline;
      case 'ghost':
        return styles.ghost;
      default:
        return styles.primary;
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return styles.small;
      case 'medium':
        return styles.medium;
      case 'large':
        return styles.large;
      default:
        return styles.medium;
    }
  };

  const getTextStyles = () => {
    switch (variant) {
      case 'primary':
        return styles.primaryText;
      case 'secondary':
        return styles.secondaryText;
      case 'outline':
        return styles.outlineText;
      case 'ghost':
        return styles.ghostText;
      default:
        return styles.primaryText;
    }
  };

  return (
    <AnimatedTouchable
      style={[
        styles.button,
        getVariantStyles(),
        getSizeStyles(),
        animatedStyle,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#FFFFFF' : '#E91E63'} />
      ) : (
        <>
          {icon}
          <Text style={[getTextStyles(), textStyle]}>{title}</Text>
        </>
      )}
    </AnimatedTouchable>
  );
}

export interface AnimatedCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  preset?: 'fadeIn' | 'fadeInUp' | 'fadeInDown' | 'zoomIn' | 'bounceIn';
  delay?: number;
  duration?: number;
}

export function AnimatedCard({
  children,
  onPress,
  style,
  preset = 'fadeInUp',
  delay = 0,
  duration = 500,
}: AnimatedCardProps) {
  const content = (
    <Animated.View style={[styles.card, style]}>
      {children}
    </Animated.View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
        <Motion preset={preset} delay={delay} duration={duration}>
          {content}
        </Motion>
      </TouchableOpacity>
    );
  }

  return (
    <Motion preset={preset} delay={delay} duration={duration}>
      {content}
    </Motion>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 8,
  },
  primary: {
    backgroundColor: '#E91E63',
  },
  secondary: {
    backgroundColor: '#FCE7F3',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#E91E63',
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  small: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  medium: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  large: {
    paddingVertical: 18,
    paddingHorizontal: 28,
  },
  disabled: {
    opacity: 0.5,
  },
  primaryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryText: {
    color: '#E91E63',
    fontSize: 16,
    fontWeight: '700',
  },
  outlineText: {
    color: '#E91E63',
    fontSize: 16,
    fontWeight: '700',
  },
  ghostText: {
    color: '#E91E63',
    fontSize: 16,
    fontWeight: '700',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    shadowOpacity: 0.08,
  },
});