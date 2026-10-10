import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { apiRequest } from '../services/api';
import { Motion, MotionGroup } from '../components/animations';
import { AnimatedCard } from '../components/animations/AnimatedComponents';

interface NotificationData {
  id: string;
  type: string;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
  data?: Record<string, any>;
}

const TYPE_ICONS: Record<string, string> = {
  TASK_ASSIGNED: '✅',
  TASK_COMPLETED: '🎉',
  MESSAGE: '💬',
  EVENT_REMINDER: '📅',
  GUEST_RSVP: '👥',
  EXPENSE: '💰',
  MEDIA: '📸',
  INVITATION: '✉️',
  DEFAULT: '🔔',
};

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const data = await apiRequest<any>('/notifications');
      setNotifications(data.notifications || []);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAllRead = async () => {
    try {
      await apiRequest('/notifications', { method: 'POST' });
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Failed to mark read:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#E91E63" />
      </View>
    );
  }

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <Motion preset="fadeInDown" duration={500}>
            <View style={styles.headerRow}>
              <View>
                <Text style={styles.title}>Notifications</Text>
                <Text style={styles.subtitle}>
                  {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
                </Text>
              </View>
              {unreadCount > 0 && (
                <TouchableOpacity onPress={markAllRead} activeOpacity={0.7}>
                  <Text style={styles.markAll}>Mark all read</Text>
                </TouchableOpacity>
              )}
            </View>
          </Motion>
        }
        ListEmptyComponent={
          <Motion preset="zoomIn" delay={200} duration={500}>
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>🔔</Text>
              <Text style={styles.emptyTitle}>No notifications</Text>
              <Text style={styles.emptyText}>Updates about your events, tasks and chat will appear here.</Text>
            </View>
          </Motion>
        }
        renderItem={({ item, index }) => (
          <MotionGroup preset="fadeInUp" stagger={50} duration={400} delay={100}>
            <NotificationRow notification={item} index={index} />
          </MotionGroup>
        )}
      />
    </View>
  );
}

function NotificationRow({ notification, index }: { notification: NotificationData; index: number }) {
  const icon = TYPE_ICONS[notification.type] || TYPE_ICONS.DEFAULT;
  const time = new Date(notification.createdAt).toLocaleDateString();
  return (
    <AnimatedCard preset="fadeInUp" delay={index * 50} duration={400} style={!notification.isRead ? styles.unreadCard : undefined}>
      <View style={styles.row}>
        <View style={styles.iconWrap}>
          <Text style={styles.icon}>{icon}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.notifTitle}>{notification.title}</Text>
          <Text style={styles.notifMessage} numberOfLines={2}>{notification.body}</Text>
          <Text style={styles.notifTime}>{time}</Text>
        </View>
        {!notification.isRead && <View style={styles.unreadDot} />}
      </View>
    </AnimatedCard>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F8' },
  content: { padding: 16, paddingTop: 80, paddingBottom: 48 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  title: { fontSize: 28, fontWeight: '800', color: '#1F2937' },
  subtitle: { fontSize: 14, color: '#6B7280', marginTop: 4 },
  markAll: { fontSize: 14, color: '#E91E63', fontWeight: '600', paddingTop: 6 },
  row: { flexDirection: 'row', alignItems: 'flex-start' },
  iconWrap: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FCE7F3', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  icon: { fontSize: 20 },
  info: { flex: 1 },
  notifTitle: { fontSize: 15, fontWeight: '700', color: '#1F2937' },
  notifMessage: { fontSize: 14, color: '#6B7280', marginTop: 2, lineHeight: 20 },
  notifTime: { fontSize: 12, color: '#9CA3AF', marginTop: 6 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#E91E63', marginTop: 6, marginLeft: 8 },
  unreadCard: { borderLeftWidth: 3, borderLeftColor: '#E91E63' },
  emptyState: { alignItems: 'center', paddingTop: 80, paddingHorizontal: 40 },
  emptyEmoji: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 22, fontWeight: '700', color: '#374151', marginBottom: 8 },
  emptyText: { fontSize: 15, color: '#9CA3AF', textAlign: 'center', lineHeight: 22 },
});
