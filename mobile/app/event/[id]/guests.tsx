import { View, Text, StyleSheet, FlatList, ActivityIndicator, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { apiRequest } from '../../../services/api';
import { Motion, MotionGroup } from '../../../components/animations';
import { AnimatedCard, AnimatedButton } from '../../../components/animations/AnimatedComponents';

interface Guest {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  rsvp: 'PENDING' | 'YES' | 'NO' | 'MAYBE';
  plusOne?: number;
  side?: string;
}

const RSVP_COLORS: Record<string, string> = { PENDING: '#FEF3C7', YES: '#D1FAE5', NO: '#FEE2E2', MAYBE: '#DBEAFE' };
const RSVP_LABELS: Record<string, string> = { PENDING: 'Pending', YES: 'Accepted', NO: 'Declined', MAYBE: 'Maybe' };

export default function EventGuestsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (id) loadGuests();
  }, [id]);

  const loadGuests = async () => {
    try {
      const data = await apiRequest<any>(`/events/${id}/guests`);
      setGuests(data.guests || []);
    } catch (error) {
      console.error('Failed to load guests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!name.trim()) {
      Alert.alert('Validation', 'Guest name is required');
      return;
    }
    setAdding(true);
    try {
      await apiRequest(`/events/${id}/guests`, {
        method: 'POST',
        body: JSON.stringify({ name: name.trim(), email: email.trim() || undefined }),
      });
      setName('');
      setEmail('');
      await loadGuests();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to add guest');
    } finally {
      setAdding(false);
    }
  };

  const handleStatus = async (guest: Guest, rsvp: 'YES' | 'NO') => {
    try {
      await apiRequest(`/events/${id}/guests/${guest.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ rsvp }),
      });
      await loadGuests();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update guest');
    }
  };

  const accepted = guests.filter(g => g.rsvp === 'YES').length;
  const pending = guests.filter(g => g.rsvp === 'PENDING').length;

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
        data={guests}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <>
            <Motion preset="fadeInDown" duration={500}>
              <Text style={styles.title}>Guests</Text>
              <Text style={styles.subtitle}>{accepted} accepted · {pending} pending · {guests.length} total</Text>
            </Motion>
            <Motion preset="fadeInUp" delay={100} duration={500}>
              <AnimatedCard>
                <Text style={styles.formTitle}>Add Guest</Text>
                <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Full name" placeholderTextColor="#9CA3AF" />
                <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Email (optional)" placeholderTextColor="#9CA3AF" keyboardType="email-address" />
                <AnimatedButton title={adding ? 'Adding...' : 'Add Guest'} onPress={handleAdd} loading={adding} size="small" animation="spring" />
              </AnimatedCard>
            </Motion>
          </>
        }
        ListEmptyComponent={
          <Motion preset="zoomIn" delay={200} duration={500}>
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>👥</Text>
              <Text style={styles.emptyTitle}>No guests yet</Text>
              <Text style={styles.emptyText}>Add guests and track their RSVP status.</Text>
            </View>
          </Motion>
        }
        renderItem={({ item, index }) => (
          <MotionGroup preset="fadeInUp" stagger={40} duration={350} delay={150}>
            <AnimatedCard preset="fadeInUp" delay={index * 40} duration={350}>
              <View style={styles.guestRow}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{item.name.charAt(0).toUpperCase()}</Text>
                </View>
                <View style={styles.guestInfo}>
                  <Text style={styles.guestName}>{item.name}</Text>
                  {item.email ? <Text style={styles.guestEmail}>{item.email}</Text> : null}
                  {item.plusOne ? <Text style={styles.guestMeta}>+{item.plusOne}</Text> : null}
                </View>
                <View style={[styles.statusBadge, { backgroundColor: RSVP_COLORS[item.rsvp] || RSVP_COLORS.PENDING }]}>
                  <Text style={styles.statusText}>{RSVP_LABELS[item.rsvp] || item.rsvp}</Text>
                </View>
              </View>
              {item.rsvp === 'PENDING' && (
                <View style={styles.rsvpRow}>
                  <TouchableOpacity style={styles.acceptButton} onPress={() => handleStatus(item, 'YES')} activeOpacity={0.7}>
                    <Text style={styles.acceptText}>Accept</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.declineButton} onPress={() => handleStatus(item, 'NO')} activeOpacity={0.7}>
                    <Text style={styles.declineText}>Decline</Text>
                  </TouchableOpacity>
                </View>
              )}
            </AnimatedCard>
          </MotionGroup>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F8' },
  content: { padding: 16, paddingTop: 80, paddingBottom: 48 },
  title: { fontSize: 28, fontWeight: '800', color: '#1F2937' },
  subtitle: { fontSize: 14, color: '#6B7280', marginTop: 4, marginBottom: 20 },
  formTitle: { fontSize: 16, fontWeight: '700', color: '#1F2937', marginBottom: 12 },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1F2937',
    marginBottom: 10,
  },
  guestRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#E91E63', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarText: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
  guestInfo: { flex: 1 },
  guestName: { fontSize: 15, fontWeight: '700', color: '#1F2937' },
  guestEmail: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  guestMeta: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  statusText: { fontSize: 11, fontWeight: '700', color: '#374151' },
  rsvpRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
  acceptButton: { flex: 1, backgroundColor: '#E91E63', borderRadius: 10, paddingVertical: 10, alignItems: 'center' },
  acceptText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  declineButton: { flex: 1, backgroundColor: '#F3F4F6', borderRadius: 10, paddingVertical: 10, alignItems: 'center' },
  declineText: { color: '#6B7280', fontWeight: '700', fontSize: 14 },
  emptyState: { alignItems: 'center', paddingTop: 60, paddingHorizontal: 40 },
  emptyEmoji: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 22, fontWeight: '700', color: '#374151', marginBottom: 8 },
  emptyText: { fontSize: 15, color: '#9CA3AF', textAlign: 'center', lineHeight: 22 },
});
