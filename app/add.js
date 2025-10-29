import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  ScrollView,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useShoppingStore } from './store/useShoppingStore';

const { width } = Dimensions.get('window');

export default function AddItemScreen() {
  const router = useRouter();
  const tambahItem = useShoppingStore((s) => s.tambahItem);

  const [nama, setNama] = useState('');
  const [kategori, setKategori] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [harga, setHarga] = useState('');
  const [deskripsi, setDeskripsi] = useState('');

  const validateForm = () => {
    if (!nama.trim()) return 'Nama item wajib diisi';
    if (!kategori.trim()) return 'Kategori wajib diisi';
    if (isNaN(quantity) || parseInt(quantity) <= 0) return 'Quantity harus angka > 0';
    if (harga && isNaN(harga)) return 'Harga harus angka';
    return null;
  };

  const onSubmit = () => {
    const error = validateForm();
    if (error) {
      Alert.alert('Validasi Gagal', error);
      return;
    }

    tambahItem({
      nama: nama.trim(),
      kategori: kategori.trim(),
      quantity: parseInt(quantity),
      harga: harga ? Number(harga) : 0,
      deskripsi: deskripsi.trim(),
    });

    Alert.alert('✅ Sukses', 'Item berhasil ditambahkan!');
    router.push('/');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Tambah Item 🎣</Text>

        <Text style={styles.label}>Nama Item *</Text>
        <TextInput
          value={nama}
          onChangeText={setNama}
          placeholder="Contoh: Reel Shimano FX200"
          style={styles.input}
        />

        <Text style={styles.label}>Kategori *</Text>
        <TextInput
          value={kategori}
          onChangeText={setKategori}
          placeholder="Contoh: Reel, Umpan, Joran"
          style={styles.input}
        />

        <Text style={styles.label}>Quantity *</Text>
        <TextInput
          value={quantity}
          onChangeText={setQuantity}
          keyboardType="numeric"
          style={styles.input}
        />

        <Text style={styles.label}>Harga (opsional)</Text>
        <TextInput
          value={harga}
          onChangeText={setHarga}
          keyboardType="numeric"
          placeholder="Misal: 250000"
          style={styles.input}
        />

        <Text style={styles.label}>Deskripsi (opsional)</Text>
        <TextInput
          value={deskripsi}
          onChangeText={setDeskripsi}
          multiline
          style={[styles.input, { height: 80 }]}
          placeholder="Deskripsi singkat produk..."
        />

        <View style={{ marginTop: 12, gap: 8 }}>
          <Button title="💾 Simpan Item" color="#047857" onPress={onSubmit} />
          <Button title="⬅️ Kembali" color="#6b7280" onPress={() => router.back()} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#ecfdf5',
    minHeight: '100%',
  },
  title: { fontSize: 22, fontWeight: '800', color: '#047857', marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginTop: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 10,
    marginTop: 4,
    backgroundColor: '#fff',
    width: width - 32,
  },
});
