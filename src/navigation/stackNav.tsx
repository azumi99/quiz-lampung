import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation, useRoute } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { IconCustom } from '@components/iconCustom';
import {
  ActionEditStore,
  AddAccountStore,
  ChangePasswordStore,
  DarkModeStore,
  EditProfileStore,
  MessageStore,
  NotifStore,
  navigateIdRequestStore,
} from '@config/store';

import { Text } from '@gluestack-ui/themed';
import { DetailScreen } from '@screens/Details';
import { QuizScreen } from '@screens/Quiz';
import { FinishScreen } from '@screens/Finish';
const Stack = createNativeStackNavigator();
export const StackNavigation = ({ route }) => {
  const navigation = useNavigation<any>();
  const dataRoute = useRoute<any>();
  const { edit, setEdit } = ActionEditStore();
  const { setParam } = EditProfileStore();
  const { setChange } = ChangePasswordStore();
  const { setIdNav } = navigateIdRequestStore();
  const { mode } = DarkModeStore();
  const { setAdd } = AddAccountStore();
  const { setMessageData } = MessageStore();
  const { setNotif } = NotifStore();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: mode ? 'black' : 'white',
        },
        headerTitleStyle: {
          color: mode ? 'white' : 'black',
        },
      }}>
      <Stack.Screen
        name="DetailsRequest"
        component={DetailScreen}
        options={{
          title: 'Request Detail',
          headerBackVisible: false,
          headerShown: false,
          headerTitleAlign: 'center',

          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                setIdNav(0);
                navigation.goBack();
              }}>
              <IconCustom As={Ionicons} name="chevron-back" size={20} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => setEdit(!edit)}>
              <IconCustom As={Ionicons} name="ellipsis-vertical" size={20} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="QuizScreen"
        component={QuizScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="FinishScreen"
        component={FinishScreen}
        options={{
          headerShown: false,
        }}
      />

    </Stack.Navigator>
  );
};
