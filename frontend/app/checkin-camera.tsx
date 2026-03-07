import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, ImageBackground, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { designAssets } from '../src/data/mock';
import { createDemoCheckin } from '../src/features/community';
import { useAuth } from '../src/providers/AuthProvider';
import { colors } from '../src/theme/tokens';

export default function CheckinCameraScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleCompleteCheckin = async () => {
    if (!user) {
      router.replace('/login');
      return;
    }

    try {
      setSaving(true);
      setErrorMessage(null);
      await createDemoCheckin(user);
      router.replace('/leaderboard');
    } catch (error) {
      console.warn('Unable to save demo check-in', error);
      setErrorMessage('Không thể lưu check-in lên Firebase. Hãy kiểm tra Firestore rules rồi thử lại.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ImageBackground imageStyle={styles.backgroundImage} source={{ uri: designAssets.cameraBackdrop }} style={styles.screen}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()} style={styles.smallCircle}>
            <Ionicons color={colors.text} name="close" size={18} />
          </Pressable>
          <View style={styles.locationPill}>
            <Ionicons color={colors.primaryDark} name="location" size={16} />
            <Text style={styles.locationLabel}>Đà Nẵng</Text>
          </View>
          <Pressable style={styles.smallCircle}>
            <Ionicons color={colors.text} name="ellipsis-horizontal" size={18} />
          </Pressable>
        </View>

        <View style={styles.overlayCenter}>
          <View style={styles.modalCard}>
            <View style={styles.medalWrap}>
              <Ionicons color={colors.primaryDark} name="ribbon" size={28} />
            </View>
            <Text style={styles.modalTitle}>CHECK-IN THÀNH CÔNG!</Text>
            <Text style={styles.modalSubtitle}>Bạn vừa mở khóa huy hiệu Đà Nẵng. Ảnh check-in sẽ được lưu vào hồ sơ và feed cộng đồng.</Text>

            <View style={styles.rewardRow}>
              <View style={[styles.rewardPill, styles.rewardGreen]}>
                <Text style={styles.rewardValue}>+1</Text>
                <Text style={styles.rewardLabel}>TỈNH MỞ KHÓA</Text>
              </View>
              <View style={[styles.rewardPill, styles.rewardOrange]}>
                <Text style={[styles.rewardValue, styles.rewardOrangeValue]}>LIVE</Text>
                <Text style={styles.rewardLabel}>ĐỒNG BỘ FEED</Text>
              </View>
            </View>

            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

            <Pressable disabled={saving} onPress={handleCompleteCheckin} style={[styles.confirmButton, saving && styles.confirmButtonDisabled]}>
              {saving ? <ActivityIndicator color="#03140c" size="small" /> : <Text style={styles.confirmLabel}>LƯU VÀ XEM BXH</Text>}
            </Pressable>
          </View>
        </View>

        <View style={styles.bottomBar}>
          <Ionicons color={colors.primaryDark} name="boat" size={28} />
          <View style={styles.cameraButton}>
            <Ionicons color="white" name="camera" size={28} />
          </View>
          <Ionicons color={colors.primaryDark} name="leaf" size={28} />
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0c1727' },
  backgroundImage: { opacity: 0.38 },
  safeArea: { flex: 1, backgroundColor: 'rgba(4, 19, 34, 0.28)' },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, paddingTop: 10 },
  smallCircle: { width: 42, height: 42, borderRadius: 21, backgroundColor: 'rgba(255,255,255,0.88)', alignItems: 'center', justifyContent: 'center' },
  locationPill: { flexDirection: 'row', alignItems: 'center', gap: 6, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.9)', paddingHorizontal: 20, borderWidth: 1, borderColor: '#cbd5e1' },
  locationLabel: { fontSize: 16, fontWeight: '800', color: colors.text },
  overlayCenter: { flex: 1, justifyContent: 'center', paddingHorizontal: 18 },
  modalCard: { borderRadius: 32, borderWidth: 3, borderColor: '#13251b', backgroundColor: '#fffdfd', paddingHorizontal: 20, paddingTop: 26, paddingBottom: 20, shadowColor: '#000', shadowOpacity: 0.22, shadowOffset: { width: 0, height: 12 }, shadowRadius: 30, elevation: 8 },
  medalWrap: { alignSelf: 'center', width: 92, height: 92, borderRadius: 46, backgroundColor: '#dcfce7', borderWidth: 4, borderColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  modalTitle: { textAlign: 'center', fontSize: 22, lineHeight: 28, fontWeight: '900', color: '#111827' },
  modalSubtitle: { marginTop: 12, textAlign: 'center', fontSize: 14, lineHeight: 22, color: '#64748b' },
  rewardRow: { flexDirection: 'row', gap: 14, marginTop: 24 },
  rewardPill: { flex: 1, height: 86, borderRadius: 24, borderWidth: 2, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center' },
  rewardGreen: { borderColor: colors.primary },
  rewardOrange: { borderColor: '#fb923c' },
  rewardValue: { fontSize: 28, fontWeight: '900', color: colors.primaryDark },
  rewardOrangeValue: { color: '#fb923c', fontSize: 22 },
  rewardLabel: { marginTop: 4, fontSize: 12, fontWeight: '800', color: '#94a3b8' },
  errorText: {
    marginTop: 16,
    borderRadius: 16,
    backgroundColor: '#fee2e2',
    color: '#b91c1c',
    fontSize: 13,
    fontWeight: '700',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  confirmButton: { marginTop: 22, height: 58, borderRadius: 29, backgroundColor: '#34e67a', borderWidth: 4, borderColor: '#0f1b15', alignItems: 'center', justifyContent: 'center' },
  confirmButtonDisabled: { opacity: 0.8 },
  confirmLabel: { color: '#03140c', fontSize: 18, fontWeight: '900' },
  bottomBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 42, paddingBottom: 24 },
  cameraButton: { width: 76, height: 76, borderRadius: 38, backgroundColor: '#ff9b4a', borderWidth: 6, borderColor: 'rgba(255,255,255,0.24)', alignItems: 'center', justifyContent: 'center' },
});
