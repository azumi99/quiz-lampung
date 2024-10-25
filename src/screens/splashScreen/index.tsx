import { DarkModeStore, TokenJwt } from '@config/store';
import {
  HStack,
  Progress,
  ProgressFilledTrack,
  Text,
  VStack,
  View,
} from '@gluestack-ui/themed';
import { useNavigation } from '@react-navigation/native';
import { checkLogin } from '@services/Login/services';
import React, { useState, useEffect, useRef } from 'react';
import { Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SplashScreen = () => {
  const navigation = useNavigation<any>();
  const [counter, setCounter] = useState(0);
  const [cek, setCek] = useState<boolean>();
  const { mode } = DarkModeStore();
  const { token } = TokenJwt();
  const errorFunc = (message: string) => {
    console.log(message);
  };
  console.log('cek', cek);
  useEffect(() => {
    const loginCek = async () => {
      try {
        const result = await checkLogin(errorFunc);
        setCek(result);
      } catch (error) {
        console.log('loginCheck error conection');
      }
    };
    loginCek();

    const interval = setInterval(() => {
      if (counter < 100) {
        if (counter === 50) {
          setTimeout(() => {
            setCounter(prevCounter => prevCounter + 1);
          }, 700);
        } else {
          setCounter(prevCounter => prevCounter + 1);
        }
      }
    }, 10);

    if (counter === 100 && !cek) {
      token === ''
        ? navigation.replace('LoginScreen')
        : navigation.replace('TabNav', { screen: 'Home' });
    } else if (counter === 100 && cek) {
      navigation.replace('TabNav', { screen: 'Home' });
    }

    return () => clearInterval(interval);
  }, [counter]);

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
      <View>
        <VStack alignSelf="center" space="4xl">
          <HStack alignItems="center" justifyContent="center">
            {/* <Image
              style={{ width: 50, height: 50, alignSelf: 'center' }}
              source={require('../../../assets/logo/logo_company.png')}
            /> */}
            <Text fontSize={30} color={'#ca8a04'} bold>
              Quizz
            </Text>
          </HStack>
          <Progress value={counter} w={300} h="$2" size="md">
            <ProgressFilledTrack h="$2" />
          </Progress>
        </VStack>
      </View>
    </SafeAreaView>
  );
};

export { SplashScreen };
