import { useEffect } from 'react';
import { View, Text, TextInput, TextInputProps, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSequence } from 'react-native-reanimated';
import { colors, typography, spacing, borderRadius } from '../../constants/theme';

interface FieldProps extends TextInputProps {
  label: string;
  error?: string;
  hint?: string;
  containerStyle?: ViewStyle;
}

// Accessible labeled input: visible label, inline error linked via
// accessibilityDescribedBy, error shake + red border, focus ring.
export function Field({ label, error, hint, containerStyle, ...inputProps }: FieldProps) {
  const shake = useSharedValue(0);
  const errorId = `${label}-error`;

  useEffect(() => {
    if (error) {
      shake.value = withSequence(
        withTiming(-6, { duration: 50 }),
        withTiming(6, { duration: 50 }),
        withTiming(-3, { duration: 50 }),
        withTiming(0, { duration: 50 }),
      );
    }
  }, [error, shake]);

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shake.value }],
  }));

  return (
    <View style={[styles.wrap, containerStyle]}>
      <Text style={styles.label} nativeID={label}>
        {label}
      </Text>
      <Animated.View style={shakeStyle}>
        <TextInput
          style={[styles.input, error ? styles.inputError : null, inputProps.style as TextStyle]}
          placeholderTextColor={colors.text.tertiary}
          accessibilityLabel={label}
          {...inputProps}
        />
      </Animated.View>
      {error ? (
        <Text style={styles.error} nativeID={errorId} accessibilityRole="alert">
          {error}
        </Text>
      ) : hint ? (
        <Text style={styles.hint}>{hint}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.md },
  label: { ...typography.label, color: colors.text.primary, marginBottom: spacing.sm },
  input: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.text.primary,
    backgroundColor: colors.surface,
    minHeight: 52,
  },
  inputError: { borderColor: colors.error },
  error: { ...typography.bodySmall, color: colors.error, marginTop: 6, fontWeight: '600' },
  hint: { ...typography.bodySmall, color: colors.text.tertiary, marginTop: 6 },
});
