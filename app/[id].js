// app/[id].js
import React, { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, TextInput, Button, Alert, StyleSheet, ScrollView } from 'react-native';
import { useShoppingStore } from './store/useShoppingStore';

export default function DetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { items, editItem, hapusItem } = useShoppingStore();

  const item = items.find((i) => i.id === id);
  const [nama, setNama] = useState(item?.nama || '');
  const [kategori, setKategori] = useState(item?.kategori || '');
  const [quantity, setQuantity] = useState(String(item?.quantity || ''));
  const [harga, setHarga] = useState(String(item?.harga || ''));
  const [deskripsi, setDeskripsi] = useState(item?.deskripsi || '');

  const simpanPerubahan = () => {
    if (!nama.trim() || !kategori.trim()) {
      Alert.alert('Error', 'Nama dan kategori wajib diisi');
      return;
    }

    editItem(Number(id), {
      nama: nama.trim(),
      kategori: kategori.trim(),
      quantity: parseInt(quantity),
      harga: harga ? Number(harga) : 0,
      deskripsi: deskripsi.trim(),
    });

    Alert.alert('✅ Sukses', 'Perubahan disimpan');
    router.push('/');
  };

  const confirmDelete = () => {
    Alert.alert('Hapus Item', 'Yakin ingin menghapus?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: () => {
          hapusItem(Number(id));
          Alert.alert('✅ Dihapus', 'Item berhasil dihapus');
          router.push('/');
        },
      },
    ]);
  };

  if (!item) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Item tidak ditemukan.</Text>
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

      <View style={{ marginTop: 10, gap: 8 }}>
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
});
