import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { Motion } from '../../components/animations';
import { Button } from '../../components/ui/Button';
import { Field } from '../../components/ui/Field';
import { Gutter } from '../../components/ui/states';
import { BrandLogo } from '../../components/brand/BrandLogo';
import { colors, typography, spacing, animation } from '../../constants/theme';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const validate = () => {
    let ok = true;
    if (!email.trim()) {
      setEmailError('Enter your email address.');
      ok = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError('That email doesn’t look right — check for typos.');
      ok = false;
    } else {
      setEmailError('');
    }
    if (!password) {
      setPasswordError('Enter your password.');
      ok = false;
    } else {
      setPasswordError('');
    }
    return ok;
  };

  const handleLogin = async () => {
    setServerError('');
    if (!validate()) return;
    setLoading(true);
    try {
      // Success navigation only after the server confirms the session.
      await login(email.trim(), password);
      router.replace('/(tabs)');
    } catch (error: any) {
      setServerError(error.message || 'Could not sign you in. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Gutter>
        <Motion preset="fadeInDown" duration={animation.duration.fast}>
          <BrandLogo size="sm" />
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Sign in to your family account</Text>
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
              returnKeyType="next"
            />
            <Field
              label="Password"
              value={password}
              onChangeText={text => { setPassword(text); if (passwordError) setPasswordError(''); }}
              error={passwordError}
              placeholder="Enter your password"
              secureTextEntry
              autoComplete="password"
              returnKeyType="go"
              onSubmitEditing={handleLogin}
            />

            <TouchableOpacity
              style={styles.forgotLink}
              onPress={() => router.push('/(auth)/forgot-password')}
              accessibilityRole="button"
              accessibilityLabel="Forgot password"
            >
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>

            <Button
              title="Sign In"
              onPress={handleLogin}
              loading={loading}
              hint="Sign in to your account"
              style={{ marginTop: spacing.md }}
            />

            <View style={styles.signUpRow}>
              <Text style={styles.signUpText}>Don&apos;t have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/register')} accessibilityRole="button" accessibilityLabel="Create an account">
                <Text style={styles.signUpLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
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
  serverError: {
    backgroundColor: colors.error,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  serverErrorText: { color: '#FFFFFF', ...typography.bodySmall, fontWeight: '600' },
  forgotLink: { alignItems: 'flex-end', paddingVertical: spacing.sm },
  forgotText: { color: colors.primary, fontSize: 14, fontWeight: '600' },
  signUpRow: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.lg },
  signUpText: { color: colors.text.secondary, fontSize: 14 },
  signUpLink: { color: colors.primary, fontSize: 14, fontWeight: '700' },
});