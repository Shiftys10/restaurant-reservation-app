import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  if (!user) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Προφίλ Χρήστη</Text>
      <Text style={styles.label}>Όνομα:</Text>
      <Text style={styles.info}>{user.name}</Text>
      <Text style={styles.label}>Email:</Text>
      <Text style={styles.info}>{user.email}</Text>

      <Button title="Αποσύνδεση" onPress={handleLogout} color="red" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  label: { fontSize: 16, marginTop: 10, color: 'gray' },
  info: { fontSize: 18, marginBottom: 10 },
});
