import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EditReservationScreen({ route, navigation }) {
  const { reservation } = route.params;

  const [date, setDate] = useState(reservation.date.slice(0, 10));
  const [time, setTime] = useState(reservation.time);
  const [people, setPeople] = useState(String(reservation.people_count));

  const handleUpdate = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      const response = await fetch(`http://192.168.1.250:5000/reservations/${reservation.reservation_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          date,
          time,
          people_count: Number(people),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Επιτυχής ενημέρωση!');
        navigation.goBack();
      } else {
        Alert.alert('Αποτυχία', data.message || 'Δεν έγινε ενημέρωση');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Σφάλμα σύνδεσης');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Επεξεργασία Κράτησης</Text>

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
        placeholder="Άτομα"
        keyboardType="numeric"
        value={people}
        onChangeText={setPeople}
      />

      <Button title="Αποθήκευση" onPress={handleUpdate} />
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
