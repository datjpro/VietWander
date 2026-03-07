import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { designAssets, socialProviders } from '../src/data/mock';
import { getAuthErrorMessage } from '../src/lib/auth-errors';
import { useAuth } from '../src/providers/AuthProvider';
import { colors } from '../src/theme/tokens';

export default function LoginScreen() {
  const router = useRouter();
  const { signInWithEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setErrorMessage('Vui lòng nhập đầy đủ email và mật khẩu.');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMessage(null);
      await signInWithEmail({ email, password });
      router.replace('/(tabs)');
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <ImageBackground imageStyle={styles.heroImage} source={{ uri: designAssets.loginHeroMap }} style={styles.heroMap} />
          <Text style={styles.brand}>VietWander</Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Email</Text>
            <View style={styles.inputWrap}>
              <Ionicons color="#64748b" name="mail" size={18} style={styles.inputIcon} />
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                onChangeText={setEmail}
                placeholder="hello@vietwander.vn"
                placeholderTextColor="#94a3b8"
                style={styles.input}
                value={email}
              />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Mật khẩu</Text>
            <View style={styles.inputWrap}>
              <Ionicons color="#64748b" name="lock-closed" size={18} style={styles.inputIcon} />
              <TextInput
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor="#94a3b8"
                secureTextEntry={secureTextEntry}
                style={styles.input}
                value={password}
              />
              <Pressable hitSlop={10} onPress={() => setSecureTextEntry((current) => !current)} style={styles.trailingPressable}>
                <Ionicons color="#94a3b8" name={secureTextEntry ? 'eye' : 'eye-off'} size={18} />
              </Pressable>
            </View>
          </View>

          <Pressable style={styles.linkWrap}>
            <Text style={styles.forgotText}>Quên mật khẩu?</Text>
          </Pressable>

          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

          <Pressable disabled={submitting} onPress={handleLogin} style={[styles.loginButton, submitting && styles.buttonDisabled]}>
            {submitting ? <ActivityIndicator color="white" size="small" /> : <Text style={styles.loginLabel}>Đăng nhập</Text>}
            {!submitting ? <Ionicons color="white" name="map" size={18} /> : null}
          </Pressable>

          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.dividerLabel}>Hoặc tiếp tục với</Text>
            <View style={styles.divider} />
          </View>

          <View style={styles.socialRow}>
            {socialProviders.map((item) => (
              <Pressable
                key={item.id}
                style={[styles.socialButton, { backgroundColor: item.tint, borderColor: item.borderColor, opacity: 0.6 }]}
              >
                <Text style={[styles.socialLabel, { color: item.textColor }]}>{item.label}</Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.footerText}>
            Chưa có tài khoản?{' '}
            <Link href="/register" style={styles.footerLink}>
              Tạo ngay
            </Link>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  screen: { flex: 1, backgroundColor: '#eef9f2' },
  content: { paddingHorizontal: 18, paddingBottom: 40 },
  heroMap: { height: 230, borderRadius: 20, overflow: 'hidden', marginTop: 8, backgroundColor: '#dff1e7' },
  heroImage: { resizeMode: 'cover' },
  brand: {
    marginTop: 12,
    marginBottom: 18,
    fontSize: 44,
    fontWeight: '900',
    color: colors.primaryDark,
    textAlign: 'center',
  },
  fieldGroup: { marginBottom: 14 },
  fieldLabel: { marginBottom: 8, fontSize: 14, fontWeight: '800', color: '#475569' },
  inputWrap: {
    height: 58,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#bbf7d0',
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  inputIcon: { position: 'absolute', left: 16 },
  trailingPressable: {
    position: 'absolute',
    right: 16,
    height: 24,
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: { paddingLeft: 46, paddingRight: 44, fontSize: 16, color: colors.text },
  linkWrap: { alignItems: 'flex-end', marginTop: 6, marginBottom: 18 },
  forgotText: { color: colors.primaryDark, fontWeight: '800', fontSize: 14 },
  errorText: {
    marginBottom: 12,
    borderRadius: 16,
    backgroundColor: '#fee2e2',
    color: '#b91c1c',
    fontSize: 14,
    fontWeight: '700',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  loginButton: {
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ff8e43',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonDisabled: { opacity: 0.75 },
  loginLabel: { color: 'white', fontSize: 20, fontWeight: '900' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 22 },
  divider: { flex: 1, height: 1, backgroundColor: '#d7e5dd' },
  dividerLabel: { color: '#94a3b8', fontWeight: '700' },
  socialRow: { flexDirection: 'row', gap: 12 },
  socialButton: {
    flex: 1,
    height: 74,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialLabel: { fontSize: 17, fontWeight: '800' },
  footerText: { marginTop: 26, textAlign: 'center', fontSize: 15, color: colors.textMuted },
  footerLink: { color: colors.primaryDark, fontWeight: '800' },
});
