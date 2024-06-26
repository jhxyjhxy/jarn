import { Camera, CameraType } from 'expo-camera';
import { useState, useEffect, useContext } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import * as Location from 'expo-location';
import axios from 'axios';
import { CONFIG } from './config';
import { AuthContext } from './AuthContext';
import { useNavigation } from '@react-navigation/native';

export default function App() {
  // camera stuff
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [cameraRef, setCameraRef] = useState(null);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  const [photoUri, setPhotoUri] = useState(null);
  
  // location stuff
  
  const [isVisible, setIsVisible] = useState(false);

  // challenge stuff
  const [challenge, setChallenge] = useState(null);

  // navigating between camera and preview
  const navigation = useNavigation();
  
  const toggleChallengeDescription = () => {
    setIsVisible(!isVisible);
    getChallenge();
  }
  // token
  const { authToken } = useContext(AuthContext);


  const takePicture = async () => {
    if (cameraRef) {
      const { uri } = await cameraRef.takePictureAsync();
      if (uri) {
        console.log(uri);
        
        // navigate to results page
        setPhotoUri(uri);
        console.log('before preview: ' + photoUri);

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
        formData.append('title', challenge.title);
        formData.append('description', challenge.description);
        try {
          const response = await axios.post(`${CONFIG.serverURL}photos`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${authToken}`
            },
          });

          // Handle the response from the server
          if (response.status == 200) {
            // Image uploaded successfully
            console.log('Image uploaded successfully');
            // navigate to community page
            navigation.navigate('community');
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

  const getChallenge = async () => {
    try {
      console.log('hello!');
      const response = await axios.get(`${CONFIG.serverURL}challenge`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        },
      });
      console.log('Challenge:', response.data);
      setChallenge(response.data);
    } catch (error) {
      console.error('Error getting the challenge data:', error);
    }
  }

  useEffect(() => {
    console.log('useeffect running');
    getChallenge();
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      // let location = await Location.getCurrentPositionAsync({});
      // setLocation(location);

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
        <Text style={{ textAlign: 'center', marginTop: 100 }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraType() {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  }

  return (
    <View style={styles.container}>
      <View style={styles.challengeContainer}>
        <TouchableOpacity style={styles.challengeTitle} onPress={toggleChallengeDescription}>
            <Image
              style={styles.titleImg}
              source={require('./assets/challengetitle.png')}
            />
            <Text style={styles.titleText}>Press me for a challenge!</Text>
          </TouchableOpacity>
      </View>
      {isVisible && (
        <View style={styles.challengeDesc}>
          <Text style={styles.text}>{"\n" + challenge?.title + "\n\n" + challenge?.description}</Text>
        </View>
      )}
      <Camera style={styles.camera} type={type} flashMode={flash} ref={(ref) => {
          setCameraRef(ref);
        }}>
        <View style={styles.buttonContainer}>
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
  challengeContainer: {
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#C5E99B',
    width: '100%',
    height: '20%',
    position: 'absolute',
    padding: 15,
    top: 0,
    zIndex: 1,
  },
  challengeTitle: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    // position: 'absolute',
    top: 15,
    left: 40,
    padding: 10,
    zIndex: 3,
    // backgroundColor: 'blue',
  },
  titleImg: {
    width: 285,
    height: 130,
  },
  camera: {
    flex: 1,
    height: '50%',
  },
  challengeDesc: {
    display: 'flex',
    alignItems: 'center',
    width: '80%',
    height: 400,
    position: 'absolute',
    zIndex: 99,
    top: 200,
    left: 40,
    backgroundColor: 'white',
    padding: 20,
  },
  descriptionImg: {
    width: 200,
    height: 300,
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
    color: '#273C2C',
    textAlign: 'center',
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#273C2C',
    textAlign: 'center',
    position: 'absolute',
    top: '35%',
    left: '20%',
    zIndex: 99,
  },
  location: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  }
});
