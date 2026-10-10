import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { Motion, MotionGroup } from '../../components/animations';
import { AnimatedCard, AnimatedButton } from '../../components/animations/AnimatedComponents';

export default function ProfileScreen() {
  const { user, family, role, logout, refreshUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    refreshUser().finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/welcome');
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#E91E63" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Motion preset="fadeInDown" duration={600}>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0).toUpperCase() || '?'}
            </Text>
          </View>
          <Text style={styles.name}>{user?.name || 'User'}</Text>
          <Text style={styles.email}>{user?.email || ''}</Text>
          {user?.relationship && <Text style={styles.relationship}>{user.relationship}</Text>}
          {role && <Text style={styles.roleBadge}>{role}</Text>}
        </View>
      </Motion>

      <Motion preset="fadeInUp" delay={100} duration={600}>
        <AnimatedCard style={styles.familyCard}>
          <Text style={styles.familyLabel}>Family</Text>
          <Text style={styles.familyName}>{family?.name || 'No Family'}</Text>
        </AnimatedCard>
      </Motion>

      <MotionGroup preset="fadeInUp" stagger={60} duration={500} delay={200}>
        <View style={styles.actions}>
          <ActionItem icon="👤" label="Edit Profile" onPress={() => router.push('/profile/edit' as any)} />
          <ActionItem icon="👨‍👩‍👧" label="Family Members" onPress={() => router.push('/family/members' as any)} />
          <ActionItem icon="⚙️" label="Settings" onPress={() => router.push('/settings' as any)} />
          <ActionItem icon="🔔" label="Notifications" onPress={() => router.push('/notifications' as any)} />
          <ActionItem icon="✂️" label="My Cutouts" onPress={() => router.push('/cutouts' as any)} />
          <ActionItem icon="❓" label="Help & Support" onPress={() => {}} />
        </View>
      </MotionGroup>

      <Motion preset="fadeInUp" delay={500} duration={600}>
        <AnimatedButton
          title="Logout"
          onPress={handleLogout}
          variant="outline"
          size="large"
          animation="spring"
        />
      </Motion>

      <Motion preset="fadeIn" delay={600} duration={600}>
        <Text style={styles.version}>FamilyConnect v1.0.0</Text>
      </Motion>
    </ScrollView>
  );
}

function ActionItem({ icon, label, onPress }: { icon: string; label: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.actionRow} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.actionIcon}>{icon}</Text>
      <Text style={styles.actionLabel}>{label}</Text>
      <Text style={styles.actionArrow}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F8' },
  content: { padding: 16, paddingTop: 80, paddingBottom: 48 },
  profileHeader: { alignItems: 'center', marginBottom: 32 },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#E91E63', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  avatarText: { color: '#FFFFFF', fontSize: 40, fontWeight: '800' },
  name: { fontSize: 28, fontWeight: '800', color: '#1F2937', marginBottom: 4 },
  email: { fontSize: 15, color: '#6B7280', marginBottom: 4 },
  relationship: { fontSize: 14, color: '#9CA3AF', marginBottom: 8 },
  roleBadge: { fontSize: 12, color: '#FFFFFF', backgroundColor: '#E91E63', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, overflow: 'hidden', fontWeight: '700' },
  familyCard: { marginBottom: 24 },
  familyLabel: { fontSize: 12, color: '#E91E63', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
  familyName: { fontSize: 20, fontWeight: '700', color: '#1F2937', marginTop: 4 },
  actions: { backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowRadius: 8, shadowOpacity: 0.08, marginBottom: 24 },
  actionRow: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  actionIcon: { fontSize: 24, marginRight: 16, width: 32 },
  actionLabel: { flex: 1, fontSize: 16, color: '#374151', fontWeight: '500' },
  actionArrow: { fontSize: 24, color: '#D1D5DB' },
  version: { textAlign: 'center', color: '#9CA3AF', fontSize: 12, marginTop: 16 },
});