import React, { useContext, useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, Alert, ImageBackground } from 'react-native';
import { Image } from 'expo-image';
import axios from 'axios';
import { AuthContext } from './AuthContext';

export default function App({navigation}) {
    // part of the login, adapted for signup
    const { login, authToken } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    const handleSignup = () => {
        // Basic validation
        if (username.trim() === '' || password.trim() === '') {
          Alert.alert('Error', 'Please enter both username and password');
          return;
        }
    
        Alert.alert(CONFIG.serverURL, 'hey')
    
        const body = { username, password };
        console.log(body)
    
        axios.post(`${CONFIG.serverURL}signup`, body)
          .then(response => {
            const token = response.data.token;
            console.log(token);
            login(token);
          })
    
        // Normally, you would send the username and password to a server for authentication
        // This is a basic alert for demonstration purposes
        Alert.alert('Signup Successful', `Welcome, ${username}!`);
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
                <TextInput
                style={styles.useremail}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                />
                <TouchableOpacity onPress={() => {handleSignup}}>
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
      // justifyContent: 'center',
    //   alignItems: 'center',
      height: 780,
      width: 375
    },
    userinput: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 1,
        marginTop: 145,
        marginLeft: 22,
        paddingHorizontal: 10,
        backgroundColor: "#FFFFFF",
        borderRadius: 10, 
        width: '80%', // Adjust width to fit screen
      },
      userpass: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 1,
        marginTop: 47,
        marginLeft: 22,
        paddingHorizontal: 10,
        backgroundColor: "#FFFFFF",
        borderRadius: 10,
        width: '80%', // Adjust width to fit screen
      },
      useremail: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 1,
        marginTop: 47,
        marginLeft: 22,
        paddingHorizontal: 10,
        backgroundColor: "#FFFFFF",
        borderRadius: 10,
        width: '80%', // Adjust width to fit screen
      },
      signup: {
        width: 220, height:50,
        marginTop: 30,
        marginLeft: 22,
      }
});