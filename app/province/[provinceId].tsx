import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ImageBackground, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppIconButton } from '../../src/components/AppIconButton';
import { LandmarkCard } from '../../src/components/LandmarkCard';
import { SectionHeader } from '../../src/components/SectionHeader';
import { StatPill } from '../../src/components/StatPill';
import { provinces } from '../../src/data/mock';
import { colors } from '../../src/theme/tokens';

export default function ProvinceDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ provinceId?: string }>();
  const province = provinces.find((item) => item.id === params.provinceId) ?? provinces[0];

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.topBar}>
        <AppIconButton name="arrow-back" onPress={() => router.back()} />
        <Text style={styles.topBarTitle}>Province Detail</Text>
        <AppIconButton name="share-social" />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ImageBackground imageStyle={styles.heroImage} source={{ uri: province.heroImageUrl }} style={styles.heroCard}>
          <LinearGradient colors={['rgba(27, 191, 230, 0.4)', 'rgba(31, 79, 224, 0.85)']} style={styles.heroOverlay}>
            <View style={styles.tagPill}>
              <Text style={styles.tagLabel}>VIETNAM</Text>
            </View>
            <Text style={styles.heroTitle}>{province.name.toUpperCase()}</Text>
          </LinearGradient>
        </ImageBackground>

        <View style={styles.statsRow}>
          <StatPill label="Landmarks" value={`${province.landmarksCount}`} />
          <StatPill label="Check-ins" value={province.checkinCountLabel} />
          <StatPill label="Badges" value={province.badgeCountLabel} />
        </View>

        <View style={styles.sectionWrap}>
          <SectionHeader actionLabel="View all" title="Explore Landmarks" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {province.landmarks.map((landmark) => (
              <LandmarkCard key={landmark.id} landmark={landmark} />
            ))}
          </ScrollView>
        </View>

        <View style={styles.badgeCard}>
          <View style={styles.badgeHeader}>
            <View style={styles.badgeIconWrap}>
              <Ionicons color={colors.primaryDark} name="medal" size={18} />
            </View>
            <Text style={styles.badgeTitle}>Your {province.name} Badges</Text>
          </View>
          <View style={styles.badgeRow}>
            <View style={styles.earnedBadge}>
              <Ionicons color={colors.primaryDark} name="star" size={20} />
            </View>
            <View style={styles.lockedBadge}>
              <Ionicons color="#a1acb8" name="camera" size={18} />
            </View>
            <View style={styles.lockedBadge}>
              <Ionicons color="#a1acb8" name="restaurant" size={18} />
            </View>
            <View style={styles.lockedBadge}>
              <Ionicons color="#a1acb8" name="lock-closed" size={18} />
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.ctaWrap}>
        <Pressable style={styles.ctaButton}>
          <Ionicons color="white" name="camera" size={22} />
          <Text style={styles.ctaLabel}>Check-in Here!</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 8,
  },
  topBarTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.text,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 120,
  },
  heroCard: {
    height: 262,
    borderRadius: 40,
    overflow: 'hidden',
  },
  heroImage: {
    borderRadius: 40,
  },
  heroOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 22,
  },
  tagPill: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 12,
  },
  tagLabel: {
    fontSize: 12,
    fontWeight: '900',
    color: '#0f172a',
  },
  heroTitle: {
    fontSize: 44,
    lineHeight: 46,
    fontWeight: '900',
    color: 'white',
    fontStyle: 'italic',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },
  sectionWrap: {
    marginTop: 26,
  },
  badgeCard: {
    marginTop: 24,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#d7e6dd',
    borderStyle: 'dashed',
    backgroundColor: '#f7faf8',
    padding: 18,
  },
  badgeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#dcfce7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  badgeTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 18,
  },
  earnedBadge: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#dcfce7',
  },
  lockedBadge: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eef2f1',
  },
  ctaWrap: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 18,
  },
  ctaButton: {
    height: 62,
    borderRadius: 31,
    backgroundColor: colors.accentOrange,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
    shadowColor: colors.accentOrange,
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 20,
    elevation: 4,
  },
  ctaLabel: {
    color: 'white',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
});