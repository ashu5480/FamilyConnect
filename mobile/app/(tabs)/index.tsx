import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { apiRequest } from '../../services/api';
import { Motion, MotionGroup } from '../../components/animations';
import { AnimatedCard } from '../../components/animations/AnimatedComponents';

interface FamilyData {
  id: string;
  name: string;
  slug: string;
}

export default function HomeScreen() {
  const [family, setFamily] = useState<FamilyData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFamily();
  }, []);

  const loadFamily = async () => {
    try {
      const data = await apiRequest<any>('/families');
      setFamily(data.families?.[0] || null);
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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Motion preset="fadeInDown" duration={600}>
        <View style={styles.greeting}>
          <Text style={styles.greetingText}>Good Morning 👋</Text>
          <Text style={styles.familyName}>{family?.name || 'Your Family'}</Text>
        </View>
      </Motion>

      <Motion preset="fadeInUp" delay={100} duration={600}>
        <AnimatedCard style={styles.upcomingCard}>
          <Text style={styles.sectionLabel}>Upcoming Event</Text>
          <Text style={styles.eventTitle}>No upcoming events</Text>
          <Text style={styles.eventDate}>Create your first event to get started</Text>
          <Text style={styles.daysRemaining}>—</Text>
        </AnimatedCard>
      </Motion>

      <Motion preset="fadeInUp" delay={200} duration={600}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
      </Motion>

      <MotionGroup preset="fadeInUp" stagger={60} duration={500} delay={250}>
        <View style={styles.quickActions}>
          <QuickAction icon="📸" label="Upload Photos" />
          <QuickAction icon="✂️" label="Remove Background" />
          <QuickAction icon="✅" label="My Tasks" />
          <QuickAction icon="👥" label="Guests" />
          <QuickAction icon="💬" label="Chat" />
        </View>
      </MotionGroup>

      <Motion preset="fadeInUp" delay={400} duration={600}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
      </Motion>

      <Motion preset="fadeInUp" delay={450} duration={600}>
        <AnimatedCard>
          <Text style={styles.emptyText}>No recent activity yet.</Text>
        </AnimatedCard>
      </Motion>

      <Motion preset="fadeInUp" delay={500} duration={600}>
        <Text style={styles.sectionTitle}>Upcoming Events</Text>
      </Motion>

      <Motion preset="fadeInUp" delay={550} duration={600}>
        <AnimatedCard>
          <Text style={styles.emptyText}>No events created yet.</Text>
        </AnimatedCard>
      </Motion>
    </ScrollView>
  );
}

function QuickAction({ icon, label }: { icon: string; label: string }) {
  return (
    <TouchableOpacity style={styles.quickActionItem} activeOpacity={0.8}>
      <Text style={styles.quickActionIcon}>{icon}</Text>
      <Text style={styles.quickActionLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F8' },
  content: { padding: 16, paddingTop: 60, paddingBottom: 48 },
  greeting: { marginBottom: 24 },
  greetingText: { fontSize: 18, color: '#6B7280' },
  familyName: { fontSize: 28, fontWeight: '800', color: '#1F2937', marginTop: 4 },
  upcomingCard: { marginBottom: 24 },
  sectionLabel: { fontSize: 12, color: '#E91E63', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
  eventTitle: { fontSize: 24, fontWeight: '800', color: '#1F2937', marginTop: 8 },
  eventDate: { fontSize: 15, color: '#6B7280', marginTop: 4 },
  daysRemaining: { fontSize: 14, color: '#E91E63', fontWeight: '600', marginTop: 8 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1F2937', marginTop: 24, marginBottom: 12 },
  quickActions: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between' },
  quickActionItem: { width: '30%', backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, alignItems: 'center', elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowRadius: 4, shadowOpacity: 0.06 },
  quickActionIcon: { fontSize: 28, marginBottom: 8 },
  quickActionLabel: { fontSize: 11, color: '#374151', textAlign: 'center', fontWeight: '500' },
  emptyText: { color: '#9CA3AF', textAlign: 'center', fontSize: 14 },
});