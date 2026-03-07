import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/tokens';

type HomeMapCardProps = {
  imageUrl: string;
  onPress?: () => void;
};

type MapPin = {
  top: `${number}%`;
  left: `${number}%`;
  icon: keyof typeof Ionicons.glyphMap;
};

const pins: MapPin[] = [
  { top: '12%', left: '47%', icon: 'camera' },
  { top: '43%', left: '57%', icon: 'water' },
  { top: '73%', left: '41%', icon: 'leaf' },
];

export function HomeMapCard({ imageUrl, onPress }: HomeMapCardProps) {
  return (
    <Pressable onPress={onPress} style={styles.wrapper}>
      <View style={styles.innerFrame}>
        <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="contain" />
        {pins.map((pin) => (
          <View key={`${pin.top}-${pin.left}`} style={[styles.pin, { top: pin.top, left: pin.left }]}>
            <Ionicons color={colors.primaryDark} name={pin.icon} size={16} />
          </View>
        ))}
      </View>
      <View style={styles.footer}>
        <View style={styles.livePill}>
          <Text style={styles.liveLabel}>LIVE</Text>
        </View>
        <Text style={styles.footerText}>1,240 travelers currently checking in</Text>
        <Ionicons color={colors.textMuted} name="information-circle" size={16} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#d8efe3',
    borderRadius: 34,
    padding: 14,
    borderWidth: 2,
    borderColor: '#ecf6ef',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 24,
    elevation: 3,
  },
  innerFrame: {
    height: 380,
    borderRadius: 28,
    backgroundColor: '#e9e1c9',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '92%',
    height: '92%',
  },
  pin: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 2,
  },
  footer: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 18,
    backgroundColor: '#eef4ef',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  livePill: {
    backgroundColor: '#d1fae5',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  liveLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  footerText: {
    flex: 1,
    fontSize: 13,
    color: colors.text,
    fontWeight: '600',
  },
});