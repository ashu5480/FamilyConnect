import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { apiRequest } from '../../services/api';
import { Motion } from '../../components/animations';
import { Button } from '../../components/ui/Button';
import { Field } from '../../components/ui/Field';
import { Gutter } from '../../components/ui/states';
import { BrandLogo } from '../../components/brand/BrandLogo';
import { colors, typography, spacing, animation } from '../../constants/theme';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    setServerError('');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError('Enter the email you signed up with.');
      return;
    }
    setEmailError('');
    setLoading(true);
    try {
      await apiRequest('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim() }),
      });
      setSent(true);
    } catch (error: any) {
      setServerError(error.message || 'Could not send the reset link. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Gutter>
        <Motion preset="fadeInDown" duration={animation.duration.fast}>
          <BrandLogo size="sm" />
          <Text style={styles.title}>Reset password</Text>
          <Text style={styles.subtitle}>
            Enter your email and we’ll send you a link to reset your password.
          </Text>
        </Motion>

        <Motion preset="fadeInUp" delay={100} duration={animation.duration.normal}>
          <View>
            {serverError ? (
              <View style={styles.serverError} accessibilityRole="alert">
                <Text style={styles.serverErrorText}>{serverError}</Text>
              </View>
            ) : null}
            <Field
              label="Email"
              value={email}
              onChangeText={text => { setEmail(text); if (emailError) setEmailError(''); }}
              error={emailError}
              placeholder="you@example.com"
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              returnKeyType="go"
              onSubmitEditing={handleSubmit}
            />

            {sent ? (
              <View style={styles.successBox} accessibilityRole="alert">
                <Text style={styles.successText}>Reset link sent to {email.trim()}</Text>
              </View>
            ) : null}

            <Button
              title="Send Reset Link"
              onPress={handleSubmit}
              loading={loading}
              hint="Email me a password reset link"
              style={{ marginTop: spacing.sm }}
            />

            <Button title="Back to Sign In" variant="ghost" onPress={() => router.back()} />
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
  subtitle: { ...typography.body, color: colors.text.secondary, marginBottom: spacing.xxl },
  serverError: { backgroundColor: colors.error, borderRadius: 12, padding: spacing.md, marginBottom: spacing.md },
  serverErrorText: { color: '#FFFFFF', ...typography.bodySmall, fontWeight: '600' },
  successBox: { backgroundColor: colors.primaryLight, padding: spacing.lg, borderRadius: 12, marginBottom: spacing.md },
  successText: { color: colors.primaryDark, textAlign: 'center', fontWeight: '600' },
});