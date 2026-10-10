import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { apiRequest } from '../../services/api';
import { Motion, MotionGroup } from '../../components/animations';
import { AnimatedCard } from '../../components/animations/AnimatedComponents';

interface TaskData {
  id: string;
  title: string;
  status: string;
  priority: string;
  dueDate?: string;
  assignedTo?: { name: string };
}

export default function TasksScreen() {
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await apiRequest<any>('/events/1/tasks');
      setTasks(data.tasks || []);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTasks = filter === 'ALL'
    ? tasks
    : tasks.filter(t => t.status === filter);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#E91E63" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Motion preset="fadeInDown" duration={400}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterBar}>
          <FilterChip label="All" active={filter === 'ALL'} onPress={() => setFilter('ALL')} />
          <FilterChip label="Todo" active={filter === 'TODO'} onPress={() => setFilter('TODO')} />
          <FilterChip label="In Progress" active={filter === 'IN_PROGRESS'} onPress={() => setFilter('IN_PROGRESS')} />
          <FilterChip label="Completed" active={filter === 'COMPLETED'} onPress={() => setFilter('COMPLETED')} />
          <FilterChip label="Overdue" active={filter === 'OVERDUE'} onPress={() => setFilter('OVERDUE')} />
        </ScrollView>
      </Motion>

      <ScrollView contentContainerStyle={styles.content}>
        {filteredTasks.length === 0 ? (
          <Motion preset="zoomIn" duration={600}>
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>✅</Text>
              <Text style={styles.emptyText}>No tasks found.</Text>
            </View>
          </Motion>
        ) : (
          <MotionGroup preset="fadeInUp" stagger={80} duration={500}>
            {filteredTasks.map(task => (
              <TaskItem key={task.id} task={task} />
            ))}
          </MotionGroup>
        )}
      </ScrollView>
    </View>
  );
}

function FilterChip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity style={[styles.chip, active && styles.chipActive]} onPress={onPress}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

function TaskItem({ task }: { task: TaskData }) {
  const statusColors: Record<string, string> = {
    TODO: '#F59E0B',
    IN_PROGRESS: '#3B82F6',
    COMPLETED: '#10B981',
    BLOCKED: '#EF4444',
  };
  const priorityColors: Record<string, string> = {
    LOW: '#6B7280',
    MEDIUM: '#F59E0B',
    HIGH: '#F97316',
    URGENT: '#EF4444',
  };
  return (
    <AnimatedCard>
      <View style={styles.taskHeader}>
        <View style={[styles.statusDot, { backgroundColor: statusColors[task.status] || '#6B7280' }]} />
        <Text style={styles.taskTitle}>{task.title}</Text>
      </View>
      <View style={styles.taskMeta}>
        <Text style={[styles.priorityBadge, { color: priorityColors[task.priority] || '#6B7280' }]}>
          {task.priority}
        </Text>
        {task.assignedTo && <Text style={styles.assignee}>👤 {task.assignedTo.name}</Text>}
        {task.dueDate && <Text style={styles.dueDate}>📅 {new Date(task.dueDate).toLocaleDateString()}</Text>}
      </View>
    </AnimatedCard>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F8' },
  filterBar: { maxHeight: 60, padding: 16, paddingBottom: 12, paddingTop: 60, flexDirection: 'row', gap: 8 },
  content: { padding: 16, paddingBottom: 48 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB' },
  chipActive: { backgroundColor: '#E91E63', borderColor: '#E91E63' },
  chipText: { color: '#6B7280', fontWeight: '600', fontSize: 13 },
  chipTextActive: { color: '#FFFFFF' },
  emptyState: { alignItems: 'center', paddingTop: 80 },
  emptyEmoji: { fontSize: 64, marginBottom: 16 },
  emptyText: { color: '#9CA3AF', fontSize: 15, textAlign: 'center' },
  taskHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  statusDot: { width: 10, height: 10, borderRadius: 5, marginRight: 10 },
  taskTitle: { fontSize: 16, fontWeight: '700', color: '#1F2937', flex: 1 },
  taskMeta: { flexDirection: 'row', alignItems: 'center', gap: 12, flexWrap: 'wrap' },
  priorityBadge: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  assignee: { fontSize: 12, color: '#6B7280' },
  dueDate: { fontSize: 12, color: '#6B7280' },
});