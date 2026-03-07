import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { colors } from '../../src/theme/tokens';

const iconByRoute: Record<string, keyof typeof Ionicons.glyphMap> = {
  index: 'home',
  feed: 'compass',
  collection: 'bookmark',
  profile: 'person',
};

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primaryDark,
        tabBarInactiveTintColor: '#a1acb8',
        tabBarStyle: {
          height: 76,
          paddingTop: 10,
          paddingBottom: 12,
          borderTopColor: '#edf0ed',
          backgroundColor: '#ffffff',
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
        },
        tabBarIcon: ({ color, size, focused }) => (
          <Ionicons
            color={color}
            name={iconByRoute[route.name]}
            size={focused ? size + 2 : size}
          />
        ),
      })}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="feed" options={{ title: 'Feed' }} />
      <Tabs.Screen name="collection" options={{ title: 'Collection' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
