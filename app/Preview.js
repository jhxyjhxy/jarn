import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import { useRoute } from '@react-navigation/native';

export default function App({route}) {
    const { photoUri } = route.params;
    console.log('photo: ' + photoUri);

    return (
        <View style={styles.container}>
            <Image style={styles.img} source={{ uri: photoUri }} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#C5E99B',
    },
    img: {
        width: 400,
        height: 400,
    },
});