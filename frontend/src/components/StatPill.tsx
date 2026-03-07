import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/tokens';

type StatPillProps = {
  value: string;
  label: string;
};

export function StatPill({ value, label }: StatPillProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 86,
    borderRadius: 24,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 24,
    elevation: 2,
  },
  value: {
    fontSize: 34,
    lineHeight: 38,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  label: {
    marginTop: 6,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: colors.textMuted,
    fontWeight: '700',
  },
});