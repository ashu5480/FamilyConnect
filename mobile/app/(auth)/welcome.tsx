import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Motion, MotionGroup } from '../../components/animations';
import { AnimatedButton } from '../../components/animations/AnimatedComponents';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Motion preset="fadeInDown" duration={800}>
        <View style={styles.header}>
          <Text style={styles.emoji}>👨‍👩‍👧‍👦</Text>
          <Text style={styles.title}>FamilyConnect</Text>
          <Text style={styles.tagline}>Plan. Share. Coordinate. Celebrate.</Text>
          <Text style={styles.description}>
            Your family's digital home for life's biggest moments.
          </Text>
        </View>
      </Motion>

      <MotionGroup preset="fadeInUp" stagger={80} duration={600} delay={200}>
        <View style={styles.features}>
          <FeatureItem icon="💍" text="Weddings" />
          <FeatureItem icon="🎂" text="Birthdays" />
          <FeatureItem icon="📅" text="Anniversaries" />
          <FeatureItem icon="🙏" text="Pooja" />
          <FeatureItem icon="🏠" text="Housewarming" />
          <FeatureItem icon="🍼" text="Baby Showers" />
        </View>
      </MotionGroup>

      <Motion preset="fadeInUp" delay={400} duration={600}>
        <View style={styles.actions}>
          <Text style={styles.sectionTitle}>Everything you need for family events</Text>
          <FeatureList text="Create and manage events" />
          <FeatureList text="Schedule multiple functions" />
          <FeatureList text="Track tasks and assignments" />
          <FeatureList text="Real-time family chat" />
          <FeatureList text="Guest management and RSVP" />
          <FeatureList text="AI background removal" />
          <FeatureList text="Digital invitations" />
          <FeatureList text="Shared photo albums" />
        </View>
      </Motion>

      <Motion preset="fadeInUp" delay={600} duration={600}>
        <View style={styles.footer}>
          <AnimatedButton
            title="Get Started"
            onPress={() => router.push('/(auth)/register')}
            variant="primary"
            size="large"
            animation="spring"
          />

          <AnimatedButton
            title="Sign In"
            onPress={() => router.push('/(auth)/login')}
            variant="outline"
            size="large"
            animation="spring"
          />
        </View>
      </Motion>
    </ScrollView>
  );
}

function FeatureItem({ icon, text }: { icon: string; text: string }) {
  return (
    <View style={styles.featureItem}>
      <Text style={styles.featureIcon}>{icon}</Text>
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

function FeatureList({ text }: { text: string }) {
  return (
    <View style={styles.featureListRow}>
      <Text style={styles.checkmark}>✓</Text>
      <Text style={styles.featureListText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F8' },
  content: { padding: 24, paddingTop: 80, paddingBottom: 48 },
  header: { alignItems: 'center', marginBottom: 32 },
  emoji: { fontSize: 64, marginBottom: 16 },
  title: { fontSize: 48, fontWeight: '800', color: '#E91E63', marginBottom: 8, letterSpacing: -1 },
  tagline: { fontSize: 18, color: '#8E8E90', textAlign: 'center', marginBottom: 12 },
  description: { fontSize: 16, color: '#6B7280', textAlign: 'center', lineHeight: 24 },
  features: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginBottom: 40, gap: 12 },
  featureItem: { alignItems: 'center', width: '30%' },
  featureIcon: { fontSize: 32, marginBottom: 8 },
  featureText: { fontSize: 13, color: '#374151', textAlign: 'center' },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#1F2937', marginBottom: 16 },
  actions: { gap: 12 },
  featureListRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  checkmark: { color: '#E91E63', marginRight: 8, fontWeight: '700' },
  featureListText: { fontSize: 15, color: '#374151', flex: 1 },
  footer: { marginTop: 32, gap: 12 },
});