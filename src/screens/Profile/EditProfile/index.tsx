import { InputDefault } from '@components/input/inputDefault';
import SafeAreaCustom from '@components/safeArea';
import { TextHeading } from '@components/textHeading';
import { baseURL } from '@config/intance';
import { EditProfileStore, UserStore } from '@config/store';
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  ScrollView,
  Text,
  VStack,
  View,
} from '@gluestack-ui/themed';
import { useNavigation } from '@react-navigation/native';
import { updateUser } from '@services/User';
import userInterface from '@services/User/interface';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import Snackbar from 'react-native-snackbar';
import { err } from 'react-native-svg/lib/typescript/xml';

const EditProfileScreen = () => {
  const navigation = useNavigation<any>();
  const { user, setUser } = UserStore();
  const [name, setName] = useState(user?.name);
  const [email, setEmail] = useState(user?.email);
  const [role, setRole] = useState(user?.role);
  const [url, setUrl] = useState(user?.url as string);
  const [avatarKey, setAvatarKey] = useState(Date.now());
  const { param, setParam } = EditProfileStore();
  const ChoseImage = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        includeBase64: true,
      });
      if (!result.didCancel && result.assets && result.assets.length > 0) {
        setUrl(`data:image/png;base64,${result.assets[0].base64}` as string);
        setAvatarKey(Date.now());
      }
    } catch (error) {
      console.log('error image', error);
    }
  };
  const errorFunc = (message: string) => {
    console.log(message);
  };
  const updateProfileFunc = async () => {
    const id = user?.id;
    const params: userInterface = {
      url: url,
      email: email,
      name: name,
      role: role,
    };
    try {
      const response = await updateUser(errorFunc, id, params);
      if (response?.status) {
        setUser(response?.data);
        setParam(false);
        Snackbar.show({
          text: 'Profile Updated Succesfull',
          backgroundColor: '#348352',
          duration: 1500,
        });
        navigation.goBack();
      }
    } catch (error) {
      console.log('updateProfileFunc error conection', error);
      setParam(false);
      if (axios.isAxiosError(error) && error?.response) {
        const response = error.response.data;
        const errorMessages = [
          response.email?.[0],
          response.name?.[0],
          response.role?.[0],
          response.url?.[0],
        ].filter(Boolean);
        const combinedMessage = errorMessages.join('\n');
        Snackbar.show({
          text: combinedMessage,
          backgroundColor: '#f43f5e',
          duration: 2000,
        });
      } else {
        console.error('An unexpected error occurred', error);
      }
    }
  };
  console.log(url);
  useEffect(() => {
    // setUrl(user?.url as string);
    param && updateProfileFunc();
  }, [param]);
  return (
    <SafeAreaCustom>
      <ScrollView>
        <View paddingHorizontal={16}>
          <VStack space="md">
            <VStack alignItems="center" mt={50} space="lg">
              <Avatar bgColor="$amber600" size="xl" borderRadius="$full">
                <AvatarFallbackText>{user?.name}</AvatarFallbackText>
                <AvatarImage
                  alt={user?.name}
                  key={avatarKey}
                  source={{
                    uri: url?.startsWith('data:image') ? url : baseURL + url,
                  }}
                />
              </Avatar>
              <TouchableOpacity
                onPress={ChoseImage}
                style={{
                  padding: 7,
                  borderRadius: 50,
                  backgroundColor: '#f59e0b',
                }}>
                <Text color="white" size="xs" textAlign="center">
                  Change Image
                </Text>
              </TouchableOpacity>
            </VStack>
            <VStack space="xl" padding={40}>
              <InputDefault
                label="Name"
                variant="underlined"
                defaultValue={user?.name}
                changeText={value => setName(value)}
              />
              <InputDefault
                label="Email"
                variant="underlined"
                defaultValue={user?.email}
                changeText={value => setEmail(value)}
              />
              {/* <InputDefault
                isDisabled
                label="Role"
                variant="underlined"
                defaultValue={user?.role}
                changeText={value => setRole(value)}
              /> */}
            </VStack>
          </VStack>
        </View>
      </ScrollView>
    </SafeAreaCustom>
  );
};

export { EditProfileScreen };
