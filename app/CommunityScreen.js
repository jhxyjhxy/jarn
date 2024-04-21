import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { CONFIG } from './config';
import { AuthContext } from './AuthContext';
import { Image } from 'expo-image';
import { FlatList } from 'react-native-gesture-handler';

export default function CommunityScreen({ navigation }) {
  const { authToken } = useContext(AuthContext);
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    if (photos.length > 0) return;
    axios.get(`${CONFIG.serverURL}photos`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
    }).then(({ data }) => {
      console.log('hello?')
      console.log(data);
      setPhotos(data);
    });
  }, []);


  return (
    <View style={styles.container}>
      <FlatList
        data={photos}
        keyExtractor={photo => photo._id}
        renderItem={({ item: { title, description, imageUrl } }) => {
          return (
            <View>
              <Text style={styles.title}>{"\n" + title}</Text>
              <Text style={styles.description}>{description + "\n"}</Text>
              <Image source={{ uri: `${CONFIG.serverURL}${imageUrl}` }} style={styles.img} />
            </View>
          )
        }}
      />
    </View>
    // <View style={styles.container}>
    //   <Text>hello</Text>
    //   {photos.map(photo => {
    //     return (
    //       <Image key={photo._id} source={{ uri: `${CONFIG.serverURL}${photo.imageUrl}` }} style={{ aspectRatio: 9 / 16, width: '50%' }} />
    //     )
    //   })}
    // </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflowY: 'scroll',
    flexDirection: 'column',
    backgroundColor: '#C5E99B',
    padding: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  description: {
    fontSize: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: '80%', // Adjust width to fit screen
  },
  img: {
    aspectRatio: 9 / 16,
    width: '100%',
  },
});