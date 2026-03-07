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

export default function RegisterScreen() {
  const router = useRouter();
  const { signUpWithEmail } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRegister = async () => {
    if (!displayName.trim() || !email.trim() || !password) {
      setErrorMessage('Vui lòng nhập đầy đủ thông tin để bắt đầu.');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMessage(null);
      await signUpWithEmail({ displayName, email, password });
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
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} style={styles.circleButton}>
              <Ionicons color={colors.text} name="arrow-back" size={20} />
            </Pressable>
            <View style={styles.brandWrap}>
              <View style={styles.logoBadge}>
                <Text style={styles.logoBadgeLabel}>V</Text>
              </View>
              <Text style={styles.brand}>VietWander</Text>
            </View>
            <View style={styles.placeholder} />
          </View>

          <View style={styles.heroFrame}>
            <ImageBackground imageStyle={styles.heroImage} source={{ uri: designAssets.registerHero }} style={styles.heroImage}>
              <View style={styles.heroBadgeLeft}>
                <Ionicons color={colors.accentOrange} name="image" size={18} />
              </View>
              <View style={styles.heroBadgeRight}>
                <Ionicons color={colors.primaryDark} name="boat" size={18} />
              </View>
            </ImageBackground>
          </View>

          <Text style={styles.title}>Chào mừng đến với VietWander!</Text>
          <Text style={styles.subtitle}>Thu thập 63 tỉnh, check-in địa danh và mở khóa hành trình Việt Nam của riêng bạn.</Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Tên hiển thị</Text>
            <View style={styles.inputWrap}>
              <Ionicons color={colors.primaryDark} name="person" size={18} style={styles.inputIcon} />
              <TextInput
                onChangeText={setDisplayName}
                placeholder="Nhập tên nhà thám hiểm"
                placeholderTextColor="#94a3b8"
                style={styles.input}
                value={displayName}
              />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Email</Text>
            <View style={styles.inputWrap}>
              <Ionicons color={colors.primaryDark} name="mail" size={18} style={styles.inputIcon} />
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                onChangeText={setEmail}
                placeholder="Email nhận huy hiệu"
                placeholderTextColor="#94a3b8"
                style={styles.input}
                value={email}
              />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Mật khẩu</Text>
            <View style={styles.inputWrap}>
              <Ionicons color={colors.primaryDark} name="lock-closed" size={18} style={styles.inputIcon} />
              <TextInput
                onChangeText={setPassword}
                placeholder="Tạo mật khẩu bảo mật"
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

          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

          <Pressable disabled={submitting} onPress={handleRegister} style={[styles.primaryButton, submitting && styles.buttonDisabled]}>
            {submitting ? <ActivityIndicator color="white" size="small" /> : <Text style={styles.primaryLabel}>Bắt đầu khám phá</Text>}
            {!submitting ? <Ionicons color="white" name="rocket" size={18} /> : null}
          </Pressable>

          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.dividerLabel}>HOẶC ĐĂNG KÝ VỚI</Text>
            <View style={styles.divider} />
          </View>

          <View style={styles.socialRow}>
            {socialProviders
              .filter((item) => item.id !== 'zalo')
              .map((item) => (
                <Pressable
                  key={item.id}
                  style={[styles.socialButton, { backgroundColor: item.tint, borderColor: item.borderColor, opacity: 0.6 }]}
                >
                  <Text style={[styles.socialLabel, { color: item.textColor }]}>{item.label}</Text>
                </Pressable>
              ))}
          </View>

          <Text style={styles.footerText}>
            Đã có tài khoản?{' '}
            <Link href="/login" style={styles.footerLink}>
              Đăng nhập ngay
            </Link>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 16, paddingBottom: 32 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8, marginBottom: 12 },
  circleButton: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#dff9ea', alignItems: 'center', justifyContent: 'center' },
  brandWrap: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoBadge: { width: 28, height: 28, borderRadius: 10, backgroundColor: colors.primaryDark, alignItems: 'center', justifyContent: 'center' },
  logoBadgeLabel: { color: 'white', fontWeight: '900' },
  brand: { fontSize: 22, fontWeight: '800', color: colors.text },
  placeholder: { width: 48 },
  heroFrame: { borderRadius: 28, overflow: 'hidden', borderWidth: 3, borderColor: '#c9f3da', marginBottom: 20 },
  heroImage: { height: 210, borderRadius: 24 },
  heroBadgeLeft: {
    position: 'absolute',
    top: 14,
    left: 14,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroBadgeRight: {
    position: 'absolute',
    right: 14,
    bottom: 20,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 24, lineHeight: 30, fontWeight: '900', color: colors.text, textAlign: 'center' },
  subtitle: { marginTop: 10, fontSize: 15, lineHeight: 22, color: colors.textMuted, textAlign: 'center', marginBottom: 20 },
  fieldGroup: { marginBottom: 14 },
  fieldLabel: { marginBottom: 8, marginLeft: 2, fontSize: 14, fontWeight: '800', color: '#475569' },
  inputWrap: {
    height: 56,
    borderRadius: 20,
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
  input: { paddingLeft: 46, paddingRight: 44, fontSize: 15, color: colors.text },
  errorText: {
    marginTop: 4,
    marginBottom: 12,
    borderRadius: 16,
    backgroundColor: '#fee2e2',
    color: '#b91c1c',
    fontSize: 14,
    fontWeight: '700',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  primaryButton: {
    marginTop: 12,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.primaryDark,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonDisabled: { opacity: 0.75 },
  primaryLabel: { color: 'white', fontSize: 18, fontWeight: '900' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 22 },
  divider: { flex: 1, height: 1, backgroundColor: '#e2e8f0' },
  dividerLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 1, color: '#94a3b8' },
  socialRow: { flexDirection: 'row', gap: 12 },
  socialButton: { flex: 1, height: 52, borderRadius: 18, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  socialLabel: { fontSize: 15, fontWeight: '800' },
  footerText: { marginTop: 22, textAlign: 'center', fontSize: 14, color: colors.textMuted },
  footerLink: { color: colors.primaryDark, fontWeight: '800' },
});
