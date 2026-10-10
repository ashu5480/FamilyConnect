import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Alert, Share } from 'react-native';
import { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { apiRequest, getApiBaseUrl } from '../../../services/api';
import { Motion, MotionGroup } from '../../../components/animations';
import { AnimatedCard, AnimatedButton } from '../../../components/animations/AnimatedComponents';

interface Invitation {
  id: string;
  title: string;
  message?: string;
  shareLink: string;
  allowRsvp: boolean;
  createdAt: string;
}

export default function EventInvitationsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) loadInvitations();
  }, [id]);

  const loadInvitations = async () => {
    try {
      const data = await apiRequest<any>(`/events/${id}/invitations`);
      setInvitations(data.invitations || []);
    } catch (error) {
      console.error('Failed to load invitations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async (invitation: Invitation) => {
    const url = `${getApiBaseUrl().replace('/api', '')}/api/invitations/${invitation.shareLink}`;
    try {
      await Share.share({ message: `You're invited! View the invitation here: ${url}` });
    } catch {
      // user cancelled
    }
  };

  const handleDelete = async (invitation: Invitation) => {
    Alert.alert('Delete Invitation', 'This will permanently delete the invitation link.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await apiRequest(`/events/${id}/invitations/${invitation.id}`, { method: 'DELETE' });
            await loadInvitations();
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
        data={invitations}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <>
            <Motion preset="fadeInDown" duration={500}>
              <Text style={styles.title}>Invitations</Text>
              <Text style={styles.subtitle}>{invitations.length} invitations</Text>
              <AnimatedButton
                title="🎨 Design New Invitation"
                onPress={() => router.push(`/event/${id}/designer` as any)}
                variant="secondary"
                size="large"
                animation="spring"
              />
            </Motion>
          </>
        }
        ListEmptyComponent={
          <Motion preset="zoomIn" delay={200} duration={500}>
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>✉️</Text>
              <Text style={styles.emptyTitle}>No invitations yet</Text>
              <Text style={styles.emptyText}>Design and share beautiful invitations with your guests.</Text>
            </View>
          </Motion>
        }
        renderItem={({ item, index }) => (
          <MotionGroup preset="fadeInUp" stagger={60} duration={400} delay={150}>
            <AnimatedCard preset="fadeInUp" delay={index * 60} duration={400}>
              <Text style={styles.invitationTitle}>{item.title}</Text>
              {item.message ? <Text style={styles.invitationMessage} numberOfLines={2}>{item.message}</Text> : null}
              <Text style={styles.invitationDate}>Created {new Date(item.createdAt).toLocaleDateString()}</Text>
              <View style={styles.actionsRow}>
                <TouchableOpacity style={styles.shareButton} onPress={() => handleShare(item)} activeOpacity={0.7}>
                  <Text style={styles.shareText}>Share</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item)} activeOpacity={0.7}>
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
  subtitle: { fontSize: 14, color: '#6B7280', marginTop: 4, marginBottom: 20 },
  invitationTitle: { fontSize: 17, fontWeight: '700', color: '#1F2937', marginBottom: 6 },
  invitationMessage: { fontSize: 14, color: '#6B7280', lineHeight: 20, marginBottom: 6 },
  invitationDate: { fontSize: 12, color: '#9CA3AF', marginBottom: 14 },
  actionsRow: { flexDirection: 'row', gap: 10 },
  shareButton: { flex: 1, backgroundColor: '#E91E63', borderRadius: 10, paddingVertical: 10, alignItems: 'center' },
  shareText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  deleteButton: { flex: 1, backgroundColor: '#F3F4F6', borderRadius: 10, paddingVertical: 10, alignItems: 'center' },
  deleteText: { color: '#DC2626', fontWeight: '700', fontSize: 14 },
  emptyState: { alignItems: 'center', paddingTop: 60, paddingHorizontal: 40 },
  emptyEmoji: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 22, fontWeight: '700', color: '#374151', marginBottom: 8 },
  emptyText: { fontSize: 15, color: '#9CA3AF', textAlign: 'center', lineHeight: 22 },
});
