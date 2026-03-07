import { Ionicons } from '@expo/vector-icons';
import { Image, StyleSheet, Text, View } from 'react-native';
import type { FeedPost } from '../data/mock';
import { colors } from '../theme/tokens';

type FeedPostCardProps = {
  post: FeedPost;
};

export function FeedPostCard({ post }: FeedPostCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarLabel}>{post.author.slice(0, 1)}</Text>
        </View>
        <View style={styles.headerText}>
          <Text style={styles.author}>{post.author}</Text>
          <Text style={styles.location}>{post.location}</Text>
        </View>
        <View style={styles.starBadge}>
          <Ionicons color="#facc15" name="star" size={16} />
        </View>
      </View>

      <Image source={{ uri: post.imageUrl }} style={styles.image} />

      <View style={styles.actionsRow}>
        <View style={styles.actionGroup}>
          <Ionicons color="#fb7185" name="heart" size={20} />
          <Text style={styles.actionLabel}>{post.likesLabel}</Text>
        </View>
        <View style={styles.actionGroup}>
          <Ionicons color="#60a5fa" name="chatbubble" size={18} />
          <Text style={styles.actionLabel}>{post.commentsLabel}</Text>
        </View>
        <View style={styles.shareButton}>
          <Ionicons color={colors.primaryDark} name="share-social" size={18} />
        </View>
      </View>

      <Text style={styles.caption}>
        <Text style={styles.author}>{post.author}</Text> {post.caption}
      </Text>
      <Text style={styles.hashtag}>{post.hashtag}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 28,
    backgroundColor: colors.surface,
    padding: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 22,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fde68a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  headerText: {
    flex: 1,
    marginLeft: 10,
  },
  author: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
  },
  location: {
    marginTop: 2,
    fontSize: 12,
    color: colors.textMuted,
  },
  starBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fef08a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: 290,
    borderRadius: 28,
    backgroundColor: '#e2e8f0',
  },
  actionsRow: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 18,
    gap: 6,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textMuted,
  },
  shareButton: {
    marginLeft: 'auto',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ecfdf3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  caption: {
    marginTop: 12,
    fontSize: 14,
    lineHeight: 20,
    color: colors.text,
  },
  hashtag: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: '700',
    color: colors.primaryDark,
  },
});