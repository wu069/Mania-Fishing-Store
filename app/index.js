import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { supabase } from './libary/supabaseclient';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // ===============================
  // 🔐 CEK LOGIN
  // ===============================
  const checkUser = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      router.replace('/login');
      return;
    }

    await getItems(session.user.id);
    await handleDeferredDeepLink();
    setLoading(false);
  };

  useEffect(() => {
    checkUser();
  }, []);

  // ===============================
  // 🔁 DEFERRED DEEP LINK
  // ===============================
  const handleDeferredDeepLink = async () => {
    const deferredId = await AsyncStorage.getItem('deferred_item_id');
    if (deferredId) {
      await AsyncStorage.removeItem('deferred_item_id');
      router.replace(`/${deferredId}`);
    }
  };

  // ===============================
  // 📥 FETCH DATA (MODIFIKASI MINIMAL)
  // ===============================
  const getItems = async (userId) => {
    const { data, error } = await supabase
      .from('items') // ✅ PASTI ADA
      .select('*')
      .or(`user_id.eq.${userId},user_id.is.null`) // ⭐ MODIFIKASI UTAMA
      .order('id', { ascending: false });

    if (error) {
      console.log('FETCH ERROR:', error);
    } else {
      setItems(data || []);
    }
  };

  // ===============================
  // 🔄 UPDATE STATUS
  // ===============================
  const toggleSudahDibeli = async (id, currentValue) => {
    setActionLoading(true);

    const { error } = await supabase
      .from('items')
      .update({ sudahDibeli: !currentValue })
      .eq('id', id);

    if (error) {
      Alert.alert('Error', 'Gagal update item');
    } else {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) await getItems(session.user.id);
    }

    setActionLoading(false);
  };

  // ===============================
  // 🗑️ DELETE ITEM
  // ===============================
  const confirmDelete = (id) => {
  Alert.alert('Hapus Item', 'Yakin ingin menghapus item ini?', [
    { text: 'Batal', style: 'cancel' },
    {
      text: 'Hapus',
      style: 'destructive',
      onPress: () => deleteItem(id),
    },
  ]);
};

  const deleteItem = async (id) => {
  setActionLoading(true);

  const { data, error } = await supabase
    .from('items')
    .delete()
    .eq('id', id)
    .select();

  console.log('DELETE DATA:', data);
  console.log('DELETE ERROR:', error);

  if (error) {
    Alert.alert('Error', error.message);
  } else {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session) await getItems(session.user.id);
  }

  setActionLoading(false);
};

  // ===============================
  // 🚪 LOGOUT
  // ===============================
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/login');
  };

  // ===============================
  // 🧱 RENDER ITEM
  // ===============================
  const renderItem = ({ item }) => (
  <View
    style={[
      styles.item,
      { backgroundColor: item.sudahDibeli ? '#dcfce7' : '#f9fafb' },
    ]}
  >
    {/* AREA KLIK KE DETAIL */}
    <TouchableOpacity
      style={{ flex: 1 }}
      activeOpacity={0.7}
      onPress={() => router.push(`/${item.id}`)}
    >
      <View>
        <Text style={styles.itemName}>{item.nama}</Text>
        <Text style={styles.itemSub}>
          Qty: {item.quantity} |{' '}
          <Text style={{ color: item.sudahDibeli ? '#15803d' : '#b91c1c' }}>
            {item.sudahDibeli ? 'Sudah Dibeli ✅' : 'Belum Dibeli ❌'}
          </Text>
        </Text>
      </View>
    </TouchableOpacity>

    {/* TOMBOL AKSI */}
    <View style={{ gap: 6 }}>
      <Button
        title={actionLoading ? 'Loading...' : item.sudahDibeli ? 'Belum' : 'Beli'}
        disabled={actionLoading}
        onPress={() => toggleSudahDibeli(item.id, item.sudahDibeli)}
      />
      <Button
        title="Hapus"
        color="#ef4444"
        disabled={actionLoading}
        onPress={() => confirmDelete(item.id)}
      />
    </View>
  </View>
);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎣 Mania Fishing Store</Text>
      <Text style={styles.subtitle}>Daftar Belanja Alat & Umpan</Text>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      <View style={styles.footer}>
        <Button title="➕ Tambah Item" onPress={() => router.push('/add')} />
        <Button title="Logout" color="#ef4444" onPress={handleLogout} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ecfdf5', padding: 16 },
  title: { fontSize: 24, fontWeight: '800', color: '#047857' },
  subtitle: { color: '#6b7280', marginBottom: 10 },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 10,
    padding: 14,
    width: width - 32,
  },
  itemName: { fontWeight: '700', fontSize: 16 },
  itemSub: { fontSize: 14 },
  separator: { height: 10 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
});
