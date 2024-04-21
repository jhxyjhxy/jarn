import React, { useContext, useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import axios from 'axios';
import { CONFIG } from './config';
import { AuthContext } from './AuthContext';
import Polaroid from './polaroid'; // Import the Polaroid component

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
      setPhotos(data);
    });
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={photos}
        keyExtractor={photo => photo._id}
        renderItem={({ item: {title, description, imageUrl} }) => (
          <Polaroid
            topText={title}
            bottomText={description}
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
