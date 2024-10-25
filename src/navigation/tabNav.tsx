import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '@screens/Home';

import { ProfileScreen } from '@screens/Profile';
import { Center, Text, VStack, View } from '@gluestack-ui/themed';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { DarkModeStore, MessageStore, UserStore } from '@config/store';
import { BattleScreen } from '@screens/Battle';

const TabNav = () => {
  const Tab = createBottomTabNavigator();
  const { user } = UserStore();
  const { mode } = DarkModeStore();
  const size = 20;
  const iconHome = (color: string, focused: boolean) => (
    <VStack space="xs" style={{ justifyContent: 'center', alignItems: 'center' }}>
      <MaterialCommunityIcons
        size={focused ? 23 : size}
        color={color}
        name={focused ? 'home-minus' : 'home-minus-outline'}
      />
      <Text
        style={{
          textAlign: 'center',
          fontFamily: 'Poppins-Regular',
          fontSize: 10,
          color: focused ? '#387fdc' : mode ? 'white' : 'black',
        }}>
        Home
      </Text>
    </VStack>
  );

  const iconRequest = (color: string, focused: boolean) => (
    <VStack space="xs" style={{ justifyContent: 'center', alignItems: 'center' }}>
      <MaterialCommunityIcons
        size={focused ? 23 : size}
        color={color}
        name={focused ? 'file-document' : 'file-document-outline'}
      />
      <Text
        style={{
          textAlign: 'center',
          fontFamily: 'Poppins-Regular',
          fontSize: 10,
          color: focused ? '#387fdc' : mode ? 'white' : 'black',
        }}>
        Request
      </Text>
    </VStack>
  );

  const iconBattle = (color: string, focused: boolean) => (
    <VStack space="xs" style={{ justifyContent: 'center', alignItems: 'center' }}>
      <Ionicons
        size={focused ? 30 : 25}
        color={color}
        name={focused ? 'shield' : 'shield-half'}
      />
      <Text
        style={{
          textAlign: 'center',
          fontFamily: 'Poppins-Regular',
          fontSize: 10,
          color: focused ? '#387fdc' : mode ? 'white' : 'black',
        }}>
        Battle
      </Text>
    </VStack>
  );

  const iconAccount = (color: string, focused: boolean) => (
    <VStack space="xs" style={{ justifyContent: 'center', alignItems: 'center' }}>
      <Ionicons
        size={focused ? 24 : size}
        color={color}
        name={focused ? 'person' : 'person-outline'}
      />
      <Text
        style={{
          textAlign: 'center',
          fontFamily: 'Poppins-Regular',
          fontSize: 10,
          color: focused ? '#387fdc' : mode ? 'white' : 'black',
        }}>
        Profile
      </Text>
    </VStack>
  );
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarLabel: () => null,
        headerStyle: {
          backgroundColor: mode ? 'black' : 'white',
        },
        headerTitleStyle: {
          color: mode ? 'white' : 'black',
        },
        tabBarStyle: {
          height: 75,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: mode ? 'black' : 'white',
        },
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, focused }) => iconHome(color, focused),
        }}
      />
      <Tab.Screen
        name="Battle"
        component={BattleScreen}
        options={{
          tabBarIcon: ({ color, focused }) => iconBattle(color, focused),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, focused }) => iconAccount(color, focused),
        }}
      />
    </Tab.Navigator>
  );
};

export { TabNav };
