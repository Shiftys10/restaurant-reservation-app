import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity } from 'react-native';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Σφάλμα', 'Συμπλήρωσε όλα τα πεδία');
      return;
    }

    try {
      const response = await fetch('http://192.168.1.250:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Εγγραφή επιτυχής!', 'Μπορείς τώρα να συνδεθείς');
        navigation.navigate('Login');
      } else {
        Alert.alert('Αποτυχία', data.message || 'Κάτι πήγε στραβά');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Σφάλμα σύνδεσης');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Εγγραφή Χρήστη</Text>

      <TextInput
        style={styles.input}
        placeholder="Όνομα"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Κωδικός"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button title="Εγγραφή" onPress={handleRegister} />

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Έχεις ήδη λογαριασμό; Σύνδεση</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, textAlign: 'center', marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 12,
    borderRadius: 6,
  },
  link: {
    marginTop: 16,
    color: 'blue',
    textAlign: 'center',
  },
});
