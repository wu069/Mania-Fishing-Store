import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Button, Text, TextInput, View } from 'react-native';
import { supabase } from './libary/supabaseclient';

export default function AddItem() {
  const router = useRouter();
  const [nama, setNama] = useState('');
  const [kategori, setKategori] = useState('');
  const [quantity, setQuantity] = useState('');
  const [harga, setHarga] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [loading, setLoading] = useState(false);

  const simpanItem = async () => {
    if (!nama || !kategori) {
      Alert.alert('Error', 'Nama dan kategori wajib diisi');
      return;
    }

    setLoading(true);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    const { error } = await supabase.from('items').insert({
      nama,
      kategori,
      quantity: Number(quantity) || 0,
      harga: Number(harga) || 0,
      deskripsi,
      sudahDibeli: false,
      user_id: session.user.id,
    });

    setLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Sukses', 'Item berhasil ditambahkan');
      router.replace('/');
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <Text>Tambah Item</Text>

      <TextInput placeholder="Nama" onChangeText={setNama} />
      <TextInput placeholder="Kategori" onChangeText={setKategori} />
      <TextInput placeholder="Quantity" keyboardType="numeric" onChangeText={setQuantity} />
      <TextInput placeholder="Harga" keyboardType="numeric" onChangeText={setHarga} />
      <TextInput placeholder="Deskripsi" onChangeText={setDeskripsi} />

      <Button
        title={loading ? 'Menyimpan...' : 'Simpan'}
        onPress={simpanItem}
        disabled={loading}
      />
    </View>
  );
}

