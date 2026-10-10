import { useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable, useWindowDimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { Motion } from '../../components/animations';
import { Button } from '../../components/ui/Button';
import { Gutter } from '../../components/ui/states';
import { BrandLogo } from '../../components/brand/BrandLogo';
import { brand, colors, typography, spacing, borderRadius, animation } from '../../constants/theme';

const SLIDES = [
  {
    eyebrow: 'Plan together',
    title: 'Every family moment, beautifully organized',
    body: 'Create events, schedule functions, and keep everyone in sync — from weddings to birthdays.',
    glyph: '◈',
  },
  {
    eyebrow: 'Coordinate effortlessly',
    title: 'Tasks, guests & chat in one home',
    body: 'Assign tasks, track RSVPs, and chat with the family — no more scattered group messages.',
    glyph: '⬡',
  },
  {
    eyebrow: 'Celebrate & remember',
    title: 'Photos and memories that last',
    body: 'Shared albums, smart cutouts, and digital invitations capture the joy long after the day.',
    glyph: '✦',
  },
];

// Concise 3-slide intro covering only implemented capabilities.
export default function OnboardingScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const progress = useSharedValue(0);
  const slide = SLIDES[index];
  progress.value = withSpring((index + 1) / SLIDES.length, animation.spring);

  const barStyle = useAnimatedStyle(() => ({ width: `${progress.value * 100}%` }));
  const go = (next: number) => {
    if (next >= SLIDES.length) {
      router.replace('/(auth)/register');
    } else {
      setIndex(next);
    }
  };

  return (
    <View style={styles.root}>
      <Gutter style={styles.inner}>
        <View style={styles.topRow}>
          <BrandLogo size="sm" />
          <Pressable onPress={() => router.replace('/(auth)/register')} accessibilityRole="button" accessibilityLabel="Skip onboarding">
            <Text style={styles.skip}>Skip</Text>
          </Pressable>
        </View>

        <Motion key={index} preset="fadeInUp" duration={animation.duration.normal}>
          <View style={styles.visual} accessibilityRole="image" accessibilityLabel={slide.title}>
            <Text style={styles.glyph}>{slide.glyph}</Text>
            <View style={styles.orbit} />
          </View>
          <Text style={styles.eyebrow}>{slide.eyebrow}</Text>
          <Text style={styles.title}>{slide.title}</Text>
          <Text style={styles.body}>{slide.body}</Text>
        </Motion>

        <View style={styles.track} accessibilityRole="progressbar" accessibilityLabel={`Step ${index + 1} of ${SLIDES.length}`}>
          <Animated.View style={[styles.fill, barStyle]} />
        </View>

        <View style={styles.actions}>
          {index > 0 ? (
            <Button title="Back" variant="ghost" onPress={() => go(index - 1)} style={{ flex: 1 }} />
          ) : null}
          <Button
            title={index === SLIDES.length - 1 ? 'Get Started' : 'Next'}
            onPress={() => go(index + 1)}
            style={{ flex: 2 }}
            hint={index === SLIDES.length - 1 ? 'Go to registration' : 'Next onboarding step'}
          />
        </View>
      </Gutter>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  inner: { flex: 1, paddingTop: 64, paddingBottom: 32 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.xxl },
  skip: { ...typography.label, color: colors.text.tertiary, padding: 12 },
  visual: {
    height: 220, borderRadius: borderRadius.xl, backgroundColor: brand.navy900,
    alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginBottom: spacing.xxl,
  },
  glyph: { fontSize: 72, color: brand.amber500 },
  orbit: {
    position: 'absolute', width: 280, height: 280, borderRadius: 140,
    borderWidth: 1.5, borderColor: 'rgba(125,162,255,0.35)',
  },
  eyebrow: { ...typography.eyebrow, color: colors.primary, marginBottom: spacing.sm },
  title: { ...typography.h1, color: colors.text.primary, marginBottom: spacing.sm },
  body: { ...typography.body, color: colors.text.secondary },
  track: { height: 6, borderRadius: 3, backgroundColor: colors.borderLight, marginTop: spacing.xxl, overflow: 'hidden' },
  fill: { height: 6, borderRadius: 3, backgroundColor: colors.primary },
  actions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.xl },
});
