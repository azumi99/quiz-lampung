import React, { useEffect, useState } from 'react';
// import {HomeScreen} from '@screens/Home';
import { TabNav } from '@navigation/tabNav';
import { StackNavigation } from '@navigation/stackNav';
import {
  MessageStore,
  NotifStore,
  TokenFCMStore,
  TokenJwt,
  UserStore,
} from '@config/store';
import PushNotification from 'react-native-push-notification';
import { checkApplicationPermission } from '@config/firebase';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { LoginScreen } from '@screens/Login';
import { SplashScreen } from '@screens/splashScreen';
import { OnlineStatusUpdater } from '@config/statusOnline';
import { supabase } from '@config/supabase';
import { AppState } from 'react-native';

const NavigatorScreen = () => {
  const Stack = createStackNavigator();
  const { token } = TokenJwt();
  const { messageData, setMessageData } = MessageStore();
  const { setFcmtoken } = TokenFCMStore();
  const { setNotif } = NotifStore();
  const [appState, setAppState] = useState(AppState.currentState);
  const { user } = UserStore()
  const userId = user?.id;
  const RemoteNotification = () => {
    PushNotification.configure({
      onRegister: function (token) {
        setFcmtoken(token.token);
        console.log(token);
      },
      onNotification: function (notification) {
        const { message, title, id } = notification;
        let strTitle: string = JSON.stringify(title).split('"').join('');
        let strBody: string = JSON.stringify(message).split('"').join('');
        const key: string = JSON.stringify(id).split('"').join('');
        PushNotification.createChannel(
          {
            channelId: key,
            channelName: 'remote messasge',
            channelDescription: 'Notification for remote message',
            importance: 4,
            vibrate: true,
          },
          created => console.log(`createChannel returned '${created}'`),
        );
        PushNotification.localNotification({
          channelId: key,
          title: strTitle,
          message: strBody,
        });

        setNotif(id);
        console.log(
          'REMOTE NOTIFICATION ==>',
          title,
          message,
          id,
          notification,
        );
      },
      senderID: '1234567890',
      popInitialNotification: true,
      requestPermissions: true,
    });
  };
  useEffect(() => {
    checkApplicationPermission();
    RemoteNotification();
  }, []);

  const updateOnlineStatus = async (userId, isOnline) => {
    const { error } = await supabase
      .from('user_status')
      .upsert(
        {
          user_id: userId,
          is_online: isOnline,
          last_seen: new Date()
        },
        { onConflict: 'user_id' }
      );

    if (error) {
      console.log('Error updating online status:', error.message);
    }
  };

  useEffect(() => {

    updateOnlineStatus(userId, true);

    const handleAppStateChange = (nextAppState) => {
      if (appState.match(/active/) && nextAppState === 'background') {
        updateOnlineStatus(userId, false);
      } else if (nextAppState === 'active') {
        updateOnlineStatus(userId, true);
      }
      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      updateOnlineStatus(userId, false);
      subscription.remove();
    };
  }, [appState, userId]);
  console.log(user)
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TabNav"
          component={TabNav}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="StackNav"
          component={StackNavigation}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export { NavigatorScreen };
