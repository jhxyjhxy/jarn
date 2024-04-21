import React, { useEffect } from "react";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as SplashScreen from "expo-splash-screen";
import LoginScreen from "./LoginScreen";
import SignupScreen from "./Signup";
import HomeScreen from "./Home";
import { AuthProvider } from "./AuthContext";
import ECamera from "./ECamera";
import Signup from "./Signup";
import Preview from "./Preview";
import CommunityScreen from "./CommunityScreen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import HomeScreen from "./Home";


const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    const prepare = async () => {
      // keep splash screen visible
      await SplashScreen.preventAutoHideAsync();
      console.log("start splash");
      // pre-load your stuff
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("end splash");

      // hide splash screen
      await SplashScreen.hideAsync();
    };
    prepare();
  }, []);

  return (
    // <View style={styles.container}>
    //   <ECamera/>
    //   <StatusBar style="auto" />
    // </View>
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <NavigationContainer>
          <Stack.Navigator>
            {/* <Stack.Screen
              name="nature quest"
              component={Signup}
              options={styles.container}
            /> */}
            <Stack.Screen name="login" component={LoginScreen} />
            <Stack.Screen name="signup" component={SignupScreen} />
            <Stack.Screen name="home" component={HomeScreen} />
            <Stack.Screen name="community" component={CommunityScreen} />
            <Stack.Screen name="home" component={HomeScreen} />
            <Stack.Screen
              name="camera"
              component={ECamera}
              options={styles.container}
            />
            {/* <Stack.Screen name="Recap" component={Recap} options={styles.header} />
            <Stack.Screen name="Stats" component={Stats} options={styles.header} /> */}
          </Stack.Navigator>
        </NavigationContainer>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C5E99B',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
});