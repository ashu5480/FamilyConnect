import { View, Text, ScrollView, Pressable, RefreshControl } from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { apiRequest } from '../../services/api';
import { Motion, MotionGroup } from '../../components/animations';
import { EmptyState, Skeleton, Gutter } from '../../components/ui/states';
import { useAuth } from '../../hooks/useAuth';
import { styles } from './homeStyles';

const QUICK_ACTIONS = [
  { label: 'New Event', glyph: '+', route: '/event/create' },
  { label: 'Events', glyph: '▦', route: '/(tabs)/events' },
  { label: 'Tasks', glyph: '✓', route: '/(tabs)/tasks' },
  { label: 'Chat', glyph: '✉', route: '/(tabs)/chat' },
  { label: 'Family', glyph: '○', route: '/family/members' },
  { label: 'Settings', glyph: '⚙', route: '/settings' },
] as const;

interface FamilyData {
  id: string;
  name: string;
  slug: string;
}

interface EventData {
  id: string;
  name: string;
  type: string;
  startDate: string;
}

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

// Home shows only real data: family + events from the API.
export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [family, setFamily] = useState<FamilyData | null>(null);
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadError, setLoadError] = useState('');

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setLoadError('');
    try {
      const [famRes, evRes] = await Promise.all([
        apiRequest<any>('/families'),
        apiRequest<any>('/events'),
      ]);
      setFamily(famRes.families?.[0] || null);
      setEvents(evRes.events?.slice(0, 3) || []);
    } catch (error: any) {
      setLoadError(error.message || 'Could not load your home. Pull to retry.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <View style={styles.root}>
        <Gutter style={styles.content}>
          <Skeleton height={22} style={{ width: '45%', marginTop: 60 }} />
          <Skeleton height={34} style={{ width: '70%', marginTop: 10 }} />
          <Skeleton height={150} style={{ marginTop: 24 }} />
          <Skeleton height={20} style={{ width: '40%', marginTop: 28 }} />
          <View style={styles.actionGrid}>
            {[0, 1, 2, 3, 4, 5].map(i => (
              <Skeleton key={i} height={86} style={{ width: '31%' }} />
            ))}
          </View>
        </Gutter>
      </View>
    );
  }

  const upNext = events[0];

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.scrollContent}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(true); }} />}
    >
      <Gutter style={styles.content}>
        <Motion preset="fadeInDown" duration={200}>
          <Text style={styles.eyebrow}>{greeting()}{user?.name ? `, ${user.name.split(' ')[0]}` : ''}</Text>
          <Text style={styles.familyName}>{family?.name || 'Your Family'}</Text>
          {loadError ? (
            <View style={styles.loadError} accessibilityRole="alert">
              <Text style={styles.loadErrorText}>{loadError}</Text>
            </View>
          ) : null}
        </Motion>

        <Motion preset="fadeInUp" delay={100} duration={320}>
          <View style={styles.hero}>
            <View style={{ flex: 1 }}>
              <Text style={styles.heroEyebrow}>Up next</Text>
              <Text style={styles.heroTitle}>{upNext?.name || 'No upcoming events'}</Text>
              <Text style={styles.heroSub}>
                {upNext ? `${upNext.type} · ${new Date(upNext.startDate).toLocaleDateString()}` : 'Create your first event to get started'}
              </Text>
            </View>
            <Pressable
              style={styles.heroCta}
              onPress={() => router.push((upNext ? `/event/${upNext.id}` : '/event/create') as any)}
              accessibilityRole="button"
              accessibilityLabel={upNext ? `Open ${upNext.name}` : 'Create your first event'}
            >
              <Text style={styles.heroCtaText}>{upNext ? 'Open' : 'Create'}</Text>
            </Pressable>
          </View>
        </Motion>

        <Motion preset="fadeInUp" delay={180} duration={320}>
          <Text style={styles.sectionTitle}>Quick actions</Text>
        </Motion>

        <MotionGroup preset="fadeInUp" stagger={50} duration={200} delay={220}>
          <View style={styles.actionGrid}>
            {QUICK_ACTIONS.map(item => (
              <Pressable
                key={item.label}
                style={styles.action}
                onPress={() => router.push(item.route as any)}
                accessibilityRole="button"
                accessibilityLabel={item.label}
              >
                <Text style={styles.actionGlyph}>{item.glyph}</Text>
                <Text style={styles.actionLabel}>{item.label}</Text>
              </Pressable>
            ))}
          </View>
        </MotionGroup>

        <Motion preset="fadeInUp" delay={380} duration={320}>
          <Text style={styles.sectionTitle}>Upcoming events</Text>
          {events.length === 0 ? (
            <EmptyState
              title="No events yet"
              body="Plan your first celebration — a wedding, birthday, or family reunion."
              actionLabel="Create Event"
              onAction={() => router.push('/event/create' as any)}
            />
          ) : (
            <View style={styles.eventList}>
              {events.map(ev => (
                <Pressable
                  key={ev.id}
                  style={styles.eventRow}
                  onPress={() => router.push(`/event/${ev.id}` as any)}
                  accessibilityRole="button"
                  accessibilityLabel={`${ev.name}, ${ev.type}`}
                >
                  <View style={styles.eventDate}>
                    <Text style={styles.eventDay}>{new Date(ev.startDate).getDate()}</Text>
                    <Text style={styles.eventMonth}>{new Date(ev.startDate).toLocaleString('en', { month: 'short' })}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.eventName}>{ev.name}</Text>
                    <Text style={styles.eventType}>{ev.type}</Text>
                  </View>
                  <Text style={styles.chev}>›</Text>
                </Pressable>
              ))}
            </View>
          )}
        </Motion>
      </Gutter>
    </ScrollView>
  );
}