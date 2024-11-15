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
  UserStore,
  navigateIdRequestStore,
} from '@config/store';

import { Text } from '@gluestack-ui/themed';
import { DetailScreen } from '@screens/Details';
import { QuizScreen } from '@screens/Quiz';
import { FinishScreen } from '@screens/Finish';
import { ChangePasswordScreen } from '@screens/Profile/ChangePassword';
import { EditProfileScreen } from '@screens/Profile/EditProfile';
import { InvitationNotif } from '@screens/Battle/Invitation';
import { StarterScreen } from '@screens/Battle/Starter';
import { supabase } from '@config/supabase';
import { ShowToast } from '@components/toast';
import { BattleRoom } from '@screens/Battle/BattleRoom';
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
  const { user } = UserStore()
  const DeleteRoom = async () => {
    try {
      const { data, error, status } = await supabase
        .from('battle')
        .delete()
        .eq('id', route.params.params.idbattle)
        .eq('status', true);

      if (error) {
        ShowToast('Fail cancel room')
        console.log('error delete room', error)
      }
      console.log('status', status)
      if (status == 204) {
        ShowToast('Room battle cancel')
        return data;
      }
    } catch (error) {
      ShowToast('Fail cancel room')
      console.log('error delete room', error)
    }
  };
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
        name="EditProfileScreen"
        component={EditProfileScreen}
        options={{
          title: 'Edit Profile',
          headerBackVisible: false,
          headerShown: true,
          headerTitleAlign: 'center',
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text>Cancel</Text>
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => setParam(true)}>
              <Text>Save</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="ChangePasswordScreen"
        component={ChangePasswordScreen}
        options={{
          title: 'Change Password',
          headerBackVisible: false,
          headerShown: true,
          headerTitleAlign: 'center',
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text>Cancel</Text>
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => setChange(true)}>
              <Text>Save</Text>
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
        name="BattleRoom"
        component={BattleRoom}
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
      <Stack.Screen
        name="InvitationNotif"
        component={InvitationNotif}
        options={{
          title: route.params.title,
          headerBackVisible: true,
          headerShown: true,
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
        }}
      />
      <Stack.Screen
        name="StarterScreen"
        component={StarterScreen}
        options={{
          title: '1 vs 1',
          headerBackVisible: false,
          headerShown: true,
          headerTitleAlign: 'center',

          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                DeleteRoom();
                navigation.goBack();
              }}>
              <Text>Cancel</Text>
            </TouchableOpacity>
          ),
        }}
      />

    </Stack.Navigator>
  );
};
