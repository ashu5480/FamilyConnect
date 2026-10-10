import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Alert, Image } from 'react-native';
import { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { apiRequest } from '../../../services/api';
import { Motion, MotionGroup } from '../../../components/animations';
import { AnimatedCard } from '../../../components/animations/AnimatedComponents';

interface MediaItem {
  id: string;
  type: 'IMAGE' | 'VIDEO' | 'DOCUMENT';
  url: string;
  thumbnailUrl?: string;
  title?: string;
  albumName?: string;
  uploadedByName?: string;
  createdAt: string;
}

export default function EventMediaScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (id) loadMedia();
  }, [id]);

  const loadMedia = async () => {
    try {
      const data = await apiRequest<any>(`/events/${id}/media`);
      setMedia(data.media || []);
    } catch (error) {
      console.error('Failed to load media:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (result.canceled || !result.assets?.[0]) return;
    await uploadFile(result.assets[0].uri, 'IMAGE');
  };

  const uploadFile = async (uri: string, type: 'IMAGE' | 'VIDEO') => {
    setUploading(true);
    try {
      const filename = uri.split('/').pop() || `media-${Date.now()}`;
      const mimeType = type === 'IMAGE' ? 'image/jpeg' : 'video/mp4';
      await apiRequest(`/events/${id}/media`, {
        method: 'POST',
        body: JSON.stringify({
          filename,
          mimeType,
          size: 1,
          type,
        }),
      });
      await loadMedia();
    } catch (error: any) {
      Alert.alert('Upload failed', error.message || 'Please try again');
    } finally {
      setUploading(false);
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
        data={media}
        keyExtractor={(item) => item.id}
        numColumns={3}
        columnWrapperStyle={media.length > 1 ? styles.row : undefined}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <>
            <Motion preset="fadeInDown" duration={500}>
              <Text style={styles.title}>Media</Text>
              <Text style={styles.subtitle}>{media.length} photos & videos</Text>
              <View style={styles.uploadRow}>
                <TouchableOpacity style={styles.uploadButton} onPress={handlePickImage} disabled={uploading} activeOpacity={0.8}>
                  <Text style={styles.uploadButtonText}>{uploading ? 'Uploading...' : '📸 Upload Photo'}</Text>
                </TouchableOpacity>
              </View>
            </Motion>
          </>
        }
        ListEmptyComponent={
          <Motion preset="zoomIn" delay={200} duration={500}>
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>📸</Text>
              <Text style={styles.emptyTitle}>No media yet</Text>
              <Text style={styles.emptyText}>Upload photos and videos from the event.</Text>
            </View>
          </Motion>
        }
        renderItem={({ item, index }) => (
          <MotionGroup preset="fadeInUp" stagger={40} duration={350} delay={150}>
            <AnimatedCard preset="fadeInUp" delay={index * 40} duration={350} style={styles.mediaCard}>
              <Image source={{ uri: item.url }} style={styles.mediaImage} resizeMode="cover" />
              {item.title ? <Text style={styles.mediaTitle} numberOfLines={1}>{item.title}</Text> : null}
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
  uploadRow: { marginBottom: 16 },
  uploadButton: { backgroundColor: '#E91E63', borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  uploadButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  row: { justifyContent: 'space-between' },
  mediaCard: { flex: 1, marginBottom: 10, padding: 8, maxWidth: '31%' },
  mediaImage: { width: '100%', height: 100, borderRadius: 8, backgroundColor: '#F3F4F6' },
  mediaTitle: { fontSize: 11, color: '#6B7280', marginTop: 6, textAlign: 'center' },
  emptyState: { alignItems: 'center', paddingTop: 60, paddingHorizontal: 40 },
  emptyEmoji: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 22, fontWeight: '700', color: '#374151', marginBottom: 8 },
  emptyText: { fontSize: 15, color: '#9CA3AF', textAlign: 'center', lineHeight: 22 },
});
