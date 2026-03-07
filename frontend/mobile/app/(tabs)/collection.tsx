import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppIconButton } from '../../src/components/AppIconButton';
import { CollectionProvinceRow } from '../../src/components/CollectionProvinceRow';
import { SectionHeader } from '../../src/components/SectionHeader';
import { useUserCollection, useUserProfile } from '../../src/features/community';
import { useAuth } from '../../src/providers/AuthProvider';
import { colors } from '../../src/theme/tokens';

export default function CollectionScreen() {
  const { user } = useAuth();
  const { data: profile } = useUserProfile(user?.uid);
  const { data: collectionItems, error } = useUserCollection(user?.uid);

  const visitedProvinceCount = profile?.visitedProvinceCount ?? collectionItems.length;
  const progressRatio = Math.min(visitedProvinceCount / 63, 1);

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.brandWrap}>
            <View style={styles.avatarWrap}>
              <Ionicons color={colors.primaryDark} name="person" size={18} />
            </View>
            <Text style={styles.brand}>VietWander</Text>
          </View>
          <View style={styles.headerActions}>
            <AppIconButton name="settings-sharp" />
            <AppIconButton hasBadge name="notifications" />
          </View>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.posterFrame}>
            <View style={styles.posterInner}>
              <LinearGradient colors={['#c8f1db', '#e8f6ef']} style={styles.posterGradient}>
                <View style={styles.miniMapWrap}>
                  <Ionicons color={colors.primaryDark} name="location" size={18} style={styles.mapPinTop} />
                  <Ionicons color={colors.primaryDark} name="location" size={18} style={styles.mapPinBottom} />
                </View>
              </LinearGradient>
            </View>
          </View>
          <View style={styles.counterPill}>
            <Text style={styles.counterText}>{visitedProvinceCount}/63 tỉnh</Text>
          </View>
          <Text style={styles.heroTitle}>Bạn đã mở khóa {visitedProvinceCount} tỉnh trên bản đồ cá nhân.</Text>
          <Text style={styles.heroSubtitle}>Mỗi check-in mới sẽ thêm huy hiệu tỉnh vào bộ sưu tập hành trình của bạn.</Text>
        </View>

        <View style={styles.levelCard}>
          <View style={styles.levelIconWrap}>
            <Ionicons color={colors.primaryDark} name="medal" size={22} />
          </View>
          <View style={styles.levelTextWrap}>
            <Text style={styles.levelTitle}>{profile?.levelTitle || 'Du khách'}</Text>
            <Text style={styles.levelSubtitle}>{profile?.verifiedCheckinCount ?? 0} check-in đã xác thực</Text>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${Math.max(progressRatio * 100, 6)}%` }]} />
            </View>
          </View>
        </View>

        {error ? <Text style={styles.infoBanner}>{error}</Text> : null}

        <SectionHeader actionLabel="Xem tất cả" title="Bộ sưu tập tỉnh thành" />

        {collectionItems.map((item) => (
          <CollectionProvinceRow dateLabel={item.dateLabel} imageUrl={item.imageUrl} key={item.id} name={item.name} />
        ))}

        <CollectionProvinceRow dateLabel="" locked name="Chưa khám phá" />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 28,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    marginBottom: 18,
  },
  brandWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#d1fae5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  brand: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  heroCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 34,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 18,
    paddingVertical: 20,
    marginBottom: 16,
  },
  posterFrame: {
    width: '100%',
    maxWidth: 240,
    aspectRatio: 0.9,
    borderRadius: 28,
    backgroundColor: '#f0e2da',
    padding: 18,
  },
  posterInner: {
    flex: 1,
    borderRadius: 22,
    backgroundColor: '#f5f8f7',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  posterGradient: {
    width: 118,
    height: 176,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniMapWrap: {
    width: 80,
    height: 128,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  mapPinTop: {
    position: 'absolute',
    top: -8,
    right: 8,
  },
  mapPinBottom: {
    position: 'absolute',
    bottom: 8,
    left: -10,
  },
  counterPill: {
    marginTop: 14,
    borderRadius: 999,
    backgroundColor: colors.primaryDark,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  counterText: {
    color: 'white',
    fontWeight: '800',
    fontSize: 14,
  },
  heroTitle: {
    marginTop: 16,
    fontSize: 24,
    textAlign: 'center',
    fontWeight: '900',
    color: colors.text,
  },
  heroSubtitle: {
    marginTop: 12,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textMuted,
    textAlign: 'center',
  },
  levelCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 22,
  },
  levelIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#d1fae5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  levelTextWrap: {
    flex: 1,
  },
  levelTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  levelSubtitle: {
    marginTop: 2,
    fontSize: 13,
    color: colors.textMuted,
  },
  progressTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: '#e2e8f0',
    marginTop: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: colors.primaryDark,
  },
  infoBanner: {
    marginBottom: 14,
    borderRadius: 16,
    backgroundColor: '#eff6ff',
    color: '#1d4ed8',
    fontSize: 13,
    fontWeight: '700',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
});
