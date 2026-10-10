import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { colors } from '../../constants/theme';

const ICONS = {
  index: '⌂',
  events: '▦',
  chat: '✉',
  tasks: '✓',
  profile: '○',
} as const;

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text.tertiary,
        tabBarStyle: { paddingBottom: 10, paddingTop: 8, height: 66, backgroundColor: colors.surface, borderTopColor: colors.borderLight },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700', letterSpacing: 0.3 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <Text style={{ fontSize: size, color, fontWeight: focused ? '800' : '400' }}>{ICONS.index}</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: 'Events',
          tabBarIcon: ({ color, size, focused }) => (
            <Text style={{ fontSize: size, color, fontWeight: focused ? '800' : '400' }}>{ICONS.events}</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color, size, focused }) => (
            <Text style={{ fontSize: size, color, fontWeight: focused ? '800' : '400' }}>{ICONS.chat}</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: 'Tasks',
          tabBarIcon: ({ color, size, focused }) => (
            <Text style={{ fontSize: size, color, fontWeight: focused ? '800' : '400' }}>{ICONS.tasks}</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size, focused }) => (
            <Text style={{ fontSize: size, color, fontWeight: focused ? '800' : '400' }}>{ICONS.profile}</Text>
          ),
        }}
      />
    </Tabs>
  );
}