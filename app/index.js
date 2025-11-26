import { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Button,
  Alert,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from './supabaseclient';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // ===============================
  // 🔥 CEK LOGIN USER
  // ===============================
  const checkUser = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      router.push('/login'); // redirect ke halaman login jika belum login
    } else {
      getItems();
    }
    setLoading(false);
  };

  useEffect(() => {
    checkUser();
  }, []);

  // ===============================
  // 🔥 FETCH DATA DARI SUPABASE
  // ===============================
  const getItems = async () => {
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .order('id', { ascending: false });

    if (error) console.log(error);
    else setItems(data);
  };

  // ===============================
  // 🔥 UPDATE STATUS SUDAH DIBELI
  // ===============================
  const toggleSudahDibeli = async (id, currentValue) => {
    const { error } = await supabase
      .from('items')
      .update({ sudahDibeli: !currentValue })
      .eq('id', id);

    if (error) console.log('Update error:', error);
    else getItems();
  };

  // ===============================
  // 🔥 HAPUS DATA SUPABASE
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
    const { error } = await supabase.from('items').delete().eq('id', id);
    if (error) console.log('Delete error:', error);
    else getItems();
  };

  // ===============================
  // 🔥 LOGOUT
  // ===============================
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  // ===============================
  // 🔥 RENDER ITEM
  // ===============================
  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => router.push(`/${item.id}`)}
      style={[
        styles.item,
        { backgroundColor: item.sudahDibeli ? '#dcfce7' : '#f9fafb' },
      ]}
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.itemName}>{item.nama}</Text>
        <Text style={styles.itemSub}>
          Qty: {item.quantity} |{' '}
          <Text style={{ color: item.sudahDibeli ? '#15803d' : '#b91c1c' }}>
            {item.sudahDibeli ? 'Sudah Dibeli ✅' : 'Belum Dibeli ❌'}
          </Text>
        </Text>
      </View>

      <View style={{ flexDirection: 'column', gap: 5 }}>
        <Button
          title={item.sudahDibeli ? 'Belum' : 'Beli'}
          onPress={() => toggleSudahDibeli(item.id, item.sudahDibeli)}
          color={item.sudahDibeli ? '#f59e0b' : '#16a34a'}
        />
        <Button
          title="Hapus"
          color="#ef4444"
          onPress={() => confirmDelete(item.id)}
        />
      </View>
    </TouchableOpacity>
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
        ListEmptyComponent={() => (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🪝</Text>
            <Text style={styles.emptyText}>Belum ada item belanja</Text>
            <Text style={styles.emptySub}>
              Gunakan tab “Tambah” untuk menambahkan alat pancing baru
            </Text>
          </View>
        )}
        contentContainerStyle={
          items.length === 0
            ? { flexGrow: 1, justifyContent: 'center' }
            : null
        }
      />

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
        <Button
          title="➕ Tambah Item"
          color="#047857"
          onPress={() => router.push('/add')}
        />
        <Button
          title="Logout"
          color="#ef4444"
          onPress={handleLogout}
        />
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
    elevation: 1,
    shadowOpacity: 0.1,
    width: width - 32,
  },
  itemName: { fontWeight: '700', fontSize: 16, color: '#111827' },
  itemSub: { color: '#374151', fontSize: 14 },
  separator: { height: 10 },
  empty: { alignItems: 'center', padding: 20 },
  emptyEmoji: { fontSize: 64 },
  emptyText: { fontSize: 18, fontWeight: '700', color: '#047857' },
  emptySub: {
    color: '#6b7280',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
  },
});
