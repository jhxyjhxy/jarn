import React, { useContext, useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, Alert, ImageBackground } from 'react-native';
import { Image } from 'expo-image';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { CONFIG } from './config';

export default function App({navigation}) {
    // part of the login, adapted for signup
    const { login, authToken } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSignup = () => {
        console.log("inhandleSignup");
        // Basic validation
        if (username.trim() === '' || password.trim() === '') {
          Alert.alert('Error', 'Please enter both username and password');
          return;
        }
    
        // Alert.alert(CONFIG.serverURL, 'hey')
    
        const body = { username, password };
        console.log(body)
        console.log("before post");
        axios.post(`${CONFIG.serverURL}signup`, body)
          .then(response => {
            const token = response.data.token;
            console.log(token);
            login(token);
          })
          console.log("after post");
        // Normally, you would send the username and password to a server for authentication
        // This is a basic alert for demonstration purposes
        Alert.alert('Signup Successful', `Welcome, ${username}!`);
        console.log("done");
        navigation.navigate('home');
      };

    return (
        <View style={styles.container}>
            <ImageBackground source={require('./assets/signuppge.png')} style = {styles.container}>
            {/* <Text>Hello world!</Text> */}
                <TextInput
                style={styles.userinput}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                />

                <TextInput
                style={styles.userpass}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                />
                <TouchableOpacity onPress={handleSignup}>
                    <Image
                        source={require('./assets/createbtn.png')}
                        style={styles.signup}
                    />  
                </TouchableOpacity>
            </ImageBackground>
        </View>
        
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userinput: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: '44%',
    marginLeft: 25,
    paddingHorizontal: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 10, 
    width: '80%', // Adjust width to fit screen
  },
  userpass: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: '15%',
    marginLeft: 25,
    paddingHorizontal: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    width: '80%', // Adjust width to fit screen
  },
  signup: {
    width: '42%',
    height: '20%',
    marginTop: '4%',
    marginLeft: '6%',
  }
});