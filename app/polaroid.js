import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

const Polaroid = ({ imageUrl, topText, bottomText }) => {
    console.log('got to polaroid');
  return (
    <View style={styles.container}>
      <View style={styles.polaroid}>
        <Text style={styles.topText}>{topText}</Text>
        <Image source={{ uri: imageUrl }} style={styles.image} />
        <Text style={styles.bottomText}>{bottomText}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  polaroid: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    marginVertical: '30%',
    elevation: 3,
  },
  image: {
    width: 300,
    height: 320,
    marginBottom: 16,
    marginTop: 16,
    borderRadius: 5,
    borderWidth: 2,
    alignSelf: 'center',
  },
  topText: {
    // marginTop: 5,
    fontSize: 32,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
  bottomText: {
    fontSize: 20,
    color: 'black',
    textAlign: 'center',
    maxWidth: 300,
  },
});

export default Polaroid;
