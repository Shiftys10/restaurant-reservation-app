import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, Alert, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Restaurants({ navigation }) {
  const [restaurants, setRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const token = await AsyncStorage.getItem('token');

        const response = await fetch('http://192.168.1.250:5000/restaurants', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();

        if (response.ok) {
          setRestaurants(data);
        } else {
          Alert.alert('Σφάλμα', 'Αποτυχία φόρτωσης εστιατορίων');
        }
      } catch (error) {
        Alert.alert('Σφάλμα', 'Αποτυχία σύνδεσης');
        console.error(error);
      }
    };

    fetchRestaurants();
  }, []);

  const filteredRestaurants = restaurants.filter((r) =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Εστιατόρια</Text>

      <Button
         title="Δες τις κρατήσεις σου"
          onPress={() => navigation.navigate('History')}
      />
      <Button
          title="Το Προφίλ μου"
            onPress={() => navigation.navigate('Profile')}
      />

      <TextInput
        style={styles.input}
        placeholder="Αναζήτηση με όνομα ή τοποθεσία"
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      <FlatList
        data={filteredRestaurants}
        keyExtractor={(item) => item.restaurant_id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.name}>{item.name}</Text>
            <Text>{item.location}</Text>
            <Text>{item.description}</Text>
            <Button
              title="Κάνε Κράτηση"
              onPress={() =>
                navigation.navigate('Reservations', {
                  restaurantId: item.restaurant_id,
                  restaurantName: item.name,
                })
              }
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 22, marginBottom: 12, textAlign: 'center' },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 12,
    borderRadius: 6,
    borderColor: '#ccc',
  },
  item: {
    marginBottom: 12,
    padding: 10,
    borderWidth: 1,
    borderRadius: 6,
  },
  name: { fontWeight: 'bold', fontSize: 16 },
});
