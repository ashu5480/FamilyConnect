import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { brand, typography, spacing, a11y } from '../../constants/theme';

interface BrandLogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  showWordmark?: boolean;
  style?: ViewStyle;
}

// Original FamilyConnect mark: navy shield (trust/safety) holding an amber
// heart (warmth) formed by three connected nodes (family/belonging).
// Pure vector — no emoji, no stock icon. Web renders it crisply; on native
// it is drawn with Views so there is zero extra dependency.
export function BrandLogo({ variant = 'light', size = 'md', showWordmark = true, style }: BrandLogoProps) {
  const dims = size === 'sm' ? 40 : size === 'lg' ? 76 : 56;
  const ink = variant === 'dark' ? '#FFFFFF' : brand.navy900;
  const sub = variant === 'dark' ? '#7DA2FF' : brand.royal600;
  return (
    <View style={[styles.row, style]} accessibilityRole="image" accessibilityLabel="FamilyConnect logo">
      <View style={[styles.mark, { width: dims, height: dims, borderRadius: dims * 0.27, backgroundColor: brand.navy800 }]}>
        <View style={[styles.nodeRow, { marginTop: dims * 0.18 }]}>
          <View style={[styles.node, { width: dims * 0.13, height: dims * 0.13 }]} />
          <View style={[styles.node, styles.nodeCenter, { width: dims * 0.155, height: dims * 0.155 }]} />
          <View style={[styles.node, styles.nodeDim, { width: dims * 0.13, height: dims * 0.13 }]} />
        </View>
        <View style={[styles.heart, { width: dims * 0.52, height: dims * 0.46, borderRadius: dims * 0.12, backgroundColor: brand.amber500 }]} />
        <View style={[styles.arc, { width: dims * 0.62, height: dims * 0.3, borderColor: '#FFFFFF', borderWidth: Math.max(2, dims * 0.055) }]} />
      </View>
      {showWordmark ? (
        <View style={{ marginLeft: size === 'sm' ? spacing.sm : spacing.md }}>
          <Text style={[styles.word, { color: ink, fontSize: size === 'sm' ? 19 : size === 'lg' ? 30 : 24 }]}>Family</Text>
          <Text style={[styles.word, { color: sub, fontSize: size === 'sm' ? 19 : size === 'lg' ? 30 : 24 }]}>Connect</Text>
        </View>
      ) : null}
    </View>
  );
}

export function SplashMark({ size = 112 }: { size?: number }) {
  return (
    <View style={[styles.splash, { width: size, height: size, borderRadius: size * 0.28 }]} accessibilityRole="image" accessibilityLabel="FamilyConnect">
      <View style={styles.splashNodes}>
        <View style={styles.splashNode} />
        <View style={[styles.splashNode, styles.splashNodeCenter]} />
        <View style={[styles.splashNode, styles.nodeDim]} />
      </View>
      <View style={styles.splashHeart} />
      <View style={styles.splashArc} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', minHeight: a11y.minTouchTarget },
  mark: { alignItems: 'center', overflow: 'hidden' },
  nodeRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  node: { borderRadius: 999, backgroundColor: '#FFFFFF' },
  nodeCenter: {},
  nodeDim: { opacity: 0.85 },
  heart: { marginTop: 1 },
  arc: { borderRadius: 999, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: 'transparent', marginTop: -6, opacity: 0.9 },
  word: { ...typography.h2, letterSpacing: -0.5, lineHeight: undefined },
  splash: { backgroundColor: brand.navy800, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  splashNodes: { flexDirection: 'row', gap: 7, marginTop: 18 },
  splashNode: { width: 15, height: 15, borderRadius: 999, backgroundColor: '#FFFFFF' },
  splashNodeCenter: { width: 18, height: 18 },
  splashHeart: { width: 58, height: 50, borderRadius: 13, backgroundColor: brand.amber500, marginTop: 2 },
  splashArc: { width: 70, height: 34, borderRadius: 999, borderWidth: 6, borderColor: '#FFFFFF', borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: 'transparent', marginTop: -7, opacity: 0.9 },
});
