import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useMemo } from 'react';
import { useRouter } from 'expo-router';
import { designAssets } from '../../src/data/mock';
import { fallbackLeaderboardData, useLeaderboard, useUserProfile } from '../../src/features/community';
import { useAuth } from '../../src/providers/AuthProvider';
import { colors } from '../../src/theme/tokens';

export default function LeaderboardScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { data: currentUserProfile } = useUserProfile(user?.uid);
  const { data: realtimeEntries, error } = useLeaderboard(user?.uid);

  const allEntries = useMemo(() => {
    if (realtimeEntries.length >= 3) {
      return realtimeEntries;
    }

    return fallbackLeaderboardData;
  }, [realtimeEntries]);

  const first = allEntries.find((item) => Number(item.rank) === 1) || fallbackLeaderboardData.find((item) => Number(item.rank) === 1)!;
  const second = allEntries.find((item) => Number(item.rank) === 2) || fallbackLeaderboardData.find((item) => Number(item.rank) === 2)!;
  const third = allEntries.find((item) => Number(item.rank) === 3) || fallbackLeaderboardData.find((item) => Number(item.rank) === 3)!;
  const rankedEntries = allEntries.filter((item) => Number(item.rank) > 3);
  const currentUserEntry =
    allEntries.find((item) => item.id === user?.uid) ||
    (currentUserProfile
      ? {
          id: currentUserProfile.uid,
          rank: '--',
          name: currentUserProfile.displayName,
          title: currentUserProfile.levelTitle,
          provinceCountLabel: `${currentUserProfile.visitedProvinceCount}/63`,
          avatarUrl: currentUserProfile.photoURL || designAssets.currentUserRank,
        }
      : fallbackLeaderboardData[fallbackLeaderboardData.length - 1]);

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.circleButton}>
            <Ionicons color={colors.text} name="arrow-back" size={20} />
          </Pressable>
          <Text style={styles.headerTitle}>Bảng xếp hạng</Text>
          <Pressable style={[styles.circleButton, styles.shareButton]}>
            <Ionicons color={colors.text} name="share-social" size={20} />
          </Pressable>
        </View>

        {error ? <Text style={styles.infoBanner}>{error}</Text> : null}

        <View style={styles.heroArea}>
          <Image source={{ uri: designAssets.leaderboardMapOutline }} style={styles.mapOutline} resizeMode="contain" />

          <View style={[styles.podiumCard, styles.secondPlace]}>
            <Image source={{ uri: second.avatarUrl }} style={styles.podiumAvatar} />
            <View style={[styles.rankBubble, styles.rankBubbleSecond]}>
              <Text style={styles.rankBubbleLabel}>2</Text>
            </View>
            <Text style={styles.podiumName}>{second.name}</Text>
            <Text style={styles.podiumStat}>{second.provinceCountLabel}</Text>
          </View>

          <View style={[styles.podiumCard, styles.firstPlace]}>
            <View style={styles.starBadge}>
              <Ionicons color="#facc15" name="star" size={16} />
            </View>
            <Image source={{ uri: first.avatarUrl }} style={[styles.podiumAvatar, styles.firstAvatar]} />
            <View style={[styles.rankBubble, styles.rankBubbleFirst]}>
              <Text style={styles.rankBubbleLabel}>1</Text>
            </View>
            <Text style={styles.podiumName}>{first.name}</Text>
            <Text style={styles.podiumStat}>{first.provinceCountLabel}</Text>
          </View>

          <View style={[styles.podiumCard, styles.thirdPlace]}>
            <Image source={{ uri: third.avatarUrl }} style={styles.podiumAvatar} />
            <View style={[styles.rankBubble, styles.rankBubbleThird]}>
              <Text style={styles.rankBubbleLabel}>3</Text>
            </View>
            <Text style={styles.podiumName}>{third.name}</Text>
            <Text style={styles.podiumStat}>{third.provinceCountLabel}</Text>
          </View>
        </View>

        <View style={styles.segmentWrap}>
          <View style={styles.segmentActive}>
            <Text style={styles.segmentActiveLabel}>Realtime</Text>
          </View>
          <View style={styles.segmentInactive}>
            <Text style={styles.segmentInactiveLabel}>Tất cả</Text>
          </View>
        </View>

        {rankedEntries.map((entry) => (
          <View key={entry.id} style={styles.rowCard}>
            <Text style={styles.rowRank}>{entry.rank}</Text>
            <Image source={{ uri: entry.avatarUrl }} style={styles.rowAvatar} />
            <View style={styles.rowTextWrap}>
              <Text style={styles.rowName}>{entry.name}</Text>
              <View style={styles.rowSubline}>
                <Ionicons color={colors.primaryDark} name="sparkles" size={12} />
                <Text style={styles.rowTitle}>{entry.title}</Text>
              </View>
            </View>
            <View style={styles.rowRight}>
              <Text style={styles.rowCount}>{entry.provinceCountLabel}</Text>
              <Text style={styles.rowSuffix}>TỈNH/THÀNH</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.currentUserBar}>
        <View style={styles.currentRankPill}>
          <Text style={styles.currentRankText}>{currentUserEntry.rank}</Text>
        </View>
        <Image source={{ uri: currentUserEntry.avatarUrl }} style={styles.currentUserAvatar} />
        <View style={styles.currentUserText}>
          <Text style={styles.currentUserName}>{currentUserEntry.name}</Text>
          <Text style={styles.currentUserHint}>{currentUserEntry.title}</Text>
        </View>
        <Text style={styles.currentUserCount}>{currentUserEntry.provinceCountLabel}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 16, paddingBottom: 140 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8, marginBottom: 12 },
  circleButton: { width: 46, height: 46, borderRadius: 23, backgroundColor: '#f1f5f9', alignItems: 'center', justifyContent: 'center' },
  shareButton: { backgroundColor: '#34e67a' },
  headerTitle: { fontSize: 24, fontWeight: '900', color: colors.text },
  infoBanner: {
    marginBottom: 12,
    borderRadius: 16,
    backgroundColor: '#eff6ff',
    color: '#1d4ed8',
    fontSize: 13,
    fontWeight: '700',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  heroArea: { height: 290, backgroundColor: '#e4f5ea', borderRadius: 30, marginBottom: 20, justifyContent: 'flex-end', paddingBottom: 12 },
  mapOutline: { position: 'absolute', alignSelf: 'center', top: 24, width: 170, height: 120, opacity: 0.24 },
  podiumCard: { position: 'absolute', width: 104, borderTopLeftRadius: 28, borderTopRightRadius: 28, backgroundColor: 'white', alignItems: 'center', paddingTop: 14, borderWidth: 2 },
  secondPlace: { left: 0, bottom: 16, height: 140, borderColor: '#d1d5db' },
  firstPlace: { left: '50%', marginLeft: -58, bottom: 16, width: 116, height: 184, backgroundColor: '#d5f7df', borderColor: '#facc15' },
  thirdPlace: { right: 0, bottom: 16, height: 126, borderColor: '#f0c79b' },
  podiumAvatar: { width: 58, height: 58, borderRadius: 29, borderWidth: 3, borderColor: '#cbd5e1' },
  firstAvatar: { width: 66, height: 66, borderRadius: 33, borderColor: '#facc15' },
  rankBubble: { position: 'absolute', right: 18, top: 58, width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  rankBubbleFirst: { backgroundColor: '#facc15' },
  rankBubbleSecond: { backgroundColor: '#bdbdc7' },
  rankBubbleThird: { backgroundColor: '#d8923d' },
  rankBubbleLabel: { color: 'white', fontWeight: '900' },
  starBadge: { position: 'absolute', top: 10, left: '50%', marginLeft: -14, width: 28, height: 28, borderRadius: 14, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fde68a' },
  podiumName: { marginTop: 12, fontSize: 18, fontWeight: '900', color: colors.text },
  podiumStat: { marginTop: 4, fontSize: 16, fontWeight: '800', color: colors.primaryDark },
  segmentWrap: { flexDirection: 'row', backgroundColor: 'white', borderRadius: 24, padding: 6, marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0' },
  segmentActive: { flex: 1, height: 38, borderRadius: 19, backgroundColor: '#34e67a', alignItems: 'center', justifyContent: 'center' },
  segmentInactive: { flex: 1, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  segmentActiveLabel: { color: '#082f1a', fontWeight: '800' },
  segmentInactiveLabel: { color: '#64748b', fontWeight: '800' },
  rowCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 24, borderWidth: 1, borderColor: '#eef2f7', padding: 14, marginBottom: 12 },
  rowRank: { width: 30, fontSize: 28, fontWeight: '900', color: '#94a3b8' },
  rowAvatar: { width: 52, height: 52, borderRadius: 26, marginHorizontal: 10 },
  rowTextWrap: { flex: 1 },
  rowName: { fontSize: 17, fontWeight: '900', color: colors.text },
  rowSubline: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  rowTitle: { fontSize: 13, color: '#64748b', fontWeight: '700' },
  rowRight: { alignItems: 'flex-end' },
  rowCount: { fontSize: 28, fontWeight: '900', color: colors.primaryDark },
  rowSuffix: { fontSize: 10, fontWeight: '800', color: '#cbd5e1' },
  currentUserBar: { position: 'absolute', left: 16, right: 16, bottom: 18, height: 74, borderRadius: 28, backgroundColor: '#07111f', borderWidth: 2, borderColor: '#34e67a', paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center' },
  currentRankPill: { width: 44, alignItems: 'center' },
  currentRankText: { color: '#34e67a', fontSize: 24, fontWeight: '900' },
  currentUserAvatar: { width: 42, height: 42, borderRadius: 21, borderWidth: 2, borderColor: '#34e67a', marginRight: 10 },
  currentUserText: { flex: 1 },
  currentUserName: { color: 'white', fontSize: 16, fontWeight: '800' },
  currentUserHint: { color: '#94a3b8', fontSize: 12, marginTop: 2 },
  currentUserCount: { color: '#34e67a', fontSize: 24, fontWeight: '900' },
});
