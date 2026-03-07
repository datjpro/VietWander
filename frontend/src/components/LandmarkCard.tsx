import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import type { Landmark } from '../data/mock';
import { colors } from '../theme/tokens';

type LandmarkCardProps = {
  landmark: Landmark;
  compact?: boolean;
  onPress?: () => void;
};

export function LandmarkCard({ landmark, compact = false, onPress }: LandmarkCardProps) {
  return (
    <Pressable onPress={onPress} style={[styles.card, compact && styles.compactCard]}>
      <Image source={{ uri: landmark.imageUrl }} style={[styles.image, compact && styles.compactImage]} />
      <View style={[styles.accent, { backgroundColor: landmark.accentColor }]} />
      <View style={styles.body}>
        <Text numberOfLines={1} style={styles.title}>
          {landmark.name}
        </Text>
        <Text numberOfLines={2} style={styles.description}>
          {landmark.description}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 210,
    borderRadius: 30,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginRight: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 24,
    elevation: 3,
  },
  compactCard: {
    width: 182,
  },
  image: {
    width: '100%',
    height: 140,
  },
  compactImage: {
    height: 118,
  },
  accent: {
    height: 4,
    width: '100%',
  },
  body: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  description: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textMuted,
  },
});