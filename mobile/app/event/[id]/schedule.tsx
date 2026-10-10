import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { apiRequest } from '../../../services/api';
import { Motion, MotionGroup } from '../../../components/animations';
import { AnimatedCard, AnimatedButton } from '../../../components/animations/AnimatedComponents';

interface ScheduleItem {
  id: string;
  name: string;
  description?: string;
  startTime: string;
  endTime?: string;
  date: string;
  location?: string;
  order: number;
}

export default function EventScheduleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [items, setItems] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    if (id) loadSchedule();
  }, [id]);

  const loadSchedule = async () => {
    try {
      const data = await apiRequest<any>(`/events/${id}/schedule`);
      setItems(data.schedule || data.items || []);
    } catch (error) {
      console.error('Failed to load schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!name.trim() || !date.trim() || !startTime.trim()) {
      Alert.alert('Validation', 'Name, date and start time are required');
      return;
    }
    setAdding(true);
    try {
      await apiRequest(`/events/${id}/schedule`, {
        method: 'POST',
        body: JSON.stringify({ name: name.trim(), date, startTime, location: location.trim() || undefined }),
      });
      setName('');
      setDate('');
      setStartTime('');
      setLocation('');
      await loadSchedule();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to add item');
    } finally {
      setAdding(false);
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
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <>
            <Motion preset="fadeInDown" duration={500}>
              <Text style={styles.title}>Schedule</Text>
              <Text style={styles.subtitle}>{items.length} items planned</Text>
            </Motion>
            <Motion preset="fadeInUp" delay={100} duration={500}>
              <AnimatedCard>
                <Text style={styles.formTitle}>Add Schedule Item</Text>
                <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Name (e.g. Ceremony)" placeholderTextColor="#9CA3AF" />
                <TextInput style={styles.input} value={date} onChangeText={setDate} placeholder="Date (YYYY-MM-DD)" placeholderTextColor="#9CA3AF" />
                <TextInput style={styles.input} value={startTime} onChangeText={setStartTime} placeholder="Start time (e.g. 10:00 AM)" placeholderTextColor="#9CA3AF" />
                <TextInput style={styles.input} value={location} onChangeText={setLocation} placeholder="Location (optional)" placeholderTextColor="#9CA3AF" />
                <AnimatedButton title={adding ? 'Adding...' : 'Add Item'} onPress={handleAdd} loading={adding} size="small" animation="spring" />
              </AnimatedCard>
            </Motion>
          </>
        }
        ListEmptyComponent={
          <Motion preset="zoomIn" delay={200} duration={500}>
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>🗓️</Text>
              <Text style={styles.emptyTitle}>No schedule items</Text>
              <Text style={styles.emptyText}>Plan the ceremony, meals, games and more.</Text>
            </View>
          </Motion>
        }
        renderItem={({ item, index }) => (
          <MotionGroup preset="fadeInUp" stagger={50} duration={400} delay={150}>
            <AnimatedCard preset="fadeInUp" delay={index * 50} duration={400}>
              <View style={styles.itemRow}>
                <View style={styles.timeColumn}>
                  <Text style={styles.timeText}>{item.startTime}</Text>
                  <View style={styles.timelineLine} />
                </View>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemTitle}>{item.name}</Text>
                  {item.description ? <Text style={styles.itemDesc}>{item.description}</Text> : null}
                  {item.location ? <Text style={styles.itemMeta}>📍 {item.location}</Text> : null}
                  <Text style={styles.itemMeta}>📅 {new Date(item.date).toLocaleDateString()}</Text>
                </View>
              </View>
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
  itemRow: { flexDirection: 'row' },
  timeColumn: { width: 70, alignItems: 'flex-end', marginRight: 14 },
  timeText: { fontSize: 13, fontWeight: '700', color: '#E91E63' },
  timelineLine: { width: 2, flex: 1, backgroundColor: '#FCE7F3', marginTop: 6, borderRadius: 1 },
  itemInfo: { flex: 1, paddingBottom: 8 },
  itemTitle: { fontSize: 16, fontWeight: '700', color: '#1F2937' },
  itemDesc: { fontSize: 14, color: '#6B7280', marginTop: 4, lineHeight: 20 },
  itemMeta: { fontSize: 13, color: '#9CA3AF', marginTop: 6 },
  emptyState: { alignItems: 'center', paddingTop: 60, paddingHorizontal: 40 },
  emptyEmoji: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 22, fontWeight: '700', color: '#374151', marginBottom: 8 },
  emptyText: { fontSize: 15, color: '#9CA3AF', textAlign: 'center', lineHeight: 22 },
});
