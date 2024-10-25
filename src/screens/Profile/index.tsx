import React, { useEffect } from 'react';
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Center,
  HStack,
  ScrollView,
  Switch,
  Text,
  VStack,
  View,
} from '@gluestack-ui/themed';
import SafeAreaCustom from '@components/safeArea';
import { TextHeading } from '@components/textHeading';
import { IconCustom } from '@components/iconCustom';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DarkModeStore, TokenJwt, UserData, UserStore } from '@config/store';
import { logoutService } from '@services/Login/services';
import { baseURL } from '@config/intance';
import Snackbar from 'react-native-snackbar';

const ProfileScreen = () => {
  const navigation = useNavigation<any>();
  const { mode, setMode } = DarkModeStore();
  const { token, setToken } = TokenJwt();
  const { user, setUser } = UserStore();
  // console.log('token', user);
  const errorFunc = (message: string) => {
    console.log(message);
  };

  const LogoutFunc = async () => {
    const param: UserData = {
      id: 0,
      name: '',
      email: '',
      role: '',
      url: '',
    };
    try {
      const response = await logoutService(errorFunc);
      if (response?.status) {
        setToken('');
        setUser(param);
        navigation.replace('LoginScreen');
      }
    } catch (error) {
      if (token !== '') {
        setToken('');
        setUser(param);
        navigation.replace('LoginScreen');
      }
      console.log('LogoutFunc error conection');
    }
  };
  const handleMode = () => {
    setMode(!mode);
    Snackbar.show({
      text: !mode ? 'Dark Mode' : 'Light Mode',
      backgroundColor: '#348352',
      duration: 1500,
    });
  };

  useEffect(() => {
    user?.url;
  }, [user?.url]);

  return (
    <SafeAreaCustom>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View paddingHorizontal={16} mb={30}>
          <VStack>
            <VStack alignItems="center" mt={50} space="lg">
              <Avatar bgColor="$amber600" size="xl" borderRadius="$full">
                <AvatarFallbackText>{user?.name}</AvatarFallbackText>
                <AvatarImage
                  alt={user?.name}
                  source={{
                    uri: `${baseURL}${user?.url}`,
                  }}
                />
              </Avatar>
              <VStack alignItems="center" space="xs">
                <TextHeading size="lg">{user?.name}</TextHeading>
                <Text>{user?.email}</Text>
              </VStack>
            </VStack>
            <View
              bgColor={mode ? '#171717' : '#F6F8FA'}
              padding={16}
              borderRadius={10}
              mt={40}>
              <TextHeading style={{ marginBottom: 20 }}>General</TextHeading>
              <VStack space="3xl">
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('StackNav', {
                      screen: 'EditProfileScreen',
                    })
                  }>
                  <HStack justifyContent="space-between" alignItems="center">
                    <HStack alignItems="center" space="md">
                      <View
                        padding={10}
                        borderRadius={'$full'}
                        bgColor="$yellow500">
                        <MaterialIcons
                          size={25}
                          name={'mode-edit-outline'}
                          color="white"
                        />
                      </View>
                      <TextHeading>Edit Profile</TextHeading>
                    </HStack>
                    <IconCustom
                      As={MaterialIcons}
                      name="chevron-right"
                      size={25}
                    />
                  </HStack>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('StackNav', {
                      screen: 'ChangePasswordScreen',
                    })
                  }>
                  <HStack justifyContent="space-between" alignItems="center">
                    <HStack alignItems="center" space="md">
                      <View
                        padding={10}
                        borderRadius={'$full'}
                        bgColor="$yellow500">
                        <MaterialIcons
                          size={25}
                          name={'lock-reset'}
                          color="white"
                        />
                      </View>
                      <TextHeading>Change Password</TextHeading>
                    </HStack>
                    <IconCustom
                      As={MaterialIcons}
                      name="chevron-right"
                      size={25}
                    />
                  </HStack>
                </TouchableOpacity>
                <TouchableOpacity>
                  <HStack justifyContent="space-between" alignItems="center">
                    <HStack alignItems="center" space="md">
                      <View
                        padding={10}
                        borderRadius={'$full'}
                        bgColor="$yellow500">
                        <MaterialIcons
                          size={25}
                          name={'light-mode'}
                          color="white"
                        />
                      </View>
                      <TextHeading>Theme</TextHeading>
                    </HStack>

                    <Switch size="md" value={mode} onToggle={handleMode} />
                  </HStack>
                </TouchableOpacity>
              </VStack>
            </View>
            <View
              bgColor={mode ? '#171717' : '#F6F8FA'}
              padding={16}
              borderRadius={10}
              mt={20}>
              <TextHeading style={{ marginBottom: 20 }}>Settings</TextHeading>
              <VStack space="3xl">
                {user?.role === 'superadmin' && (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('StackNav', { screen: 'ManageUser' })
                    }>
                    <HStack justifyContent="space-between" alignItems="center">
                      <HStack alignItems="center" space="md">
                        <View
                          padding={10}
                          borderRadius={'$full'}
                          bgColor="$yellow500">
                          <MaterialIcons
                            size={25}
                            name={'person'}
                            color="white"
                          />
                        </View>
                        <TextHeading>Manage User</TextHeading>
                      </HStack>
                      <IconCustom
                        As={MaterialIcons}
                        name="chevron-right"
                        size={25}
                      />
                    </HStack>
                  </TouchableOpacity>
                )}

                <TouchableOpacity onPress={LogoutFunc}>
                  <HStack justifyContent="space-between" alignItems="center">
                    <HStack alignItems="center" space="md">
                      <View
                        padding={10}
                        borderRadius={'$full'}
                        bgColor="$yellow500">
                        <MaterialIcons
                          size={25}
                          name={'logout'}
                          color="white"
                        />
                      </View>
                      <TextHeading>Logout</TextHeading>
                    </HStack>
                    <IconCustom
                      As={MaterialIcons}
                      name="chevron-right"
                      size={25}
                    />
                  </HStack>
                </TouchableOpacity>
              </VStack>
            </View>
          </VStack>
        </View>
      </ScrollView>
    </SafeAreaCustom>
  );
};

export { ProfileScreen };
