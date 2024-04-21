import React, { useContext, useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, Alert, ImageBackground } from 'react-native';
import axios from 'axios';
import { CONFIG } from './config';
import { AuthContext } from './AuthContext';
import { Image } from 'expo-image';

export default function LoginScreen({ navigation }) {
  const { login, authToken } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Basic validation
    if (username.trim() === '' || password.trim() === '') {

      Alert.alert('Error', 'Please enter both username and password');
      return;
    }

    // Alert.alert(CONFIG.serverURL, 'hey')

    const body = { username, password };
    console.log(body)

    axios.post(`${CONFIG.serverURL}login`, body)
      .then(response => {
        const token = response.data.token;
        console.log(token);
        login(token);
      })

    // Normally, you would send the username and password to a server for authentication
    // This is a basic alert for demonstration purposes
    Alert.alert('Login Successful', `Welcome, ${username}!`);
    navigation.navigate('home');
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={require('./assets/loginsignupaltered.png')} style = {styles.container}>

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

        {/* <Button title="Login" onPress={handleLogin} /> */}
        {/* <Text>TOKEN: {authToken}</Text> */}
        <View style={styles.buttons}>    
        <TouchableOpacity onPress={handleLogin}>
            <Image
                source={require('./assets/loginbtn.png')}
                style={styles.login}
            />  
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('signup')}>
            <Image
                source={require('./assets/loginsignupbtn.png')}
                style={styles.signup}
            />  
        </TouchableOpacity>
        </View>

        </ImageBackground>
    </View>
  );
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
  buttons: {
    flex: 1,
    alignItems: 'center',
  },
  login: {
    width: 160, 
    height: 40,
    marginTop: '2%',
    alignItems: 'center',
  },
  signup: {
    width: 270,
    height: 50,
    marginTop: '80%',
  }
});