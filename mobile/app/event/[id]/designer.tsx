import { View, Text, StyleSheet, ScrollView, TextInput, ActivityIndicator, TouchableOpacity, Alert, Image } from 'react-native';
import { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { apiRequest, getApiBaseUrl } from '../../../services/api';
import { Motion } from '../../../components/animations';
import { AnimatedButton, AnimatedCard } from '../../../components/animations/AnimatedComponents';

interface DesignElement {
  id: string;
  type: 'text' | 'image' | 'cutout';
  content: string;
  x: number;
  y: number;
  fontSize?: number;
  color?: string;
  rotation?: number;
  scale?: number;
}

const TEMPLATES = ['Classic', 'Modern', 'Royal', 'Minimal', 'Floral'];
const TEXT_COLORS = ['#1F2937', '#E91E63', '#FFFFFF', '#F59E0B', '#10B981'];

export default function InvitationDesignerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [template, setTemplate] = useState('Classic');
  const [backgroundColor, setBackgroundColor] = useState('#FFF5F8');
  const [elements, setElements] = useState<DesignElement[]>([
    { id: 'title', type: 'text', content: 'You are invited!', x: 50, y: 20, fontSize: 28, color: '#E91E63', rotation: 0, scale: 1 },
    { id: 'subtitle', type: 'text', content: 'To celebrate with us', x: 50, y: 35, fontSize: 16, color: '#1F2937', rotation: 0, scale: 1 },
  ]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [newText, setNewText] = useState('');

  const selected = elements.find(e => e.id === selectedId) || null;

  const addTextElement = () => {
    if (!newText.trim()) return;
    setElements(prev => [
      ...prev,
      { id: `text-${Date.now()}`, type: 'text', content: newText.trim(), x: 50, y: 50, fontSize: 18, color: '#1F2937', rotation: 0, scale: 1 },
    ]);
    setNewText('');
  };

  const addCutout = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 });
    if (result.canceled || !result.assets?.[0]) return;
    setElements(prev => [
      ...prev,
      { id: `cutout-${Date.now()}`, type: 'cutout', content: result.assets[0].uri, x: 50, y: 50, rotation: 0, scale: 1 },
    ]);
  };

  const updateSelected = (patch: Partial<DesignElement>) => {
    if (!selectedId) return;
    setElements(prev => prev.map(e => (e.id === selectedId ? { ...e, ...patch } : e)));
  };

  const removeElement = (elementId: string) => {
    setElements(prev => prev.filter(e => e.id !== elementId));
    if (selectedId === elementId) setSelectedId(null);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiRequest('/designs', {
        method: 'POST',
        body: JSON.stringify({
          eventId: id,
          name: 'Invitation',
          type: 'INVITATION',
          template,
          background: backgroundColor,
          elements: elements.map((e, i) => ({
            type: e.type === 'text' ? 'TEXT' : 'IMAGE',
            content: e.content,
            x: e.x,
            y: e.y,
            width: e.type === 'text' ? 200 : 120,
            height: e.type === 'text' ? (e.fontSize || 18) * 1.5 : 120,
            rotation: e.rotation || 0,
            opacity: 1,
            fontSize: e.fontSize,
            color: e.color,
            textAlign: 'center',
            zIndex: i,
          })),
        }),
      });
      Alert.alert('Saved', 'Invitation design saved.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save design');
    } finally {
      setSaving(false);
    }
  };

  const templateBackgrounds: Record<string, string> = {
    Classic: '#FFF5F8',
    Modern: '#FFFFFF',
    Royal: '#FDF6E3',
    Minimal: '#FAFAFA',
    Floral: '#F0FDF4',
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Motion preset="fadeInDown" duration={500}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton} activeOpacity={0.7}>
            <Text style={styles.backText}>‹ Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Invitation Designer</Text>
        </Motion>

        <Motion preset="fadeInUp" delay={100} duration={500}>
          <Text style={styles.sectionTitle}>Template</Text>
          <View style={styles.templateRow}>
            {TEMPLATES.map(t => (
              <TouchableOpacity
                key={t}
                style={[styles.templateChip, template === t && styles.templateChipActive]}
                onPress={() => {
                  setTemplate(t);
                  setBackgroundColor(templateBackgrounds[t]);
                }}
                activeOpacity={0.7}
              >
                <Text style={[styles.templateText, template === t && styles.templateTextActive]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Motion>

        <Motion preset="fadeInUp" delay={150} duration={500}>
          <Text style={styles.sectionTitle}>Canvas Preview</Text>
          <AnimatedCard style={{ ...styles.canvas, backgroundColor }}>
            {elements.map(element => (
              <TouchableOpacity
                key={element.id}
                style={[
                  styles.canvasElement,
                  {
                    left: `${element.x}%`,
                    top: `${element.y}%`,
                    transform: [{ rotate: `${element.rotation || 0}deg` }, { scale: element.scale || 1 }],
                  },
                  selectedId === element.id && styles.canvasElementSelected,
                ]}
                onPress={() => setSelectedId(element.id)}
                activeOpacity={0.8}
              >
                {element.type === 'text' ? (
                  <Text style={{ fontSize: element.fontSize, color: element.color, fontWeight: '700', textAlign: 'center' }}>
                    {element.content}
                  </Text>
                ) : (
                  <Image source={{ uri: element.content }} style={styles.canvasImage} resizeMode="contain" />
                )}
              </TouchableOpacity>
            ))}
          </AnimatedCard>
        </Motion>

        {selected && (
          <Motion preset="fadeInUp" delay={200} duration={500}>
            <AnimatedCard>
              <Text style={styles.sectionTitle}>Selected Element</Text>
              {selected.type === 'text' && (
                <>
                  <TextInput
                    style={styles.input}
                    value={selected.content}
                    onChangeText={text => updateSelected({ content: text })}
                    placeholder="Text"
                    placeholderTextColor="#9CA3AF"
                  />
                  <TextInput
                    style={styles.input}
                    value={String(selected.fontSize || 18)}
                    onChangeText={text => updateSelected({ fontSize: parseInt(text) || 18 })}
                    placeholder="Font size"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="number-pad"
                  />
                  <View style={styles.colorRow}>
                    {TEXT_COLORS.map(c => (
                      <TouchableOpacity
                        key={c}
                        style={[styles.colorSwatch, { backgroundColor: c }, selected.color === c && styles.colorSwatchActive]}
                        onPress={() => updateSelected({ color: c })}
                        activeOpacity={0.7}
                      />
                    ))}
                  </View>
                </>
              )}
              <View style={styles.controlRow}>
                <TouchableOpacity style={styles.controlButton} onPress={() => updateSelected({ rotation: (selected.rotation || 0) + 15 })} activeOpacity={0.7}>
                  <Text style={styles.controlText}>↻ Rotate</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.controlButton} onPress={() => updateSelected({ scale: Math.min((selected.scale || 1) + 0.1, 3) })} activeOpacity={0.7}>
                  <Text style={styles.controlText}>＋ Bigger</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.controlButton} onPress={() => updateSelected({ scale: Math.max((selected.scale || 1) - 0.1, 0.3) })} activeOpacity={0.7}>
                  <Text style={styles.controlText}>－ Smaller</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.deleteButton} onPress={() => removeElement(selected.id)} activeOpacity={0.7}>
                <Text style={styles.deleteText}>Delete Element</Text>
              </TouchableOpacity>
            </AnimatedCard>
          </Motion>
        )}

        <Motion preset="fadeInUp" delay={250} duration={500}>
          <Text style={styles.sectionTitle}>Add Elements</Text>
          <AnimatedCard>
            <TextInput
              style={styles.input}
              value={newText}
              onChangeText={setNewText}
              placeholder="Text to add..."
              placeholderTextColor="#9CA3AF"
            />
            <View style={styles.addRow}>
              <AnimatedButton title="+ Add Text" onPress={addTextElement} variant="secondary" size="small" animation="spring" />
              <AnimatedButton title="🖼 Add Image" onPress={addCutout} variant="outline" size="small" animation="spring" />
            </View>
          </AnimatedCard>
        </Motion>

        <Motion preset="fadeInUp" delay={300} duration={500}>
          <AnimatedButton
            title={saving ? 'Saving...' : 'Save Invitation'}
            onPress={handleSave}
            loading={saving}
            size="large"
            animation="spring"
          />
        </Motion>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F8' },
  content: { padding: 16, paddingTop: 80, paddingBottom: 48 },
  backButton: { marginBottom: 12 },
  backText: { fontSize: 16, color: '#E91E63', fontWeight: '600' },
  title: { fontSize: 28, fontWeight: '800', color: '#1F2937', marginBottom: 20 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: '#E91E63', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10, marginTop: 8 },
  templateRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  templateChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#FFFFFF' },
  templateChipActive: { backgroundColor: '#E91E63' },
  templateText: { fontSize: 14, fontWeight: '600', color: '#6B7280' },
  templateTextActive: { color: '#FFFFFF' },
  canvas: { height: 320, borderRadius: 16, overflow: 'hidden', position: 'relative', marginBottom: 16 },
  canvasElement: { position: 'absolute', padding: 4 },
  canvasElementSelected: { borderWidth: 2, borderColor: '#E91E63', borderStyle: 'dashed', borderRadius: 4 },
  canvasImage: { width: 120, height: 120 },
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
  colorRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  colorSwatch: { width: 32, height: 32, borderRadius: 16 },
  colorSwatchActive: { borderWidth: 3, borderColor: '#1F2937' },
  controlRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  controlButton: { flex: 1, backgroundColor: '#F3F4F6', borderRadius: 10, paddingVertical: 10, alignItems: 'center' },
  controlText: { fontSize: 13, fontWeight: '700', color: '#374151' },
  deleteButton: { backgroundColor: '#FEE2E2', borderRadius: 10, paddingVertical: 10, alignItems: 'center' },
  deleteText: { color: '#DC2626', fontWeight: '700', fontSize: 14 },
  addRow: { flexDirection: 'row', gap: 10 },
});
