import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HistoryScreen({ navigation }) {
  const [reservations, setReservations] = useState([]);

  const fetchReservations = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const user = await AsyncStorage.getItem('user');
      const user_id = JSON.parse(user).user_id;

      const response = await fetch(`http://192.168.1.250:5000/user/reservations?user_id=${user_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (response.ok) {
        setReservations(data);
      } else {
        Alert.alert('Αποτυχία', data.message || 'Σφάλμα ανάκτησης κρατήσεων');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Σφάλμα σύνδεσης');
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = await AsyncStorage.getItem('token');

      const response = await fetch(`http://192.168.1.250:5000/reservations/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Η κράτηση ακυρώθηκε');
        // Ανανέωση λίστας
        setReservations((prev) => prev.filter((r) => r.reservation_id !== id));
      } else {
        Alert.alert('Αποτυχία', data.message || 'Δεν ήταν δυνατή η ακύρωση');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Σφάλμα σύνδεσης');
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Οι Κρατήσεις μου</Text>

      <FlatList
        data={reservations}
        keyExtractor={(item) => item.reservation_id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.rest}>{item.restaurant_name}</Text>
            <Text>Ημερομηνία: {item.date.slice(0, 10)}</Text>
            <Text>Ώρα: {item.time}</Text>
            <Text>Άτομα: {item.people_count}</Text>
            <Button title="Επεξεργασία"onPress={() => navigation.navigate('EditReservation', { reservation: item })}/>
            <Button title="Ακύρωση" color="red" onPress={() => handleDelete(item.reservation_id)} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 22, marginBottom: 12, textAlign: 'center' },
  card: {
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: '#ccc',
  },
  rest: { fontWeight: 'bold', fontSize: 16, marginBottom: 4 },
});
