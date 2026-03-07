import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppIconButton } from '../../src/components/AppIconButton';
import { FeedPostCard } from '../../src/components/FeedPostCard';
import { feedPosts } from '../../src/data/mock';
import { colors } from '../../src/theme/tokens';

const hashtags = ['#PhuQuocCheckin', '#SunsetBeach', '#StarfishBeach'];

export default function FeedScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.brandWrap}>
            <View style={styles.logoCircle}>
              <Ionicons color="white" name="pause" size={16} />
            </View>
            <Text style={styles.brand}>VietWander</Text>
          </View>
          <View style={styles.headerActions}>
            <AppIconButton name="search" />
            <AppIconButton hasBadge name="notifications" />
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsRow}>
          {hashtags.map((hashtag, index) => (
            <View key={hashtag} style={[styles.chip, index === 0 && styles.chipActive]}>
              <Text style={[styles.chipLabel, index === 0 && styles.chipLabelActive]}>{hashtag}</Text>
            </View>
          ))}
        </ScrollView>

        {feedPosts.map((post) => (
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