import * as Notifications from 'expo-notifications';
async function registerForPushNotificationsAsync() {
    let token;

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }
    //console.log("hi");
    if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
    }
    
    token = (await Notifications.getExpoPushTokenAsync({projectId:1})).data;
    console.log("pp");
    console.log(token);

    return token;
}

export default registerForPushNotificationsAsync;
