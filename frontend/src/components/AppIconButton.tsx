import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { colors } from '../theme/tokens';

type AppIconButtonProps = {
  name: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  hasBadge?: boolean;
  style?: ViewStyle;
};

export function AppIconButton({ name, onPress, hasBadge = false, style }: AppIconButtonProps) {
  return (
    <Pressable onPress={onPress} style={[styles.button, style]}>
      <Ionicons color={colors.text} name={name} size={20} />
      {hasBadge ? <View style={styles.badge} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 11,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
  },
});