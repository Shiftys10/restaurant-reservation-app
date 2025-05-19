import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ReservationsScreen({ route }) {
  const { restaurantId, restaurantName } = route.params || {};

  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [people, setPeople] = useState('');

  const handleReservation = async () => {
    console.log({
      restaurant_id: restaurantId,
      date,
      time,
      people_count: Number(people),
    });

    try {
      const token = await AsyncStorage.getItem('token');

      const response = await fetch('http://192.168.1.250:5000/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          restaurant_id: restaurantId,
          date,
          time,
          people_count: Number(people),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Κράτηση επιτυχής!');
        setDate('');
        setTime('');
        setPeople('');
      } else {
        Alert.alert('Αποτυχία', data.message || 'Σφάλμα κράτησης');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Σφάλμα σύνδεσης');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Κράτηση για: {restaurantName}</Text>

      <TextInput
        style={styles.input}
        placeholder="Ημερομηνία (YYYY-MM-DD)"
        value={date}
        onChangeText={setDate}
      />

      <TextInput
        style={styles.input}
        placeholder="Ώρα (HH:MM)"
        value={time}
        onChangeText={setTime}
      />

      <TextInput
        style={styles.input}
        placeholder="Αριθμός ατόμων"
        keyboardType="numeric"
        value={people}
        onChangeText={setPeople}
      />

      <Button title="Κάνε Κράτηση" onPress={handleReservation} />
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
});
