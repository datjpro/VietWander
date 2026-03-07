import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppIconButton } from '../../src/components/AppIconButton';
import { HomeMapCard } from '../../src/components/HomeMapCard';
import { LandmarkCard } from '../../src/components/LandmarkCard';
import { SectionHeader } from '../../src/components/SectionHeader';
import { designAssets, provinces } from '../../src/data/mock';
import { colors } from '../../src/theme/tokens';

const province = provinces[0];

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <Image source={{ uri: designAssets.avatar }} style={styles.avatar} />
            <Text style={styles.brand}>VietWander</Text>
          </View>
          <AppIconButton hasBadge name="notifications" />
        </View>

        <View style={styles.greetingBlock}>
          <Text style={styles.greeting}>Xin chào, Alex! 👋</Text>
          <Text style={styles.greetingSub}>Where are we exploring today?</Text>
        </View>

        <HomeMapCard imageUrl={designAssets.vietnamMap} onPress={() => router.push('/province/danang')} />

        <View style={styles.sectionWrap}>
          <SectionHeader actionLabel="See All" title="Nearby Landmarks" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {province.landmarks.map((landmark) => (
              <LandmarkCard
                compact
                key={landmark.id}
                landmark={landmark}
                onPress={() => router.push('/province/danang')}
              />
            ))}
          </ScrollView>
        </View>

        <Pressable onPress={() => router.push('/collection')} style={styles.progressCard}>
          <View style={styles.progressTextWrap}>
            <Text style={styles.progressTitle}>Bộ sưu tập của bạn</Text>
            <Text style={styles.progressSubtitle}>Đã mở khóa 12/63 tỉnh và 5 badge hiếm.</Text>
          </View>
          <Ionicons color={colors.primaryDark} name="arrow-forward" size={20} />
        </Pressable>
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
    paddingBottom: 8,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: colors.primary,
    marginRight: 12,
  },
  brand: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  greetingBlock: {
    marginTop: 16,
    marginBottom: 18,
  },
  greeting: {
    fontSize: 38,
    lineHeight: 42,
    fontWeight: '900',
    color: colors.text,
  },
  greetingSub: {
    marginTop: 6,
    fontSize: 18,
    color: colors.textMuted,
  },
  sectionWrap: {
    marginTop: 24,
  },
  progressCard: {
    marginTop: 20,
    padding: 18,
    borderRadius: 24,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressTextWrap: {
    flex: 1,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  progressSubtitle: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textMuted,
  },
});