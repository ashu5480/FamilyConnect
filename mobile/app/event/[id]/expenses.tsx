import { View, Text, StyleSheet, FlatList, ActivityIndicator, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { apiRequest } from '../../../services/api';
import { useAuth } from '../../../hooks/useAuth';
import { Motion, MotionGroup } from '../../../components/animations';
import { AnimatedCard, AnimatedButton } from '../../../components/animations/AnimatedComponents';

interface Expense {
  id: string;
  title: string;
  amount: number;
  currency: string;
  category?: string;
  paidBy?: string;
  date: string;
  splitAmong?: number;
}

const CATEGORIES = ['Venue', 'Food', 'Decoration', 'Photography', 'Transport', 'Clothing', 'Gifts', 'Other'];

export default function EventExpensesScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Venue');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (id) loadExpenses();
  }, [id]);

  const loadExpenses = async () => {
    try {
      const data = await apiRequest<any>(`/events/${id}/expenses`);
      setExpenses(data.expenses || []);
    } catch (error) {
      console.error('Failed to load expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    const amountNum = parseFloat(amount);
    if (!title.trim() || isNaN(amountNum) || amountNum <= 0) {
      Alert.alert('Validation', 'Title and a valid amount are required');
      return;
    }
    setAdding(true);
    try {
      await apiRequest(`/events/${id}/expenses`, {
        method: 'POST',
        body: JSON.stringify({ title: title.trim(), amount: amountNum, category, paidBy: user?.id || '' }),
      });
      setTitle('');
      setAmount('');
      await loadExpenses();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to add expense');
    } finally {
      setAdding(false);
    }
  };

  const total = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);

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
        data={expenses}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <>
            <Motion preset="fadeInDown" duration={500}>
              <Text style={styles.title}>Expenses</Text>
              <Text style={styles.subtitle}>{expenses.length} entries</Text>
            </Motion>
            <Motion preset="fadeInUp" delay={100} duration={500}>
              <AnimatedCard style={styles.totalCard}>
                <Text style={styles.totalLabel}>Total Spent</Text>
                <Text style={styles.totalValue}>₹{total.toLocaleString()}</Text>
              </AnimatedCard>
            </Motion>
            <Motion preset="fadeInUp" delay={150} duration={500}>
              <AnimatedCard>
                <Text style={styles.formTitle}>Add Expense</Text>
                <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="e.g. Catering" placeholderTextColor="#9CA3AF" />
                <TextInput style={styles.input} value={amount} onChangeText={setAmount} placeholder="Amount" placeholderTextColor="#9CA3AF" keyboardType="decimal-pad" />
                <View style={styles.categoryGrid}>
                  {CATEGORIES.map(c => (
                    <TouchableOpacity
                      key={c}
                      style={[styles.categoryChip, category === c && styles.categoryChipActive]}
                      onPress={() => setCategory(c)}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.categoryText, category === c && styles.categoryTextActive]}>{c}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <AnimatedButton title={adding ? 'Adding...' : 'Add Expense'} onPress={handleAdd} loading={adding} size="small" animation="spring" />
              </AnimatedCard>
            </Motion>
          </>
        }
        ListEmptyComponent={
          <Motion preset="zoomIn" delay={200} duration={500}>
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>💰</Text>
              <Text style={styles.emptyTitle}>No expenses yet</Text>
              <Text style={styles.emptyText}>Track event spending with your family.</Text>
            </View>
          </Motion>
        }
        renderItem={({ item, index }) => (
          <MotionGroup preset="fadeInUp" stagger={40} duration={350} delay={200}>
            <AnimatedCard preset="fadeInUp" delay={index * 40} duration={350}>
              <View style={styles.expenseRow}>
                <View style={styles.expenseInfo}>
                  <Text style={styles.expenseTitle}>{item.title}</Text>
                  <Text style={styles.expenseMeta}>
                    {item.category || 'Other'}{item.paidBy ? ` · paid by ${item.paidBy}` : ''} · {new Date(item.date).toLocaleDateString()}
                  </Text>
                </View>
                <Text style={styles.expenseAmount}>₹{(item.amount || 0).toLocaleString()}</Text>
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
  totalCard: { backgroundColor: '#E91E63', marginBottom: 16 },
  totalLabel: { fontSize: 13, color: '#FCE7F3', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 },
  totalValue: { fontSize: 32, fontWeight: '800', color: '#FFFFFF', marginTop: 6 },
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
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  categoryChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, backgroundColor: '#F3F4F6' },
  categoryChipActive: { backgroundColor: '#E91E63' },
  categoryText: { fontSize: 12, fontWeight: '600', color: '#6B7280' },
  categoryTextActive: { color: '#FFFFFF' },
  expenseRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  expenseInfo: { flex: 1, marginRight: 12 },
  expenseTitle: { fontSize: 15, fontWeight: '700', color: '#1F2937' },
  expenseMeta: { fontSize: 12, color: '#9CA3AF', marginTop: 4 },
  expenseAmount: { fontSize: 17, fontWeight: '800', color: '#E91E63' },
  emptyState: { alignItems: 'center', paddingTop: 60, paddingHorizontal: 40 },
  emptyEmoji: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 22, fontWeight: '700', color: '#374151', marginBottom: 8 },
  emptyText: { fontSize: 15, color: '#9CA3AF', textAlign: 'center', lineHeight: 22 },
});
