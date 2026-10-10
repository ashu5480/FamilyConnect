import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { apiRequest } from '../../services/api';
import { Motion, MotionGroup } from '../../components/animations';
import { AnimatedButton, AnimatedCard } from '../../components/animations/AnimatedComponents';

interface EventData {
  id: string;
  name: string;
  type: string;
  startDate: string;
  endDate: string;
  location?: string;
  coverImage?: string;
}

export default function EventsScreen() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const data = await apiRequest<any>('/events');
      setEvents(data.events || []);
    } catch (error) {
      console.error('Failed to load events:', error);
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
        <AnimatedButton
          title="+ Create New Event"
          onPress={() => router.push('/event/create' as any)}
          variant="primary"
          size="large"
          animation="spring"
        />
      </Motion>

      {events.length === 0 ? (
        <Motion preset="zoomIn" delay={200} duration={600}>
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📅</Text>
            <Text style={styles.emptyTitle}>No Events Yet</Text>
            <Text style={styles.emptyText}>Create your first family event to get started.</Text>
          </View>
        </Motion>
      ) : (
        <MotionGroup preset="fadeInUp" stagger={100} duration={500} delay={100}>
          {events.map(event => (
            <EventCard key={event.id} event={event} onPress={() => router.push(`/event/${event.id}` as any)} />
          ))}
        </MotionGroup>
      )}
    </ScrollView>
  );
}

function EventCard({ event, onPress }: { event: EventData; onPress: () => void }) {
  const startDate = new Date(event.startDate);
  const daysUntil = Math.ceil((startDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  return (
    <AnimatedCard onPress={onPress}>
      <View style={styles.cardHeader}>
        <Text style={styles.eventType}>{event.type}</Text>
        <Text style={styles.daysBadge}>{daysUntil > 0 ? `${daysUntil} days` : 'Today'}</Text>
      </View>
      <Text style={styles.eventName}>{event.name}</Text>
      <Text style={styles.eventMeta}>📅 {startDate.toLocaleDateString()}</Text>
      {event.location && <Text style={styles.eventMeta}>📍 {event.location}</Text>}
    </AnimatedCard>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F8' },
  content: { padding: 16, paddingTop: 60, paddingBottom: 48 },
  emptyState: { alignItems: 'center', paddingTop: 80, paddingHorizontal: 40 },
  emptyEmoji: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 22, fontWeight: '700', color: '#374151', marginBottom: 8 },
  emptyText: { fontSize: 15, color: '#9CA3AF', textAlign: 'center', lineHeight: 22 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  eventType: { fontSize: 12, color: '#E91E63', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
  daysBadge: { fontSize: 12, color: '#FFFFFF', backgroundColor: '#E91E63', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, overflow: 'hidden' },
  eventName: { fontSize: 22, fontWeight: '800', color: '#1F2937', marginBottom: 8, letterSpacing: -0.5 },
  eventMeta: { fontSize: 14, color: '#6B7280', marginTop: 4 },
});