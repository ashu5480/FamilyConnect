import { Text, StyleSheet, ViewStyle, Pressable } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { colors, spacing, borderRadius, animation } from '../../constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  loading?: boolean;
  disabled?: boolean;
  hint?: string;
  style?: ViewStyle;
}

// Spring press feedback (120-200ms), loading guard against double submit.
export function Button({ title, onPress, variant = 'primary', loading, disabled, hint, style }: ButtonProps) {
  const scale = useSharedValue(1);
  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  const inactive = disabled || loading;
  return (
    <Animated.View style={[pressStyle, style]}>
      <Pressable
        style={[styles.base, styles[variant], inactive && styles.inactive]}
        onPress={inactive ? undefined : onPress}
        onPressIn={() => { scale.value = withSpring(animation.pressScale, animation.spring); }}
        onPressOut={() => { scale.value = withSpring(1, animation.spring); }}
        accessibilityRole="button"
        accessibilityState={{ disabled: !!inactive, busy: !!loading }}
        accessibilityHint={hint}
        disabled={!!inactive}
      >
        <Text style={[styles.label, styles[`label_${variant}`]]}>
          {loading ? 'Please wait…' : title}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.md,
    paddingVertical: 16,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 54,
  },
  inactive: { opacity: 0.55 },
  primary: { backgroundColor: colors.primary },
  secondary: { backgroundColor: colors.primaryLight },
  outline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.primary },
  ghost: { backgroundColor: 'transparent' },
  danger: { backgroundColor: colors.error },
  label: { fontSize: 16, fontWeight: '700' },
  label_primary: { color: '#FFFFFF' },
  label_secondary: { color: colors.primaryDark },
  label_outline: { color: colors.primary },
  label_ghost: { color: colors.primary },
  label_danger: { color: '#FFFFFF' },
});
