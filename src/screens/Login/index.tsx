import { InputDefault } from '@components/input/inputDefault';
import { InputPassword } from '@components/input/inputPassword';
import SafeAreaCustom from '@components/safeArea';
import { TextHeading } from '@components/textHeading';
import { TokenJwt, UserStore } from '@config/store';
import {
  Button,
  ButtonText,
  HStack,
  KeyboardAvoidingView,
  ScrollView,
  Spinner,
  Text,
  VStack,
  View,
} from '@gluestack-ui/themed';
import { useNavigation } from '@react-navigation/native';
import loginInterface from '@services/Login/interface';
import { loginService, userService } from '@services/Login/services';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const LoginScreen = () => {
  const navigation = useNavigation<any>();
  const { setToken } = TokenJwt();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [isValidPassword, setIsValidPassword] = useState(false);
  const [messageError, setMessageError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser } = UserStore();

  const validateEmail = () => {
    console.log('validateEmail 32');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = emailRegex.test(email);
    const isValidPassword = password.length > 5;
    password.length < 6 && setMessageError('');

    setIsValid(!isValidEmail);
    setIsValidPassword(!isValidPassword);
    !isValidEmail && !isValidPassword && setLoading(false);
    isValidEmail && isValidPassword && serviceLogin();
  };

  const handleState = () => {
    setShowPassword(showState => {
      return !showState;
    });
  };
  const fetchData = () => {
    setLoading(true);
    // setTimeout(() => {
    validateEmail();
    // }, 100);
  };
  const errorFunc = (message: string) => {
    console.log(message);
  };
  const userServiceFunc = async () => {
    try {
      const response = await userService(errorFunc);
      if (response?.status) {
        setUser(response.data);
      }
    } catch (error) {
      console.log('userServiceFunc error conection');
    }
  };
  const serviceLogin = async () => {
    try {
      const param: loginInterface = {
        email: email,
        password: password,
      };
      const result = await loginService(param, errorFunc);
      if (result?.access_token) {
        setToken(result?.access_token);
        userServiceFunc();
        setLoading(false);
        navigation.navigate('TabNav', { screen: 'Home' });
      } else if (result?.error) {
        setMessageError(result?.error);
        setIsValid(true);
        setIsValidPassword(true);
        setLoading(false);
      }
    } catch (error) {
      setMessageError('error conection login');
      setIsValid(true);
      setIsValidPassword(true);
      setLoading(false);
      console.log('serviceLogin error conection', error);
    }
  };
  // useEffect(() => {

  // }, []);
  // console.log('error mess', messageError);
  return (
    <SafeAreaCustom>
      <KeyboardAvoidingView behavior="padding" flex={1}>
        <ScrollView
          flex={1}
          contentContainerStyle={{ flex: 1, justifyContent: 'center' }}>
          <View>
            <VStack space="xl" paddingHorizontal={16}>
              <VStack mb={40}>
                <HStack space="sm">
                  <TextHeading size="3xl" style={{ color: '#eab308' }}>
                    Quizz
                  </TextHeading>
                  <TextHeading size="3xl">Login</TextHeading>
                </HStack>
                <Text>Welcome back, Sign in to your account</Text>
              </VStack>
              <InputDefault
                size="xl"
                label={'Email'}
                changeText={value => {
                  setEmail(value);
                }}
                placeHolder="e.g Olivia@gmail.com"
                borderColor="#ECEFF3"
                value={email}
                fieldInput="email-address"
                messageError={messageError}
                isValid={isValid}
              />
              <InputPassword
                size="xl"
                isValid={isValidPassword}
                messageError={messageError}
                label={'Password'}
                show={showPassword}
                handle={handleState}
                value={password}
                borderColor="#ECEFF3"
                iconColor="#C1C7D0"
                onChange={value => setPassword(value)}
              />

              <Button
                size="xl"
                variant="solid"
                action="primary"
                borderRadius={20}
                h={55}
                isDisabled={loading}
                mt={20}
                onPress={() => {
                  fetchData();
                  console.log('buttonLogin 115');
                }}>
                {loading ? (
                  <HStack>
                    <Text color="white">Login </Text>
                    <Spinner size="small" color={'white'} />
                  </HStack>
                ) : (
                  <ButtonText>Login</ButtonText>
                )}
              </Button>
            </VStack>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaCustom>
  );
};

export { LoginScreen };
