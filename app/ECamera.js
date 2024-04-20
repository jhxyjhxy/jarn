import { Camera, CameraType } from 'expo-camera';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import * as MediaLibrary from 'expo-media-library';
import axios from 'axios';



export default function App() {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [cameraRef, setCameraRef] = useState(null);


  const takePicture = async () => {
    if (cameraRef) {
      const { uri } = await cameraRef.takePictureAsync();
      if (uri) {
        // Save the picture to the device's media library
        // await MediaLibrary.saveToLibraryAsync(uri); // uncomment if you want every pic to be saved to device library
        console.log(uri);
        alert('Uploaded :3');
        // get the data from the photo
        const result = await fetch(`file://${uri}`)
        const data = await result.blob();
        console.log(data);
        // send the data to the server
        const formData = new FormData();
        formData.append('photo', {
          uri: uri,
          type: 'image/jpeg',
          name: 'photo.jpg',
        });
        try {
          const response = await axios.post('https://a5fc-164-67-154-29.ngrok-free.app/pic', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          // Handle the response from the server
          if (response.ok) {
            // Image uploaded successfully
            console.log('Image uploaded successfully');
          } else {
            // Error uploading image
            console.error('Error uploading image');
          }
        } catch (error) {
          console.error('Error uploading image:', error);
        }
      }
    }
  };

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraType() {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  }

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={type} ref={(ref) => {
          setCameraRef(ref);
        }}>
        <View style={styles.takeButtonContainer}>
          <TouchableOpacity style={styles.takeButton} onPress={takePicture}>
            <Text style={styles.text}>Snap!</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.flipButtonContainer}>
          <TouchableOpacity style={styles.flipButton} onPress={toggleCameraType}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  takeButtonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  takeButton: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 50,
  },
  flipButtonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  flipButton: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 50,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});
