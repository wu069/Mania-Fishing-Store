// app/[id].js
import React, { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useShoppingStore } from './store/useShoppingStore';

export default function DetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { items, editItem, hapusItem } = useShoppingStore();

 
  const itemId = Number(id);

  
  const item = items.find((i) => i.id === itemId);

  const [nama, setNama] = useState(item?.nama || '');
  const [kategori, setKategori] = useState(item?.kategori || '');
  const [quantity, setQuantity] = useState(
    item?.quantity ? String(item.quantity) : ''
  );
  const [harga, setHarga] = useState(
    item?.harga ? String(item.harga) : ''
  );
  const [deskripsi, setDeskripsi] = useState(item?.deskripsi || '');

  const simpanPerubahan = () => {
    if (!nama.trim() || !kategori.trim()) {
      Alert.alert('Error', 'Nama dan kategori wajib diisi');
      return;
    }

    editItem(itemId, {
      nama: nama.trim(),
      kategori: kategori.trim(),
      quantity: parseInt(quantity) || 0,
      harga: Number(harga) || 0,
      deskripsi: deskripsi.trim(),
    });

    Alert.alert('✅ Sukses', 'Perubahan disimpan');
    router.replace('/');
  };

  const confirmDelete = () => {
    Alert.alert('Hapus Item', 'Yakin ingin menghapus?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: () => {
          hapusItem(itemId);
          Alert.alert('✅ Dihapus', 'Item berhasil dihapus');
          router.replace('/');
        },
      },
    ]);
  };

  
  if (!id || isNaN(itemId) || !item) {
    return (
      <View style={styles.center}>
        <Text style={styles.notFound}>Item tidak ditemukan.</Text>
        <Button title="⬅ Kembali" onPress={() => router.replace('/')} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Edit Item 🎣</Text>

      <Text style={styles.label}>Nama Item *</Text>
      <TextInput style={styles.input} value={nama} onChangeText={setNama} />

      <Text style={styles.label}>Kategori *</Text>
      <TextInput style={styles.input} value={kategori} onChangeText={setKategori} />

      <Text style={styles.label}>Quantity *</Text>
      <TextInput
        style={styles.input}
        value={quantity}
        keyboardType="numeric"
        onChangeText={setQuantity}
      />

      <Text style={styles.label}>Harga</Text>
      <TextInput
        style={styles.input}
        value={harga}
        keyboardType="numeric"
        onChangeText={setHarga}
      />

      <Text style={styles.label}>Deskripsi</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        multiline
        value={deskripsi}
        onChangeText={setDeskripsi}
      />

      <View style={{ marginTop: 12, gap: 8 }}>
        <Button title="💾 Simpan Perubahan" color="#047857" onPress={simpanPerubahan} />
        <Button title="🗑️ Hapus Item" color="#ef4444" onPress={confirmDelete} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#ecfdf5' },
  title: { fontSize: 22, fontWeight: '800', color: '#047857', marginBottom: 16 },
  label: { fontWeight: '600', marginTop: 8, color: '#374151' },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 10,
    marginTop: 4,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  notFound: {
    fontSize: 16,
    marginBottom: 12,
    color: '#374151',
  },
});

