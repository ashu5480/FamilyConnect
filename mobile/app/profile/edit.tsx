import { View, Text, StyleSheet, ScrollView, TextInput, ActivityIndicator, Alert } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { apiRequest } from '../../services/api';
import { Motion } from '../../components/animations';
import { AnimatedButton, AnimatedCard } from '../../components/animations/AnimatedComponents';

export default function EditProfileScreen() {
  const { user, refreshUser } = useAuth();
  const router = useRouter();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [relationship, setRelationship] = useState(user?.relationship || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Validation', 'Name is required');
      return;
    }
    setSaving(true);
    try {
      await apiRequest('/users/me', {
        method: 'PUT',
        body: JSON.stringify({ name: name.trim(), phone: phone.trim(), relationship: relationship.trim() }),
      });
      await refreshUser();
      router.back();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Motion preset="fadeInDown" duration={500}>
        <Text style={styles.title}>Edit Profile</Text>
      </Motion>

      <Motion preset="fadeInUp" delay={100} duration={500}>
        <AnimatedCard>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            placeholderTextColor="#9CA3AF"
          />

          <Text style={styles.label}>Phone</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="+1 555 000 0000"
            placeholderTextColor="#9CA3AF"
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Relationship</Text>
          <TextInput
            style={styles.input}
            value={relationship}
            onChangeText={setRelationship}
            placeholder="e.g. Father, Sister, Cousin"
            placeholderTextColor="#9CA3AF"
          />
        </AnimatedCard>
      </Motion>

      <Motion preset="fadeInUp" delay={200} duration={500}>
        <AnimatedButton
          title={saving ? 'Saving...' : 'Save Changes'}
          onPress={handleSave}
          loading={saving}
          size="large"
          animation="spring"
        />
      </Motion>

      <Motion preset="fadeIn" delay={300} duration={500}>
        <AnimatedButton
          title="Cancel"
          onPress={() => router.back()}
          variant="ghost"
          animation="none"
        />
      </Motion>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F8' },
  content: { padding: 16, paddingTop: 80, paddingBottom: 48 },
  title: { fontSize: 28, fontWeight: '800', color: '#1F2937', marginBottom: 24 },
  label: { fontSize: 13, fontWeight: '600', color: '#6B7280', marginBottom: 6, marginTop: 12 },
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
});
