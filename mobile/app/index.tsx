import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSequence, withDelay } from 'react-native-reanimated';
import { useAuth } from '../hooks/useAuth';
import { Gutter } from '../components/ui/states';
import { SplashMark } from '../components/brand/BrandLogo';
import { brand, colors, typography, animation } from '../constants/theme';

// Branded launch gate: logo scales in, then routes by session state.
// Short by design — no artificial delay beyond the entrance (~600ms).
export default function Index() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const scale = useSharedValue(0.85);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withSequence(
      withTiming(1.04, { duration: 320 }),
      withTiming(1, { duration: 220 }),
    );
    opacity.value = withDelay(60, withTiming(1, { duration: 320 }));
  }, []);

  useEffect(() => {
    if (isLoading) return;
    const t = setTimeout(() => {
      router.replace(isAuthenticated ? '/(tabs)' : '/(auth)/welcome');
    }, 650);
    return () => clearTimeout(t);
  }, [isAuthenticated, isLoading]);

  const markStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <View style={styles.root}>
      <Gutter style={styles.inner}>
        <Animated.View style={[styles.center, markStyle]}>
          <SplashMark size={112} />
          <Text style={styles.word}>FamilyConnect</Text>
          <Text style={styles.tag}>Plan. Share. Coordinate. Celebrate.</Text>
        </Animated.View>
      </Gutter>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: brand.navy900 },
  inner: { flex: 1, justifyContent: 'center' },
  center: { alignItems: 'center' },
  word: { ...typography.h1, color: '#FFFFFF', marginTop: 24, letterSpacing: -0.8 },
  tag: { ...typography.bodySmall, color: '#B9C2DA', marginTop: 8 },
});