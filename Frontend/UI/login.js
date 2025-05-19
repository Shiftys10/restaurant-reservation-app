import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('http://192.168.1.250:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('user', JSON.stringify(data.user));
        Alert.alert('Επιτυχής σύνδεση');
        navigation.navigate('Restaurants');
        } else {
        Alert.alert('Σφάλμα', data.message || 'Αποτυχία σύνδεσης');
      }
    } catch (error) {
      Alert.alert('Σφάλμα σύνδεσης');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Σύνδεση</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Κωδικός"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />
      <Button title="Σύνδεση" onPress={handleLogin} />
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
      <Text style={{ color: 'blue', marginTop: 16, textAlign: 'center' }}>
        Δεν έχεις λογαριασμό; Κάνε εγγραφή
      </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  input: { borderWidth: 1, marginBottom: 12, padding: 10, borderRadius: 6 },
  title: { fontSize: 24, marginBottom: 24, textAlign: 'center' },
});
