import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ActivityIndicator, Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LandmarkCard } from '../../src/components/LandmarkCard';
import { collectionItems, designAssets, provinces } from '../../src/data/mock';
import { useAuth } from '../../src/providers/AuthProvider';
import { colors } from '../../src/theme/tokens';

const province = provinces[0];

export default function ProfileScreen() {
  const { user, signOutUser } = useAuth();
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    try {
      setSigningOut(true);
      await signOutUser();
    } finally {
      setSigningOut(false);
    }
  };

  const displayName = user?.displayName?.trim() || 'Du khách mới';
  const handle = user?.email ? `@${user.email.split('@')[0]}` : '@vietwander';

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerCard}>
          {user?.photoURL ? (
            <Image source={{ uri: user.photoURL }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarFallback]}>
              <Text style={styles.avatarFallbackLabel}>{displayName.charAt(0).toUpperCase()}</Text>
            </View>
          )}
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.handle}>{handle}</Text>
          <View style={styles.levelBadge}>
            <Ionicons color={colors.primaryDark} name="flash" size={16} />
            <Text style={styles.levelBadgeLabel}>Du khách</Text>
          </View>
          <Pressable disabled={signingOut} onPress={handleSignOut} style={[styles.signOutButton, signingOut && styles.signOutButtonDisabled]}>
            {signingOut ? <ActivityIndicator color={colors.primaryDark} size="small" /> : <Text style={styles.signOutLabel}>Đăng xuất</Text>}
          </Pressable>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Tỉnh</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>34</Text>
            <Text style={styles.statLabel}>Check-in</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>5</Text>
            <Text style={styles.statLabel}>Badge</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Dấu ấn gần đây</Text>
        <LandmarkCard landmark={province.landmarks[0]} />

        <Text style={styles.sectionTitle}>Tỉnh đã mở khóa</Text>
        {collectionItems.slice(0, 2).map((item) => (
          <View key={item.id} style={styles.unlockedRow}>
            <Image source={{ uri: item.imageUrl || designAssets.avatar }} style={styles.rowThumb} />
            <View style={styles.rowTextWrap}>
              <Text style={styles.rowTitle}>{item.name}</Text>
              <Text style={styles.rowSubtitle}>Check-in gần nhất: {item.dateLabel}</Text>
            </View>
            <Ionicons color={colors.primaryDark} name="checkmark-circle" size={22} />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingBottom: 28 },
  headerCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 30,
    padding: 22,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  avatarFallback: {
    alignItems: 'center',
    backgroundColor: '#dcfce7',
    justifyContent: 'center',
  },
  avatarFallbackLabel: {
    color: colors.primaryDark,
    fontSize: 30,
    fontWeight: '900',
  },
  name: {
    marginTop: 14,
    fontSize: 24,
    fontWeight: '900',
    color: colors.text,
  },
  handle: {
    marginTop: 4,
    fontSize: 14,
    color: colors.textMuted,
  },
  levelBadge: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 999,
    backgroundColor: '#dcfce7',
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  levelBadgeLabel: {
    color: colors.primaryDark,
    fontWeight: '800',
  },
  signOutButton: {
    marginTop: 14,
    minWidth: 122,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#bbf7d0',
    backgroundColor: '#f0fdf4',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  signOutButtonDisabled: { opacity: 0.75 },
  signOutLabel: { color: colors.primaryDark, fontWeight: '800' },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 24,
    alignItems: 'center',
    paddingVertical: 18,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.primaryDark,
  },
  statLabel: {
    marginTop: 6,
    fontSize: 12,
    color: colors.textMuted,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  sectionTitle: {
    marginTop: 22,
    marginBottom: 14,
    fontSize: 22,
    fontWeight: '900',
    color: colors.text,
  },
  unlockedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    marginBottom: 12,
  },
  rowThumb: {
    width: 54,
    height: 54,
    borderRadius: 16,
  },
  rowTextWrap: {
    flex: 1,
    marginLeft: 12,
  },
  rowTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.text,
  },
  rowSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: colors.textMuted,
  },
});
