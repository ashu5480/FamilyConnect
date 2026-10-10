import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Motion } from '../components/animations';
import { AnimatedCard } from '../components/animations/AnimatedComponents';
import { clearTokens } from '../services/api';

export default function SettingsScreen() {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleClearData = () => {
    Alert.alert('Clear Data', 'This will log you out and clear stored tokens.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: async () => {
          await clearTokens();
          router.replace('/(auth)/welcome');
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Motion preset="fadeInDown" duration={500}>
        <Text style={styles.title}>Settings</Text>
      </Motion>

      <Motion preset="fadeInUp" delay={100} duration={500}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <AnimatedCard>
          <SettingRow
            label="Push Notifications"
            value={notificationsEnabled}
            onChange={setNotificationsEnabled}
          />
          <View style={styles.divider} />
          <SettingRow label="Haptic Feedback" value={hapticsEnabled} onChange={setHapticsEnabled} />
          <View style={styles.divider} />
          <SettingRow label="Dark Mode" value={darkMode} onChange={setDarkMode} />
        </AnimatedCard>
      </Motion>

      <Motion preset="fadeInUp" delay={200} duration={500}>
        <Text style={styles.sectionTitle}>About</Text>
        <AnimatedCard>
          <InfoRow label="Version" value="1.0.0" />
          <View style={styles.divider} />
          <InfoRow label="Platform" value="Expo / React Native" />
          <View style={styles.divider} />
          <InfoRow label="API" value="https://familyconnect-api.vercel.app" />
        </AnimatedCard>
      </Motion>

      <Motion preset="fadeInUp" delay={300} duration={500}>
        <Text style={styles.sectionTitle}>Data</Text>
        <AnimatedCard>
          <TouchableOpacity style={styles.dangerRow} onPress={handleClearData} activeOpacity={0.7}>
            <Text style={styles.dangerText}>Clear Local Data & Logout</Text>
          </TouchableOpacity>
        </AnimatedCard>
      </Motion>
    </ScrollView>
  );
}

function SettingRow({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <View style={styles.settingRow}>
      <Text style={styles.settingLabel}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: '#E5E7EB', true: '#F9A8D4' }}
        thumbColor={value ? '#E91E63' : '#FFFFFF'}
      />
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.settingRow}>
      <Text style={styles.settingLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F8' },
  content: { padding: 16, paddingTop: 80, paddingBottom: 48 },
  title: { fontSize: 28, fontWeight: '800', color: '#1F2937', marginBottom: 24 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: '#E91E63', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, marginTop: 8 },
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 4 },
  settingLabel: { fontSize: 16, color: '#374151', fontWeight: '500' },
  infoValue: { fontSize: 14, color: '#6B7280', maxWidth: '60%', textAlign: 'right' },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 12 },
  dangerRow: { paddingVertical: 8 },
  dangerText: { fontSize: 16, color: '#DC2626', fontWeight: '600' },
});
