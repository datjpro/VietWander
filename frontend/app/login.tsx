import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { ImageBackground, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { designAssets, socialProviders } from '../src/data/mock';
import { colors } from '../src/theme/tokens';

export default function LoginScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ImageBackground imageStyle={styles.heroImage} source={{ uri: designAssets.loginHeroMap }} style={styles.heroMap} />
        <Text style={styles.brand}>CheckViet</Text>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Email or Phone</Text>
          <View style={styles.inputWrap}>
            <Ionicons color="#64748b" name="at" size={18} style={styles.inputIcon} />
            <TextInput placeholder="hello@vietnam.com" placeholderTextColor="#94a3b8" style={styles.input} />
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Password</Text>
          <View style={styles.inputWrap}>
            <Ionicons color="#64748b" name="lock-closed" size={18} style={styles.inputIcon} />
            <TextInput placeholder="••••••••" placeholderTextColor="#94a3b8" secureTextEntry style={styles.input} />
            <Ionicons color="#94a3b8" name="eye" size={18} style={styles.trailingIcon} />
          </View>
        </View>

        <Pressable style={styles.linkWrap}>
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </Pressable>

        <Pressable onPress={() => router.replace('/(tabs)')} style={styles.loginButton}>
          <Text style={styles.loginLabel}>Login</Text>
          <Ionicons color="white" name="map" size={18} />
        </Pressable>

        <View style={styles.dividerRow}>
          <View style={styles.divider} />
          <Text style={styles.dividerLabel}>Or continue with</Text>
          <View style={styles.divider} />
        </View>

        <View style={styles.socialRow}>
          {socialProviders.map((item) => (
            <Pressable key={item.id} style={[styles.socialButton, { backgroundColor: item.tint, borderColor: item.borderColor }]}>
              <Text style={[styles.socialLabel, { color: item.textColor }]}>{item.label}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.footerText}>
          Don't have an account?{' '}
          <Link href="/register" style={styles.footerLink}>
            Signup now!
          </Link>
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#eef9f2' },
  content: { paddingHorizontal: 18, paddingBottom: 40 },
  heroMap: { height: 230, borderRadius: 20, overflow: 'hidden', marginTop: 8, backgroundColor: '#dff1e7' },
  heroImage: { resizeMode: 'cover' },
  brand: { marginTop: 12, marginBottom: 18, fontSize: 44, fontWeight: '900', color: colors.primaryDark, textAlign: 'center' },
  fieldGroup: { marginBottom: 14 },
  fieldLabel: { marginBottom: 8, fontSize: 14, fontWeight: '800', color: '#475569' },
  inputWrap: { height: 58, borderRadius: 18, borderWidth: 1.5, borderColor: '#bbf7d0', backgroundColor: 'white', justifyContent: 'center' },
  inputIcon: { position: 'absolute', left: 16 },
  trailingIcon: { position: 'absolute', right: 16 },
  input: { paddingLeft: 46, paddingRight: 44, fontSize: 16, color: colors.text },
  linkWrap: { alignItems: 'flex-end', marginTop: 6, marginBottom: 18 },
  forgotText: { color: colors.primaryDark, fontWeight: '800', fontSize: 14 },
  loginButton: { height: 56, borderRadius: 28, backgroundColor: '#ff8e43', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  loginLabel: { color: 'white', fontSize: 20, fontWeight: '900' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 22 },
  divider: { flex: 1, height: 1, backgroundColor: '#d7e5dd' },
  dividerLabel: { color: '#94a3b8', fontWeight: '700' },
  socialRow: { flexDirection: 'row', gap: 12 },
  socialButton: { flex: 1, height: 74, borderRadius: 18, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  socialLabel: { fontSize: 17, fontWeight: '800' },
  footerText: { marginTop: 26, textAlign: 'center', fontSize: 15, color: colors.textMuted },
  footerLink: { color: colors.primaryDark, fontWeight: '800' },
});