import React, { useContext, useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import axios from 'axios';
import { CONFIG } from './config';
import { AuthContext } from './AuthContext';
import Polaroid from './polaroid'; // Import the Polaroid component

export default function CommunityScreen({ navigation }) {
  const { authToken } = useContext(AuthContext);
  const [photos, setPhotos] = useState([]);
  const [username, setUserName] = useState([]);

  useEffect(() => {
    if (photos.length > 0) return;
    axios.get(`${CONFIG.serverURL}photos`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
    }).then( async ({ data }) => {
      setPhotos(data);
      console.log(data[0]);
      const user = await Promise.all(data.map(photo => axios.get(`${CONFIG.serverURL}user/${photo.uploadedBy}`).then(response => response.data.username)));
      setUserName(user);
      console.log(user);
    });
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={photos}
        keyExtractor={photo => photo._id}
        renderItem={({ item: {title, description, imageUrl}, index }) => (
          <Polaroid
            topText={title}
            bottomText={description}
            userText = {username?.[index]}
            imageUrl={`${CONFIG.serverURL}${imageUrl}`}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#C5E99B',
    padding: 12,
  },
});
