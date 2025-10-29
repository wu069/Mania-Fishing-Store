// app/_layout.js
import { Tabs } from 'expo-router/tabs';

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: '#047857' },
        headerTintColor: '#fff',
        tabBarActiveTintColor: '#047857',
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home 🎣' }} />
      <Tabs.Screen name="add" options={{ title: 'Tambah Item' }} />
    </Tabs>
  );
}

