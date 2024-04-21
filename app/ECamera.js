import { Camera, CameraType } from 'expo-camera';
import { useState, useEffect } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import * as Location from 'expo-location';
import axios from 'axios';
// import * as MediaLibrary from 'expo-media-library';



export default function App() {
  // camera stuff
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [cameraRef, setCameraRef] = useState(null);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);

  
  // location stuff
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
          if (response.status == 200) {
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
        .then((response) => {
          console.log(response.data);
          setCountry(response.data.address.country);
          setTown(response.data.address.city);

          try {
            axios.post('https://a5fc-164-67-154-29.ngrok-free.app/location', 
              response.data
            ).then(
              (response2) => {
                console.log(response2.status);
                if (response2.status == 200) {
                  // Image uploaded successfully
                  console.log('Location data sent successfully');
                } 
                else {
                  // Error uploading image
                  console.error('Error sending location data');
                }
              } 
            );
          } 
          
          catch (error) {
            console.error('Error uploading image:', error);
          }

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
      <Camera style={styles.camera} type={type} flashMode={flash} ref={(ref) => {
          setCameraRef(ref);
        }}>
        <View style={styles.buttonContainer}>

          {/* <View style={styles.location}>
            {errorMsg ? <Text>{errorMsg}</Text> :
              location && (
                <>
                  <Text style={styles.text}>Location: {town || 'Loading...'}, {country || ''}</Text>
                </>
              )
            }
          </View> */}

          <TouchableOpacity style={styles.button} onPress={() => {
              setFlash(
                flash === Camera.Constants.FlashMode.off
                  ? Camera.Constants.FlashMode.torch
                  : Camera.Constants.FlashMode.off);
            }}>
            <Image
              style={styles.tiny}
              source={require('./assets/flash.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Image
                style={styles.nottiny}
                source={require('./assets/snap.png')}
              />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
            <Image
                style={styles.kindoftiny}
                source={require('./assets/flip.png')}
              />
            </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  camera: {
    flex: 1,
    height: '80%',
  },
  tiny: {
    width: 20,
    height: 40,
  },
  kindoftiny: {
    width: 40,
    height: 40,
  },
  nottiny: {
    width: 70,
    height: 70,
  },
  buttonContainer: {
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'baseline',
    backgroundColor: '#C5E99B',
    alignItems: 'center',
    width: '100%',
    height: '15%',
    position: 'absolute',
    padding: 15,
    bottom: 0,
  },
  button: {
    flex: 1,
    alignItems: 'center',
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
