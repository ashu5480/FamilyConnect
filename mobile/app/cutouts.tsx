import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Alert, Image } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { apiRequest } from '../services/api';
import { Motion, MotionGroup } from '../components/animations';
import { AnimatedCard } from '../components/animations/AnimatedComponents';

interface Cutout {
  id: string;
  url: string;
  processedUrl?: string;
  originalUrl?: string;
  width?: number;
  height?: number;
  createdAt: string;
  mediaId?: string;
}

export default function CutoutsScreen() {
  const [cutouts, setCutouts] = useState<Cutout[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadCutouts();
  }, []);

  const loadCutouts = async () => {
    try {
      const data = await apiRequest<any>('/cutouts');
      setCutouts(data.cutouts || []);
    } catch (error) {
      console.error('Failed to load cutouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    Alert.alert('Delete Cutout', 'Remove this cutout from your collection?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await apiRequest(`/cutouts?id=${id}`, { method: 'DELETE' });
            setCutouts(prev => prev.filter(c => c.id !== id));
          } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to delete');
          }
        },
      },
    ]);
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
        data={cutouts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={cutouts.length > 1 ? styles.row : undefined}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <Motion preset="fadeInDown" duration={500}>
            <Text style={styles.title}>My Cutouts</Text>
            <Text style={styles.subtitle}>{cutouts.length} transparent images</Text>
            <TouchableOpacity style={styles.createButton} onPress={() => router.push('/(tabs)/events' as any)} activeOpacity={0.8}>
              <Text style={styles.createButtonText}>📸 Upload a photo to cut out</Text>
            </TouchableOpacity>
          </Motion>
        }
        ListEmptyComponent={
          <Motion preset="zoomIn" delay={200} duration={500}>
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>✂️</Text>
              <Text style={styles.emptyTitle}>No cutouts yet</Text>
              <Text style={styles.emptyText}>Remove backgrounds from photos to create transparent cutouts for invitations.</Text>
            </View>
          </Motion>
        }
        renderItem={({ item, index }) => (
          <MotionGroup preset="fadeInUp" stagger={60} duration={400} delay={100}>
            <AnimatedCard preset="fadeInUp" delay={index * 60} duration={400} style={styles.cutoutCard}>
              <View style={styles.imageWrap}>
                <Image source={{ uri: item.processedUrl || item.url }} style={styles.cutoutImage} resizeMode="contain" />
              </View>
              <View style={styles.cutoutFooter}>
                <Text style={styles.cutoutDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
                <TouchableOpacity onPress={() => handleDelete(item.id)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
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
  subtitle: { fontSize: 14, color: '#6B7280', marginTop: 4, marginBottom: 16 },
  createButton: { backgroundColor: '#E91E63', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginBottom: 20 },
  createButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  row: { justifyContent: 'space-between' },
  cutoutCard: { flex: 1, marginBottom: 12, padding: 12, maxWidth: '48%' },
  imageWrap: { width: '100%', height: 120, borderRadius: 8, backgroundColor: '#F3F4F6', overflow: 'hidden', justifyContent: 'center', alignItems: 'center' },
  cutoutImage: { width: '100%', height: '100%' },
  cutoutFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  cutoutDate: { fontSize: 12, color: '#9CA3AF' },
  deleteText: { fontSize: 13, color: '#DC2626', fontWeight: '600' },
  emptyState: { alignItems: 'center', paddingTop: 80, paddingHorizontal: 40 },
  emptyEmoji: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 22, fontWeight: '700', color: '#374151', marginBottom: 8 },
  emptyText: { fontSize: 15, color: '#9CA3AF', textAlign: 'center', lineHeight: 22 },
});
