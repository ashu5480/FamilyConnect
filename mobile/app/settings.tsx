import { View, Text, StyleSheet, ScrollView, Switch, Alert } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Motion } from '../components/animations';
import { Button } from '../components/ui/Button';
import { Gutter } from '../components/ui/states';
import { getApiBaseUrl, clearTokens } from '../services/api';
import { colors, typography, spacing, borderRadius, animation } from '../constants/theme';

export default function SettingsScreen() {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
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
    <ScrollView style={styles.root} contentContainerStyle={styles.scrollContent}>
      <Gutter style={styles.content}>
        <Motion preset="fadeInDown" duration={animation.duration.fast}>
          <Text style={styles.title}>Settings</Text>
        </Motion>

        <Motion preset="fadeInUp" delay={100} duration={animation.duration.normal}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.card}>
            <SettingRow label="Push Notifications" hint="Event reminders and family updates" value={notificationsEnabled} onChange={setNotificationsEnabled} />
            <View style={styles.divider} />
            <SettingRow label="Dark Mode" hint="Coming soon — light theme for now" value={darkMode} onChange={setDarkMode} />
          </View>
        </Motion>

        <Motion preset="fadeInUp" delay={200} duration={animation.duration.normal}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.card}>
            <InfoRow label="Version" value="1.0.0" />
            <View style={styles.divider} />
            <InfoRow label="Platform" value="Expo / React Native" />
            <View style={styles.divider} />
            <InfoRow label="API" value={getApiBaseUrl()} />
            <View style={styles.divider} />
            <View style={styles.attribution}>
              <Text style={styles.attributionLine}>Created by JIYAI Technology</Text>
              <Text style={styles.attributionLine}>Founder: Ashutosh Singh</Text>
            </View>
          </View>
        </Motion>

        <Motion preset="fadeInUp" delay={300} duration={animation.duration.normal}>
          <Text style={styles.sectionTitle}>Data</Text>
          <View style={styles.card}>
            <Button title="Clear Local Data & Log Out" variant="danger" onPress={handleClearData} hint="Sign out and remove tokens on this device" />
          </View>
        </Motion>
      </Gutter>
    </ScrollView>
  );
}

function SettingRow({ label, hint, value, onChange }: { label: string; hint?: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <View style={styles.settingRow}>
      <View style={{ flex: 1 }}>
        <Text style={styles.settingLabel}>{label}</Text>
        {hint ? <Text style={styles.settingHint}>{hint}</Text> : null}
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: colors.border, true: colors.primaryLight }}
        thumbColor={value ? colors.primary : '#FFFFFF'}
        accessibilityRole="switch"
        accessibilityLabel={label}
        accessibilityState={{ checked: value }}
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
  root: { flex: 1, backgroundColor: colors.background },
  content: { paddingTop: 60 },
  scrollContent: { paddingBottom: 48 },
  title: { ...typography.h1, color: colors.text.primary, marginBottom: spacing.xl },
  sectionTitle: { ...typography.eyebrow, color: colors.primary, marginBottom: spacing.sm, marginTop: spacing.sm },
  card: {
    backgroundColor: colors.surface, borderRadius: borderRadius.lg,
    padding: spacing.xl, borderWidth: 1, borderColor: colors.borderLight, marginBottom: spacing.lg,
  },
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 6, gap: spacing.md },
  settingLabel: { fontSize: 16, color: colors.text.primary, fontWeight: '500' },
  settingHint: { ...typography.bodySmall, color: colors.text.tertiary, marginTop: 2 },
  infoValue: { fontSize: 13, color: colors.text.secondary, maxWidth: '60%', textAlign: 'right' },
  divider: { height: 1, backgroundColor: colors.borderLight, marginVertical: spacing.md },
  attribution: { alignItems: 'center', paddingTop: spacing.sm },
  attributionLine: { ...typography.bodySmall, color: colors.text.tertiary, textAlign: 'center' },
});
