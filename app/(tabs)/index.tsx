import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../src/theme/tokens';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.center}>
        <Text style={styles.title}>VietWander</Text>
        <Text style={styles.subtitle}>Khung app Expo đã sẵn sàng.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    marginTop: 12,
    fontSize: 16,
    color: colors.textMuted,
  },
});
