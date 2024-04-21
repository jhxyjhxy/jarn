import React, { useContext, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { CONFIG } from './config';
import { AuthContext } from './AuthContext';

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

    Alert.alert(CONFIG.serverURL, 'hey')

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
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button title="Login" onPress={handleLogin} />
      <Text>TOKEN: {authToken}</Text>
      <Button title="Go to Camera" onPress={() => navigation.navigate('camera')} />
      <Button title="Go to Home Page" onPress={() => navigation.navigate('home')} />
      <Button title="Go to Community" onPress={() => navigation.navigate('community')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: '80%', // Adjust width to fit screen
  },
});