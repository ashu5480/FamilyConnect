import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { apiRequest } from '../../services/api';
import { Motion, MotionGroup } from '../../components/animations';
import { AnimatedCard } from '../../components/animations/AnimatedComponents';

interface Member {
  id: string;
  role: string;
  status: string;
  user: { id: string; name: string; email: string; relationship?: string; profilePhoto?: string } | null;
}

interface FamilyData {
  id: string;
  name: string;
  slug: string;
}

export default function FamilyMembersScreen() {
  const [family, setFamily] = useState<FamilyData | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFamily();
  }, []);

  const loadFamily = async () => {
    try {
      const data = await apiRequest<any>('/families');
      const first = data.families?.[0] || null;
      setFamily(first);
      if (first?.id) {
        const memberData = await apiRequest<any>(`/families/${first.id}/members`);
        setMembers(memberData.members || []);
      }
    } catch (error) {
      console.error('Failed to load family:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#E91E63" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={members}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <Motion preset="fadeInDown" duration={500}>
            <Text style={styles.title}>{family?.name || 'Family'}</Text>
            <Text style={styles.subtitle}>{members.length} members</Text>
          </Motion>
        }
        ListEmptyComponent={
          <Motion preset="zoomIn" delay={200} duration={500}>
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>👨‍👩‍👧‍👦</Text>
              <Text style={styles.emptyTitle}>No members yet</Text>
              <Text style={styles.emptyText}>Invite family members to join your family.</Text>
            </View>
          </Motion>
        }
        renderItem={({ item, index }) => (
          <MotionGroup preset="fadeInUp" stagger={60} duration={400} delay={100}>
            <MemberRow member={item} index={index} />
          </MotionGroup>
        )}
      />
    </View>
  );
}

function MemberRow({ member, index }: { member: Member; index: number }) {
  const name = member.user?.name || 'Unknown';
  const initials = name.charAt(0).toUpperCase() || '?';
  return (
    <AnimatedCard preset="fadeInUp" delay={index * 60} duration={400}>
      <View style={styles.memberRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={styles.memberInfo}>
          <Text style={styles.memberName}>{name}</Text>
          <Text style={styles.memberMeta}>
            {member.user?.relationship || 'Member'} · {member.role}
          </Text>
        </View>
        <View style={[styles.statusBadge, member.status === 'ACTIVE' ? styles.statusActive : styles.statusPending]}>
          <Text style={styles.statusText}>{member.status}</Text>
        </View>
      </View>
    </AnimatedCard>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F8' },
  content: { padding: 16, paddingTop: 80, paddingBottom: 48 },
  title: { fontSize: 28, fontWeight: '800', color: '#1F2937' },
  subtitle: { fontSize: 14, color: '#6B7280', marginTop: 4, marginBottom: 20 },
  memberRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#E91E63', justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  avatarText: { color: '#FFFFFF', fontSize: 20, fontWeight: '700' },
  memberInfo: { flex: 1 },
  memberName: { fontSize: 16, fontWeight: '700', color: '#1F2937' },
  memberMeta: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  statusActive: { backgroundColor: '#D1FAE5' },
  statusPending: { backgroundColor: '#FEF3C7' },
  statusText: { fontSize: 11, fontWeight: '700', color: '#374151' },
  emptyState: { alignItems: 'center', paddingTop: 80, paddingHorizontal: 40 },
  emptyEmoji: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 22, fontWeight: '700', color: '#374151', marginBottom: 8 },
  emptyText: { fontSize: 15, color: '#9CA3AF', textAlign: 'center', lineHeight: 22 },
});
