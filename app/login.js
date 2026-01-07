import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { supabase } from './libary/supabaseclient';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      Alert.alert('Login Gagal', error.message);
    } else {
      Alert.alert('Sukses', 'Login berhasil');
      router.replace('/'); // ✅ ke index.js
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        placeholder="Email"
        style={styles.input}
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button title="Login" onPress={handleLogin} />
      <View style={{ marginTop: 10 }}>
        <Button
          title="Belum punya akun? Register"
          onPress={() => router.push('/register')} // ✅ FIX
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:'center', padding:16, backgroundColor:'#ecfdf5' },
  title: { fontSize:24, fontWeight:'700', marginBottom:20, color:'#047857' },
  input: { backgroundColor:'#fff', padding:10, marginBottom:10, borderRadius:8 }
});
