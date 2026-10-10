import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Motion, MotionGroup } from '../../components/animations';
import { Button } from '../../components/ui/Button';
import { Gutter } from '../../components/ui/states';
import { BrandLogo } from '../../components/brand/BrandLogo';
import { colors, typography, spacing, borderRadius, animation } from '../../constants/theme';

const OCCASIONS = ['Weddings', 'Birthdays', 'Anniversaries', 'Pooja', 'Housewarming', 'Baby Showers'];
const CAPABILITIES = [
  'Create and manage events',
  'Schedule multiple functions',
  'Track tasks and assignments',
  'Real-time family chat',
  'Guest management and RSVP',
  'AI background removal',
  'Digital invitations',
  'Shared photo albums',
];

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Gutter>
        <Motion preset="fadeInDown" duration={animation.duration.normal}>
          <View style={styles.hero}>
            <BrandLogo size="lg" />
            <Text style={styles.tagline}>Plan. Share. Coordinate. Celebrate.</Text>
            <Text style={styles.description}>
              Your family&apos;s digital home for life&apos;s biggest moments.
            </Text>
          </View>
        </Motion>

        <MotionGroup preset="fadeInUp" stagger={animation.stagger.fast} duration={animation.duration.fast} delay={150}>
          <View style={styles.chips}>
            {OCCASIONS.map(item => (
              <View key={item} style={styles.chip} accessibilityRole="text" accessibilityLabel={item}>
                <Text style={styles.chipText}>{item}</Text>
              </View>
            ))}
          </View>
        </MotionGroup>

        <Motion preset="fadeInUp" delay={300} duration={animation.duration.normal}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Everything you need for family events</Text>
            {CAPABILITIES.map(item => (
              <View key={item} style={styles.row}>
                <View style={styles.tick}>
                  <Text style={styles.tickGlyph}>✓</Text>
                </View>
                <Text style={styles.rowText}>{item}</Text>
              </View>
            ))}
          </View>
        </Motion>

        <Motion preset="fadeInUp" delay={420} duration={animation.duration.normal}>
          <View style={styles.footer}>
            <Button
              title="Get Started"
              onPress={() => router.push('/(auth)/onboarding')}
              hint="See a short intro, then create your account"
            />
            <Button
              title="Sign In"
              variant="outline"
              onPress={() => router.push('/(auth)/login')}
              hint="Sign in to your existing account"
            />
          </View>
        </Motion>
      </Gutter>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: { paddingTop: 72, paddingBottom: 48 },
  hero: { alignItems: 'flex-start', marginBottom: spacing.xxl },
  tagline: { ...typography.h3, color: colors.text.primary, marginTop: spacing.lg },
  description: { ...typography.body, color: colors.text.secondary, marginTop: spacing.sm },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.xxl },
  chip: {
    paddingHorizontal: spacing.lg, paddingVertical: 10,
    borderRadius: borderRadius.pill, backgroundColor: colors.primaryLight,
  },
  chipText: { ...typography.bodySmall, fontWeight: '600', color: colors.primaryDark },
  card: {
    backgroundColor: colors.surface, borderRadius: borderRadius.lg,
    padding: spacing.xl, borderWidth: 1, borderColor: colors.borderLight, gap: spacing.sm,
  },
  cardTitle: { ...typography.h4, color: colors.text.primary, marginBottom: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: 5 },
  tick: {
    width: 24, height: 24, borderRadius: 12, backgroundColor: colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  tickGlyph: { fontSize: 13, fontWeight: '800', color: colors.primary },
  rowText: { ...typography.bodyMedium, color: colors.text.primary, flex: 1 },
  footer: { marginTop: spacing.xxl, gap: spacing.md },
});