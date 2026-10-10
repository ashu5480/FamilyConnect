import { View, Text, StyleSheet, ScrollView, TextInput, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { apiRequest } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { Motion } from '../../components/animations';
import { AnimatedButton, AnimatedCard } from '../../components/animations/AnimatedComponents';

const EVENT_TYPES = ['Wedding', 'Engagement', 'Birthday', 'Anniversary', 'Pooja', 'Housewarming', 'Baby Shower', 'Family Reunion', 'Other'];

export default function CreateEventScreen() {
  const router = useRouter();
  const { family } = useAuth();
  const [name, setName] = useState('');
  const [type, setType] = useState('Wedding');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) {
      Alert.alert('Validation', 'Event name is required');
      return;
    }
    if (!startDate.trim()) {
      Alert.alert('Validation', 'Start date is required (YYYY-MM-DD)');
      return;
    }
    if (!family?.id) {
      Alert.alert('Missing Family', 'Create or join a family first from the Profile tab.');
      return;
    }
    setSaving(true);
    try {
      const result = await apiRequest<any>('/events', {
        method: 'POST',
        body: JSON.stringify({
          familyId: family.id,
          name: name.trim(),
          type,
          startDate,
          endDate: endDate || startDate,
          location: location.trim() || undefined,
          description: description.trim() || undefined,
        }),
      });
      router.replace(`/event/${result.event?.id || result.id}`);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create event');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Motion preset="fadeInDown" duration={500}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} activeOpacity={0.7}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Create Event</Text>
      </Motion>

      <Motion preset="fadeInUp" delay={100} duration={500}>
        <AnimatedCard>
          <Text style={styles.label}>Event Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="e.g. Annu & Naveen Wedding"
            placeholderTextColor="#9CA3AF"
          />

          <Text style={styles.label}>Type</Text>
          <View style={styles.typeGrid}>
            {EVENT_TYPES.map(t => (
              <TouchableOpacity
                key={t}
                style={[styles.typeChip, type === t && styles.typeChipActive]}
                onPress={() => setType(t)}
                activeOpacity={0.7}
              >
                <Text style={[styles.typeChipText, type === t && styles.typeChipTextActive]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Start Date (YYYY-MM-DD)</Text>
          <TextInput
            style={styles.input}
            value={startDate}
            onChangeText={setStartDate}
            placeholder="2026-12-15"
            placeholderTextColor="#9CA3AF"
          />

          <Text style={styles.label}>End Date (YYYY-MM-DD)</Text>
          <TextInput
            style={styles.input}
            value={endDate}
            onChangeText={setEndDate}
            placeholder="2026-12-16"
            placeholderTextColor="#9CA3AF"
          />

          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            value={location}
            onChangeText={setLocation}
            placeholder="Venue, City"
            placeholderTextColor="#9CA3AF"
          />

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Tell your family about this event..."
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={4}
          />
        </AnimatedCard>
      </Motion>

      <Motion preset="fadeInUp" delay={200} duration={500}>
        <AnimatedButton
          title={saving ? 'Creating...' : 'Create Event'}
          onPress={handleCreate}
          loading={saving}
          size="large"
          animation="spring"
        />
      </Motion>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F8' },
  content: { padding: 16, paddingTop: 80, paddingBottom: 48 },
  backButton: { marginBottom: 12 },
  backText: { fontSize: 16, color: '#E91E63', fontWeight: '600' },
  title: { fontSize: 28, fontWeight: '800', color: '#1F2937', marginBottom: 24 },
  label: { fontSize: 13, fontWeight: '600', color: '#6B7280', marginBottom: 6, marginTop: 14 },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  textArea: { minHeight: 100, textAlignVertical: 'top' },
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  typeChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F3F4F6' },
  typeChipActive: { backgroundColor: '#E91E63' },
  typeChipText: { fontSize: 14, color: '#6B7280', fontWeight: '500' },
  typeChipTextActive: { color: '#FFFFFF', fontWeight: '700' },
});
