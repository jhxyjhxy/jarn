import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useState, useEffect } from 'react';
import { Image } from 'expo-image';

export default function App() {
    return (
        <View style={styles.container}>
            <View>  
                <Image
                    source={require('./assets/naturequesttitle.png')} 
                    style={{width: 486, height:409}}
                /> 
            </View>
            <View>
                <TouchableOpacity>
                    <Image
                        source={require('./assets/challengebtn.png')}
                        style={styles.button}
                    />  
                </TouchableOpacity>
                <TouchableOpacity>
                    <Image
                        source={require('./assets/friendsbtn.png')}
                        style={{width: 200, height:45}}
                    />  
                </TouchableOpacity>
                <TouchableOpacity>
                    <Image
                        source={require('./assets/settingsbtn.png')}
                        style={styles.button}
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
        paddingTop: 30
        // justifyContent: 'center',
      },
    button: {
        width: 200, height:50
    },
});