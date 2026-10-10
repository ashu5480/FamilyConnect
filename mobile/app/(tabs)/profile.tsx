import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { Motion, MotionGroup } from '../../components/animations';
import { Button } from '../../components/ui/Button';
import { Skeleton, Gutter } from '../../components/ui/states';
import { colors, typography, spacing, borderRadius, animation } from '../../constants/theme';

export default function ProfileScreen() {
  const { user, family, role, logout, refreshUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    refreshUser().finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    Alert.alert('Log out?', 'You’ll need to sign in again on this device.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/welcome');
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.root}>
        <Gutter style={styles.content}>
          <Skeleton height={100} style={{ width: 100, borderRadius: 50, alignSelf: 'center', marginTop: 60 }} />
          <Skeleton height={28} style={{ width: '55%', alignSelf: 'center', marginTop: 16 }} />
          <Skeleton height={140} style={{ marginTop: 24 }} />
        </Gutter>
      </View>
    );
  }

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.scrollContent}>
      <Gutter style={styles.content}>
        <Motion preset="fadeInDown" duration={animation.duration.fast}>
          <View style={styles.header}>
            <View style={styles.avatar} accessibilityRole="image" accessibilityLabel={user?.name || 'User avatar'}>
              <Text style={styles.avatarText}>
                {user?.name?.charAt(0).toUpperCase() || '?'}
              </Text>
            </View>
            <Text style={styles.name}>{user?.name || 'User'}</Text>
            <Text style={styles.email}>{user?.email || ''}</Text>
            {user?.relationship ? <Text style={styles.relationship}>{user.relationship}</Text> : null}
            {role ? (
              <View style={styles.roleBadge}>
                <Text style={styles.roleText}>{role}</Text>
              </View>
            ) : null}
          </View>
        </Motion>

        <Motion preset="fadeInUp" delay={100} duration={animation.duration.normal}>
          <View style={styles.familyCard}>
            <Text style={styles.familyLabel}>Family</Text>
            <Text style={styles.familyName}>{family?.name || 'No Family'}</Text>
          </View>
        </Motion>

        <MotionGroup preset="fadeInUp" stagger={animation.stagger.fast} duration={animation.duration.fast} delay={200}>
          <View style={styles.actions}>
            <ActionItem label="Edit Profile" glyph="✎" onPress={() => router.push('/profile/edit' as any)} />
            <ActionItem label="Family Members" glyph="○" onPress={() => router.push('/family/members' as any)} />
            <ActionItem label="Settings" glyph="⚙" onPress={() => router.push('/settings' as any)} />
            <ActionItem label="Notifications" glyph="✉" onPress={() => router.push('/notifications' as any)} />
            <ActionItem label="My Cutouts" glyph="⬡" onPress={() => router.push('/cutouts' as any)} />
          </View>
        </MotionGroup>

        <Motion preset="fadeInUp" delay={420} duration={animation.duration.normal}>
          <Button title="Log Out" onPress={handleLogout} variant="outline" hint="Sign out of this device" />
        </Motion>

        <Text style={styles.version}>FamilyConnect v1.0.0</Text>
      </Gutter>
    </ScrollView>
  );
}

function ActionItem({ label, glyph, onPress }: { label: string; glyph: string; onPress: () => void }) {
  return (
    <Pressable style={styles.actionRow} onPress={onPress} accessibilityRole="button" accessibilityLabel={label}>
      <View style={styles.actionGlyphBox}>
        <Text style={styles.actionGlyph}>{glyph}</Text>
      </View>
      <Text style={styles.actionLabel}>{label}</Text>
      <Text style={styles.actionArrow}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: { paddingTop: 72, paddingBottom: 48 },
  scrollContent: { paddingBottom: 48 },
  header: { alignItems: 'center', marginBottom: spacing.xxl },
  avatar: {
    width: 96, height: 96, borderRadius: 48,
    backgroundColor: colors.primaryDark,
    justifyContent: 'center', alignItems: 'center', marginBottom: spacing.md,
  },
  avatarText: { color: '#FFFFFF', fontSize: 38, fontWeight: '800' },
  name: { ...typography.h2, color: colors.text.primary, marginBottom: 2, textAlign: 'center' },
  email: { ...typography.bodySmall, color: colors.text.secondary, marginBottom: 2 },
  relationship: { ...typography.bodySmall, color: colors.text.tertiary, marginBottom: spacing.sm },
  roleBadge: { backgroundColor: colors.primaryLight, paddingHorizontal: 14, paddingVertical: 5, borderRadius: 999, marginTop: spacing.sm },
  roleText: { fontSize: 11, color: colors.primaryDark, fontWeight: '800', letterSpacing: 1 },
  familyCard: {
    backgroundColor: colors.surface, borderRadius: 16, padding: spacing.xl,
    borderWidth: 1, borderColor: colors.borderLight, marginBottom: spacing.xl,
  },
  familyLabel: { ...typography.eyebrow, color: colors.primary },
  familyName: { ...typography.h3, color: colors.text.primary, marginTop: 6 },
  actions: {
    backgroundColor: colors.surface, borderRadius: 16, overflow: 'hidden',
    borderWidth: 1, borderColor: colors.borderLight, marginBottom: spacing.xl,
  },
  actionRow: { flexDirection: 'row', alignItems: 'center', padding: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.borderLight, minHeight: 60 },
  actionGlyphBox: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: colors.primaryLight,
    alignItems: 'center', justifyContent: 'center', marginRight: spacing.md,
  },
  actionGlyph: { fontSize: 16, color: colors.primary, fontWeight: '700' },
  actionLabel: { flex: 1, fontSize: 16, color: colors.text.primary, fontWeight: '500' },
  actionArrow: { fontSize: 22, color: colors.text.tertiary },
  version: { textAlign: 'center', color: colors.text.tertiary, fontSize: 12, marginTop: spacing.lg },
});