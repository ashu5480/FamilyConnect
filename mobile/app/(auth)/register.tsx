import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { Motion, MotionGroup } from '../../components/animations';
import { Button } from '../../components/ui/Button';
import { Field } from '../../components/ui/Field';
import { Gutter } from '../../components/ui/states';
import { BrandLogo } from '../../components/brand/BrandLogo';
import { colors, typography, spacing, animation } from '../../constants/theme';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [relationship, setRelationship] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { register } = useAuth();

  const validate = () => {
    const next: Record<string, string> = {};
    if (name.trim().length < 2) next.name = 'Tell us your name (at least 2 characters).';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = 'Enter a valid email address.';
    if (password.length < 6) next.password = 'Use at least 6 characters.';
    if (confirmPassword !== password) next.confirmPassword = 'Passwords don’t match yet.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleRegister = async () => {
    setServerError('');
    if (!validate()) return;
    setLoading(true);
    try {
      // Navigate only after the server confirms account creation.
      await register({ name: name.trim(), email: email.trim(), password, phone, relationship });
      router.replace('/(tabs)');
    } catch (error: any) {
      setServerError(error.message || 'Could not create your account. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const set = (key: string) => (value: string) => {
    if (key === 'name') setName(value);
    if (key === 'email') setEmail(value);
    if (key === 'password') setPassword(value);
    if (key === 'confirmPassword') setConfirmPassword(value);
    if (key === 'phone') setPhone(value);
    if (key === 'relationship') setRelationship(value);
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: '' }));
  };

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Gutter>
        <Motion preset="fadeInDown" duration={animation.duration.fast}>
          <BrandLogo size="sm" />
          <Text style={styles.title}>Create your account</Text>
          <Text style={styles.subtitle}>Start your family’s event journey</Text>
        </Motion>

        <MotionGroup preset="fadeInUp" stagger={animation.stagger.fast} duration={animation.duration.fast} delay={100}>
          <View>
            {serverError ? (
              <View style={styles.serverError} accessibilityRole="alert">
                <Text style={styles.serverErrorText}>{serverError}</Text>
              </View>
            ) : null}
            <Field label="Full Name" value={name} onChangeText={set('name')} error={errors.name} placeholder="Your name" autoComplete="name" />
            <Field label="Email" value={email} onChangeText={set('email')} error={errors.email} placeholder="you@example.com" autoCapitalize="none" autoComplete="email" keyboardType="email-address" />
            <Field label="Password" value={password} onChangeText={set('password')} error={errors.password} placeholder="At least 6 characters" secureTextEntry autoComplete="new-password" hint="At least 6 characters." />
            <Field label="Confirm Password" value={confirmPassword} onChangeText={set('confirmPassword')} error={errors.confirmPassword} placeholder="Repeat password" secureTextEntry autoComplete="new-password" />
            <Field label="Phone (optional)" value={phone} onChangeText={set('phone')} placeholder="+91 98765 43210" keyboardType="phone-pad" autoComplete="tel" />
            <Field label="Relationship (optional)" value={relationship} onChangeText={set('relationship')} placeholder="e.g. Father, Mother, Brother" />
          </View>
        </MotionGroup>

        <Motion preset="fadeInUp" delay={380} duration={animation.duration.normal}>
          <Button title="Create Account" onPress={handleRegister} loading={loading} hint="Create your FamilyConnect account" />
          <View style={styles.signUpRow}>
            <Text style={styles.signUpText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/login')} accessibilityRole="button" accessibilityLabel="Sign in">
              <Text style={styles.signUpLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </Motion>
      </Gutter>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: { paddingTop: 72, paddingBottom: 48 },
  title: { ...typography.h1, color: colors.text.primary, marginTop: spacing.lg, marginBottom: 4 },
  subtitle: { ...typography.body, color: colors.text.secondary, marginBottom: spacing.xl },
  serverError: { backgroundColor: colors.error, borderRadius: 12, padding: spacing.md, marginBottom: spacing.md },
  serverErrorText: { color: '#FFFFFF', ...typography.bodySmall, fontWeight: '600' },
  signUpRow: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.lg },
  signUpText: { color: colors.text.secondary, fontSize: 14 },
  signUpLink: { color: colors.primary, fontSize: 14, fontWeight: '700' },
});