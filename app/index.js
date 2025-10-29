import React from 'react';
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
import { useShoppingStore } from './store/useShoppingStore';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const { items, hapusItem, toggleSudahDibeli } = useShoppingStore();

  const confirmDelete = (id) => {
    Alert.alert('Hapus Item', 'Yakin ingin menghapus item ini?', [
      { text: 'Batal', style: 'cancel' },
      { text: 'Hapus', style: 'destructive', onPress: () => hapusItem(id) },
    ]);
  };

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
          onPress={() => toggleSudahDibeli(item.id)}
          color={item.sudahDibeli ? '#f59e0b' : '#16a34a'}
        />
        <Button title="Hapus" color="#ef4444" onPress={() => confirmDelete(item.id)} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎣 Mania Fishing Store</Text>
      <Text style={styles.subtitle}>Daftar Belanja Alat & Umpan</Text>

      <FlatList
        data={items.sort((a, b) => b.id - a.id)}
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
          items.length === 0 ? { flexGrow: 1, justifyContent: 'center' } : null
        }
      />
      <View style={styles.addButton}>
        <Button title="➕ Tambah Item" color="#047857" onPress={() => router.push('/add')} />
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
  emptySub: { color: '#6b7280', fontSize: 14, textAlign: 'center', marginTop: 4 },
  addButton: { marginTop: 20 },
});
