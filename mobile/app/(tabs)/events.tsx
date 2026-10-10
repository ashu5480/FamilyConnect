import { View, Text, StyleSheet, ScrollView, Pressable, RefreshControl } from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { apiRequest } from '../../services/api';
import { Motion, MotionGroup } from '../../components/animations';
import { Button } from '../../components/ui/Button';
import { EmptyState, Skeleton, Gutter } from '../../components/ui/states';
import { colors, typography, spacing, borderRadius, animation } from '../../constants/theme';

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
  const [refreshing, setRefreshing] = useState(false);
  const [loadError, setLoadError] = useState('');
  const router = useRouter();

  const loadEvents = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setLoadError('');
    try {
      const data = await apiRequest<any>('/events');
      setEvents(data.events || []);
    } catch (error: any) {
      setLoadError(error.message || 'Could not load events. Pull to retry.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  if (loading) {
    return (
      <View style={styles.root}>
        <Gutter style={styles.content}>
          <Skeleton height={54} style={{ marginTop: 60 }} />
          <Skeleton height={120} style={{ marginTop: 16 }} />
          <Skeleton height={120} style={{ marginTop: 12 }} />
        </Gutter>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.scrollContent}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadEvents(true); }} />}
    >
      <Gutter style={styles.content}>
        <Motion preset="fadeInDown" duration={animation.duration.fast}>
          <Text style={styles.title}>Events</Text>
          <Text style={styles.subtitle}>
            {events.length === 0 ? 'Plan your first celebration' : `${events.length} upcoming celebration${events.length === 1 ? '' : 's'}`}
          </Text>
          {loadError ? (
            <View style={styles.loadError} accessibilityRole="alert">
              <Text style={styles.loadErrorText}>{loadError}</Text>
            </View>
          ) : null}
          <Button title="Create New Event" onPress={() => router.push('/event/create' as any)} hint="Create a new family event" />
        </Motion>

        {events.length === 0 ? (
          <Motion preset="fadeInUp" delay={200} duration={animation.duration.normal}>
            <EmptyState
              title="No events yet"
              body="Create your first family event — a wedding, birthday, or reunion."
              actionLabel="Create Event"
              onAction={() => router.push('/event/create' as any)}
            />
          </Motion>
        ) : (
          <MotionGroup preset="fadeInUp" stagger={animation.stagger.fast} duration={animation.duration.fast} delay={100}>
            {events.map(event => (
              <EventCard key={event.id} event={event} onPress={() => router.push(`/event/${event.id}` as any)} />
            ))}
          </MotionGroup>
        )}
      </Gutter>
    </ScrollView>
  );
}

function EventCard({ event, onPress }: { event: EventData; onPress: () => void }) {
  const startDate = new Date(event.startDate);
  const daysUntil = Math.ceil((startDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  return (
    <Pressable
      style={styles.card}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${event.name}, ${event.type}, ${startDate.toLocaleDateString()}`}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.eventType}>{event.type}</Text>
        <View style={styles.daysBadge}>
          <Text style={styles.daysBadgeText}>{daysUntil > 0 ? `${daysUntil}d to go` : 'Today'}</Text>
        </View>
      </View>
      <Text style={styles.eventName}>{event.name}</Text>
      <Text style={styles.eventMeta}>{startDate.toLocaleDateString()}</Text>
      {event.location ? <Text style={styles.eventMeta}>{event.location}</Text> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: { paddingTop: 60 },
  scrollContent: { paddingBottom: 48 },
  title: { ...typography.h1, color: colors.text.primary },
  subtitle: { ...typography.body, color: colors.text.secondary, marginTop: 4, marginBottom: spacing.lg },
  loadError: { backgroundColor: colors.error, borderRadius: 12, padding: spacing.md, marginBottom: spacing.md },
  loadErrorText: { color: '#FFFFFF', ...typography.bodySmall, fontWeight: '600' },
  card: {
    backgroundColor: colors.surface, borderRadius: borderRadius.lg,
    padding: spacing.xl, borderWidth: 1, borderColor: colors.borderLight, marginTop: spacing.md,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  eventType: { ...typography.eyebrow, fontSize: 11, color: colors.primary },
  daysBadge: { backgroundColor: colors.primaryLight, paddingHorizontal: 12, paddingVertical: 5, borderRadius: 999 },
  daysBadgeText: { fontSize: 11, color: colors.primaryDark, fontWeight: '800' },
  eventName: { ...typography.h3, color: colors.text.primary, marginBottom: 4 },
  eventMeta: { ...typography.bodySmall, color: colors.text.secondary, marginTop: 2 },
});