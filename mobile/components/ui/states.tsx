import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Button } from './Button';
import { colors, typography, spacing, borderRadius } from '../../constants/theme';

interface EmptyStateProps {
  title: string;
  body: string;
  actionLabel?: string;
  onAction?: () => void;
}

// Honest empty states: what this is, what to do next, one action.
export function EmptyState({ title, body, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View style={styles.box} accessibilityRole="summary" accessibilityLabel={`${title}. ${body}`}>
      <View style={styles.mark}>
        <Text style={styles.glyph}>✦</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{body}</Text>
      {actionLabel && onAction ? (
        <Button title={actionLabel} onPress={onAction} variant="outline" style={{ marginTop: spacing.md }} />
      ) : null}
    </View>
  );
}

export function Skeleton({ height = 16, style }: { height?: number; style?: ViewStyle }) {
  return (
    <View
      style={[{ height, borderRadius: borderRadius.md, backgroundColor: colors.borderLight }, style]}
      accessibilityRole="progressbar"
      accessibilityLabel="Loading content"
    />
  );
}

export function Gutter({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return (
    <View style={[{ paddingHorizontal: spacing.gutter, width: '100%', maxWidth: 560, alignSelf: 'center' }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    alignItems: 'center',
    padding: spacing.xxl,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  mark: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.md,
  },
  glyph: { fontSize: 24, color: colors.primary },
  title: { ...typography.h4, color: colors.text.primary, marginBottom: 4, textAlign: 'center' },
  body: { ...typography.bodySmall, color: colors.text.secondary, textAlign: 'center' },
});
