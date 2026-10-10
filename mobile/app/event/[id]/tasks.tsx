import { View, Text, StyleSheet, FlatList, ActivityIndicator, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { apiRequest } from '../../../services/api';
import { Motion, MotionGroup } from '../../../components/animations';
import { AnimatedCard, AnimatedButton } from '../../../components/animations/AnimatedComponents';

interface TaskData {
  id: string;
  title: string;
  description?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  dueDate?: string;
  assigneeName?: string;
}

const PRIORITY_COLORS: Record<string, string> = { HIGH: '#DC2626', MEDIUM: '#F59E0B', LOW: '#10B981' };
const STATUS_LABELS: Record<string, string> = { TODO: 'To Do', IN_PROGRESS: 'In Progress', DONE: 'Done' };

export default function EventTasksScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('ALL');
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (id) loadTasks();
  }, [id]);

  const loadTasks = async () => {
    try {
      const data = await apiRequest<any>(`/events/${id}/tasks`);
      setTasks(data.tasks || []);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!title.trim()) {
      Alert.alert('Validation', 'Task title is required');
      return;
    }
    setAdding(true);
    try {
      await apiRequest(`/events/${id}/tasks`, {
        method: 'POST',
        body: JSON.stringify({ title: title.trim(), priority }),
      });
      setTitle('');
      await loadTasks();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to add task');
    } finally {
      setAdding(false);
    }
  };

  const handleToggleStatus = async (task: TaskData) => {
    const next = task.status === 'DONE' ? 'TODO' : 'DONE';
    try {
      await apiRequest(`/events/${id}/tasks/${task.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: next }),
      });
      await loadTasks();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update task');
    }
  };

  const filtered = filter === 'ALL' ? tasks : tasks.filter(t => t.status === filter);
  const doneCount = tasks.filter(t => t.status === 'DONE').length;

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
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <>
            <Motion preset="fadeInDown" duration={500}>
              <Text style={styles.title}>Tasks</Text>
              <Text style={styles.subtitle}>{doneCount}/{tasks.length} completed</Text>
            </Motion>
            <Motion preset="fadeInUp" delay={100} duration={500}>
              <View style={styles.filterRow}>
                {['ALL', 'TODO', 'IN_PROGRESS', 'DONE'].map(f => (
                  <TouchableOpacity
                    key={f}
                    style={[styles.filterChip, filter === f && styles.filterChipActive]}
                    onPress={() => setFilter(f)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
                      {f === 'ALL' ? 'All' : STATUS_LABELS[f]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Motion>
            <Motion preset="fadeInUp" delay={150} duration={500}>
              <AnimatedCard>
                <TextInput
                  style={styles.input}
                  value={title}
                  onChangeText={setTitle}
                  placeholder="New task..."
                  placeholderTextColor="#9CA3AF"
                />
                <View style={styles.priorityRow}>
                  {(['LOW', 'MEDIUM', 'HIGH'] as const).map(p => (
                    <TouchableOpacity
                      key={p}
                      style={[styles.priorityChip, priority === p && { backgroundColor: PRIORITY_COLORS[p] }]}
                      onPress={() => setPriority(p)}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.priorityText, priority === p && styles.priorityTextActive]}>{p}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <AnimatedButton title={adding ? 'Adding...' : 'Add Task'} onPress={handleAdd} loading={adding} size="small" animation="spring" />
              </AnimatedCard>
            </Motion>
          </>
        }
        ListEmptyComponent={
          <Motion preset="zoomIn" delay={200} duration={500}>
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>✅</Text>
              <Text style={styles.emptyTitle}>No tasks</Text>
              <Text style={styles.emptyText}>Add tasks to coordinate with your family.</Text>
            </View>
          </Motion>
        }
        renderItem={({ item, index }) => (
          <MotionGroup preset="fadeInUp" stagger={40} duration={350} delay={200}>
            <AnimatedCard preset="fadeInUp" delay={index * 40} duration={350}>
              <TouchableOpacity onPress={() => handleToggleStatus(item)} activeOpacity={0.7} style={styles.taskRow}>
                <View style={[styles.checkbox, item.status === 'DONE' && styles.checkboxDone]}>
                  {item.status === 'DONE' && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <View style={styles.taskInfo}>
                  <Text style={[styles.taskTitle, item.status === 'DONE' && styles.taskTitleDone]}>{item.title}</Text>
                  <View style={styles.taskMetaRow}>
                    <View style={[styles.priorityDot, { backgroundColor: PRIORITY_COLORS[item.priority] }]} />
                    <Text style={styles.taskMeta}>{item.priority} priority</Text>
                    {item.assigneeName ? <Text style={styles.taskMeta}> · {item.assigneeName}</Text> : null}
                  </View>
                </View>
                <Text style={styles.statusLabel}>{STATUS_LABELS[item.status]}</Text>
              </TouchableOpacity>
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
  filterRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#FFFFFF' },
  filterChipActive: { backgroundColor: '#E91E63' },
  filterText: { fontSize: 13, fontWeight: '600', color: '#6B7280' },
  filterTextActive: { color: '#FFFFFF' },
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
  priorityRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  priorityChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, backgroundColor: '#F3F4F6' },
  priorityText: { fontSize: 12, fontWeight: '700', color: '#6B7280' },
  priorityTextActive: { color: '#FFFFFF' },
  taskRow: { flexDirection: 'row', alignItems: 'center' },
  checkbox: { width: 26, height: 26, borderRadius: 8, borderWidth: 2, borderColor: '#D1D5DB', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  checkboxDone: { backgroundColor: '#E91E63', borderColor: '#E91E63' },
  checkmark: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
  taskInfo: { flex: 1 },
  taskTitle: { fontSize: 15, fontWeight: '600', color: '#1F2937' },
  taskTitleDone: { textDecorationLine: 'line-through', color: '#9CA3AF' },
  taskMetaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  priorityDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  taskMeta: { fontSize: 12, color: '#9CA3AF' },
  statusLabel: { fontSize: 11, fontWeight: '700', color: '#E91E63' },
  emptyState: { alignItems: 'center', paddingTop: 60, paddingHorizontal: 40 },
  emptyEmoji: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 22, fontWeight: '700', color: '#374151', marginBottom: 8 },
  emptyText: { fontSize: 15, color: '#9CA3AF', textAlign: 'center', lineHeight: 22 },
});
