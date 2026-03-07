import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppIconButton } from '../../src/components/AppIconButton';
import { FeedPostCard } from '../../src/components/FeedPostCard';
import { useProvinceFeed } from '../../src/features/community';
import { colors } from '../../src/theme/tokens';

export default function FeedScreen() {
  const { data: posts, hashtags, loading, error } = useProvinceFeed();

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.brandWrap}>
            <View style={styles.logoCircle}>
              <Ionicons color="white" name="compass" size={16} />
            </View>
            <Text style={styles.brand}>VietWander</Text>
          </View>
          <View style={styles.headerActions}>
            <AppIconButton name="search" />
            <AppIconButton hasBadge name="notifications" />
          </View>
        </View>

        <View style={styles.titleRow}>
          <View>
            <Text style={styles.title}>Feed địa danh</Text>
            <Text style={styles.subtitle}>Ảnh và khoảnh khắc check-in mới nhất từ cộng đồng.</Text>
          </View>
          {loading ? <ActivityIndicator color={colors.primaryDark} size="small" /> : null}
        </View>

        {error ? <Text style={styles.infoBanner}>{error}</Text> : null}

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsRow}>
          {hashtags.map((hashtag, index) => (
            <View key={hashtag} style={[styles.chip, index === 0 && styles.chipActive]}>
              <Text style={[styles.chipLabel, index === 0 && styles.chipLabelActive]}>{hashtag}</Text>
            </View>
          ))}
        </ScrollView>

        {posts.map((post) => (
          <FeedPostCard key={post.id} post={post} />
        ))}
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
    paddingHorizontal: 14,
    paddingBottom: 28,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    marginBottom: 14,
  },
  brandWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.primaryDark,
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.text,
  },
  subtitle: {
    marginTop: 6,
    maxWidth: 250,
    fontSize: 13,
    lineHeight: 20,
    color: colors.textMuted,
  },
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
  chipsRow: {
    marginBottom: 14,
  },
  chip: {
    height: 38,
    paddingHorizontal: 16,
    borderRadius: 19,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: '#d1fae5',
    borderColor: '#bbf7d0',
  },
  chipLabel: {
    color: colors.textMuted,
    fontWeight: '700',
    fontSize: 13,
  },
  chipLabelActive: {
    color: colors.primaryDark,
  },
});
