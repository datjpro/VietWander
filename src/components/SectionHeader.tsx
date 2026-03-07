import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/tokens';

type SectionHeaderProps = {
  title: string;
  actionLabel?: string;
  onPress?: () => void;
};

export function SectionHeader({ title, actionLabel, onPress }: SectionHeaderProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      {actionLabel ? (
        <Pressable onPress={onPress}>
          <Text style={styles.action}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
  },
  action: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primaryDark,
  },
});