import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { apiRequest } from '../../../services/api';
import { Motion, MotionGroup } from '../../../components/animations';
import { AnimatedCard, AnimatedButton } from '../../../components/animations/AnimatedComponents';

interface EventData {
  id: string;
  name: string;
  type: string;
  startDate: string;
  endDate: string;
  location?: string;
  description?: string;
  coverImage?: string;
  status: string;
  stats?: { members?: number; photos?: number; tasks?: number; guests?: number; chats?: number };
}

export default function EventDashboardScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) loadEvent();
  }, [id]);

  const loadEvent = async () => {
    try {
      const data = await apiRequest<any>(`/events/${id}`);
      setEvent(data.event || data);
    } catch (error) {
      console.error('Failed to load event:', error);
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

  if (!event) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>📅</Text>
          <Text style={styles.emptyTitle}>Event not found</Text>
          <AnimatedButton title="Go Back" onPress={() => router.back()} variant="outline" animation="none" />
        </View>
      </View>
    );
  }

  const startDate = new Date(event.startDate);
  const daysUntil = Math.ceil((startDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  const sections = [
    { icon: '🗓️', label: 'Schedule', route: `/event/${id}/schedule` },
    { icon: '✅', label: 'Tasks', count: event.stats?.tasks, route: `/event/${id}/tasks` },
    { icon: '👥', label: 'Guests', count: event.stats?.guests, route: `/event/${id}/guests` },
    { icon: '📸', label: 'Media', count: event.stats?.photos, route: `/event/${id}/media` },
    { icon: '💰', label: 'Expenses', route: `/event/${id}/expenses` },
    { icon: '✉️', label: 'Invitations', route: `/event/${id}/invitations` },
    { icon: '🎨', label: 'Designer', route: `/event/${id}/designer` },
    { icon: '🤖', label: 'AI Assistant', route: `/event/${id}/ai` },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Motion preset="fadeInDown" duration={500}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} activeOpacity={0.7}>
          <Text style={styles.backText}>‹ Events</Text>
        </TouchableOpacity>
        <Text style={styles.eventType}>{event.type}</Text>
        <Text style={styles.title}>{event.name}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.meta}>📅 {startDate.toLocaleDateString()}</Text>
          {daysUntil > 0 && (
            <View style={styles.countdownBadge}>
              <Text style={styles.countdownText}>{daysUntil} days to go</Text>
            </View>
          )}
        </View>
        {event.location ? <Text style={styles.meta}>📍 {event.location}</Text> : null}
        {event.description ? <Text style={styles.description}>{event.description}</Text> : null}
      </Motion>

      <Motion preset="fadeInUp" delay={150} duration={500}>
        <Text style={styles.sectionTitle}>Manage Event</Text>
      </Motion>

      <MotionGroup preset="fadeInUp" stagger={50} duration={400} delay={200}>
        <View style={styles.grid}>
          {sections.map(section => (
            <TouchableOpacity
              key={section.label}
              style={styles.gridItem}
              onPress={() => router.push(section.route as any)}
              activeOpacity={0.8}
            >
              <Text style={styles.gridIcon}>{section.icon}</Text>
              <Text style={styles.gridLabel}>{section.label}</Text>
              {typeof section.count === 'number' && (
                <Text style={styles.gridCount}>{section.count}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </MotionGroup>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F8' },
  content: { padding: 16, paddingTop: 80, paddingBottom: 48 },
  backButton: { marginBottom: 12 },
  backText: { fontSize: 16, color: '#E91E63', fontWeight: '600' },
  eventType: { fontSize: 12, color: '#E91E63', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
  title: { fontSize: 28, fontWeight: '800', color: '#1F2937', marginTop: 4, marginBottom: 12, letterSpacing: -0.5 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  meta: { fontSize: 15, color: '#6B7280', marginTop: 4 },
  countdownBadge: { backgroundColor: '#E91E63', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  countdownText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  description: { fontSize: 15, color: '#6B7280', marginTop: 12, lineHeight: 22 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1F2937', marginTop: 28, marginBottom: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  gridItem: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'flex-start',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    shadowOpacity: 0.08,
  },
  gridIcon: { fontSize: 32, marginBottom: 10 },
  gridLabel: { fontSize: 15, fontWeight: '700', color: '#1F2937' },
  gridCount: { fontSize: 12, color: '#9CA3AF', marginTop: 4 },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40, gap: 16 },
  emptyEmoji: { fontSize: 64 },
  emptyTitle: { fontSize: 22, fontWeight: '700', color: '#374151' },
});
