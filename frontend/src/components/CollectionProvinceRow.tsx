import { Ionicons } from '@expo/vector-icons';
import { Image, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/tokens';

type CollectionProvinceRowProps = {
  name: string;
  dateLabel: string;
  imageUrl?: string;
  locked?: boolean;
};

export function CollectionProvinceRow({ name, dateLabel, imageUrl, locked = false }: CollectionProvinceRowProps) {
  if (locked) {
    return (
      <View style={[styles.row, styles.lockedRow]}>
        <View style={[styles.thumbnail, styles.lockedThumb]}>
          <Ionicons color="#9ca3af" name="lock-closed" size={28} />
        </View>
        <View style={styles.textWrap}>
          <Text style={styles.lockedTitle}>Chưa khám phá</Text>
          <Text style={styles.lockedSubtitle}>Điểm đến tiếp theo của bạn sẽ là đâu?</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.row}>
      <Image source={{ uri: imageUrl }} style={styles.thumbnail} />
      <View style={styles.textWrap}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.dateLabel}>{dateLabel}</Text>
      </View>
      <View style={styles.checkBadge}>
        <Ionicons color={colors.primaryDark} name="checkmark-circle" size={20} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  lockedRow: {
    backgroundColor: '#f7f8f7',
    borderStyle: 'dashed',
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: '#dbe4df',
  },
  lockedThumb: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eef2f1',
  },
  textWrap: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  dateLabel: {
    marginTop: 4,
    fontSize: 13,
    color: colors.textMuted,
  },
  checkBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ecfdf3',
  },
  lockedTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#9ca3af',
    fontStyle: 'italic',
  },
  lockedSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: '#a8afb7',
  },
});
