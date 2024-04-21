import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useState, useEffect } from 'react';
import { Image } from 'expo-image';

export default function App() {
    return (
        <View style={styles.container}>
            <View>  
                <Image
                    source={require('./assets/naturequesttitle.png')} 
                    style={styles.logo}
                /> 
            </View>
            <View>
                <TouchableOpacity>
                    <Image
                        source={require('./assets/challengebtn.png')}
                        style={styles.challenge}
                    />  
                </TouchableOpacity>
                <TouchableOpacity>
                    <Image
                        source={require('./assets/friendsbtn.png')}
                        style={styles.friends}
                    />  
                </TouchableOpacity>
                <TouchableOpacity>
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
        // paddingTop: 30
        // justifyContent: 'center',
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