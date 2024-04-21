import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useState, useEffect, useContext } from 'react';
import { Image } from 'expo-image';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import * as Location from 'expo-location';
import {CONFIG} from './config';

export default function HomeScreen({navigation}) {
    const [location, setLocation] = useState(null);
    const [town, setTown] = useState(null);
    const [country, setCountry] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    const { authToken } = useContext(AuthContext);
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
              console.log("country", response.data.address.country);
              console.log("town", response.data.address.city);
              try {
                axios.post(`${CONFIG.serverURL}location`, 
                 {'location': `${response.data.address.city},${response.data.address.country}`}, {
                    headers: {
                      'Authorization': `Bearer ${authToken}`
                    },
                  }
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
  

    return (
        <View style={styles.container}>
            <View>  
                <Image
                    source={require('./assets/naturequesttitle.png')} 
                    style={styles.logo}
                /> 
            </View>
            <View>
                <TouchableOpacity onPress={() => navigation.navigate('camera')}>
                    <Image
                        source={require('./assets/challengebtn.png')}
                        style={styles.challenge}
                    />  
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('community')}>
                    <Image
                        source={require('./assets/friendsbtn.png')}
                        style={styles.friends}
                    />  
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('settings')}>
                    <Image
                        source={require('./assets/settingsbtn.png')}
                        style={styles.settings}
                    /> 
                </TouchableOpacity>
            </View>
        </View>
    )
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#C5E99B',
        alignItems: 'center',
      },
    logo: {
        width: 375, height:375,
        marginTop: 20
    },
    challenge: {
        width: 200, height:50,
        marginTop: 60,
        marginBottom: 20
    },
    friends: {
        width: 200, height:45,
        marginBottom: 25
    },
    settings: {
        width: 200, height:50,
        paddingTop: 20
    }
});