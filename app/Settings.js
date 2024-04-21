import React, { useContext, useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, Alert, ImageBackground } from 'react-native';
import { Image } from 'expo-image';

export default function App({navigation}) {
    return (
        <View style={styles.container}>
            <ImageBackground style={styles.img} source={require('./assets/settings.png')}>
                <TouchableOpacity onPress={() => navigation.navigate('home')}>
                    <Image
                        source={require('./assets/okay.png')}
                        style={styles.okay}
                    /> 
                </TouchableOpacity>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    img: {
      flex: 1,
    },
    okay: {
        width: 200,
        height: 50,
        marginTop: '64%',
        marginLeft: '4%'
    }
});