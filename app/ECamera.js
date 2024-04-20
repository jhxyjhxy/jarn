import { Camera, CameraType } from 'expo-camera';
import { useState, useEffect } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';
// import * as MediaLibrary from 'expo-media-library';


export default function App() {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [cameraRef, setCameraRef] = useState(null);

  const [location, setLocation] = useState(null);
  const [town, setTown] = useState(null);
  const [country, setCountry] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);


  const takePicture = async () => {
    if (cameraRef) {
      const { uri } = await cameraRef.takePictureAsync();
      if (uri) {
        // Save the picture to the device's media library
        // await MediaLibrary.saveToLibraryAsync(uri); // uncomment if you want every pic to be saved to device library
        console.log(uri);
        alert('Picture saved to your photos :3');
        // get the data from the photo
        const result = await fetch(`file://${uri}`)
        const data = await result.blob();
        console.log(data);
      }
    }
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      // Reverse geocoding
      axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.coords.latitude}&lon=${location.coords.longitude}`)
        .then(response => {
          console.log(response.data);
          setCountry(response.data.address.country);
          setTown(response.data.address.city);
        })
        .catch(error => {
          console.error('Error fetching town:', error);
          setErrorMsg('Error fetching town');
        });
    })();
  }, []);

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
        <View style={styles.location}>
          {errorMsg ? <Text>{errorMsg}</Text> :
            location && (
              <>
                <Text style={styles.text}>Location: {town || 'Loading...'}, {country || ''}</Text>
              </>
            )
          }
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
  location: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  }
});
