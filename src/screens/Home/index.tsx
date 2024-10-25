import React, { useEffect, useState } from 'react';
import {
  Avatar,
  AvatarImage,
  Box,
  Button,
  ButtonText,
  Heading,
  HStack,
  Text,
  View,
  VStack,
  FlatList,
  AvatarFallbackText,
  Card,
  ScrollView,
} from '@gluestack-ui/themed';
import SafeAreaCustom from '@components/safeArea';
import {
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {
  DarkModeStore,
  TemaStore,
  TokenFCMStore,
  UserStore,
  navigateIdRequestStore,
  temaData,
} from '@config/store';
import { supabase } from '@config/supabase';
import { IconCustom } from '@components/iconCustom';
import { TextHeading } from '@components/textHeading';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { baseURL } from '@config/intance';

const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const [prefix, setPrefix] = useState('Month');
  const { width, height } = Dimensions.get('window');
  const { setIdNav } = navigateIdRequestStore();
  const { mode } = DarkModeStore();
  const { fcmtoken } = TokenFCMStore();
  const [maxBoxHeight, setMaxBoxHeight] = useState<number>(0);
  const { user } = UserStore();

  const { tema, setTema } = TemaStore();
  console.log('tem', tema)

  useEffect(() => {
    const FetchTema = async () => {
      try {
        const response = await supabase
          .from('tema')
          .select('*');
        console.log('tema', response)
        response.status == 200 && setTema(response?.data);
      } catch (error) {
        console.log('Error fetching users');
      }
    };

    FetchTema();

    const subscription = supabase
      .channel('public:tema')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'tema' },
        (payload) => {
          console.log('New record added:', payload);
          setTema((prevTema: any) => [...prevTema, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);



  return (
    <SafeAreaCustom>
      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        <View flex={1} paddingHorizontal={16} mt={20} mb={20}>
          <VStack space='xl'>
            <HStack justifyContent="space-between" alignItems="center">
              <VStack>
                <TextHeading style={{ color: '#ca8a04' }}>Quizz <TextHeading>Lampung</TextHeading></TextHeading>
                <Text>Hi, {user?.name}</Text>
              </VStack>
              <HStack >
                <Avatar bgColor="$amber600" size="md" borderRadius="$full">
                  <AvatarFallbackText>{user?.name}</AvatarFallbackText>
                  <AvatarImage
                    alt={user?.name}
                    source={{
                      uri: `${baseURL}${user?.url}`,
                    }}
                  />
                </Avatar>
              </HStack>
            </HStack>
            <VStack>
              <HStack justifyContent='space-between'>
                <Card size="md" variant="elevated" width={'48%'} bgColor='$purple500' >
                  <Heading mb="$1" size="md" color='white'>
                    10
                  </Heading>
                  <Text size="sm" color='white'>Quizz Ranking</Text>
                  <HStack mt={20}>
                    <TouchableOpacity style={{ backgroundColor: '#c084fc', paddingHorizontal: 16, paddingVertical: 3, borderRadius: 6 }}>
                      <Text color='white' size='sm'>Mainkan</Text>
                    </TouchableOpacity>
                  </HStack>
                </Card>
                <Card size="md" variant="elevated" width={'48%'} bgColor='$yellow400' >
                  <Heading mb="$1" size="md">
                    2,450
                  </Heading>
                  <Text size="sm">Total poin</Text>
                  <Heading size='sm'>7 / 25</Heading>
                  <Text size="sm">Terselesaikan</Text>
                </Card>
              </HStack>
            </VStack>
            <VStack space='md'>
              <TextHeading>
                Battle Quizz
              </TextHeading>
              <Card size="md" variant="elevated" bgColor='$red400' >
                <Heading mb="$1" size="md" color='white'>
                  Battle Quizz
                </Heading>
                <Text size="sm" color='white'>Invite teman kamu dan mainkan Quizz seputar Lampung bersama</Text>
                <HStack mt={16}>
                  <TouchableOpacity style={{ backgroundColor: '#fca5a5', paddingHorizontal: 16, paddingVertical: 3, borderRadius: 6 }}>
                    <Text color='white' size='sm'>Mainkan</Text>
                  </TouchableOpacity>
                </HStack>
              </Card>
            </VStack>
            <VStack space='md'>
              <TextHeading>
                Quizz
              </TextHeading>
              {tema.map((value, index) => (
                <TouchableOpacity key={index} onPress={() => navigation.navigate('StackNav', { screen: 'QuizScreen', params: { name: value?.nama_tema, code_soal: value?.id } })}>
                  <Card size="md" variant="filled" >
                    <HStack alignItems='center' space='xl'>
                      <IconCustom As={FontAwesome6} name={value?.icon_name} size={25} />
                      <VStack>
                        <Heading mb="$1" size="md" color='$yellow600' >
                          {value?.nama_tema}
                        </Heading>
                        <Text size="sm" >{value?.deskripsi}</Text>
                      </VStack>
                    </HStack>
                  </Card>
                </TouchableOpacity>
              ))}


            </VStack>
          </VStack>
        </View>
      </ScrollView>
    </SafeAreaCustom>
  );
};

export { HomeScreen };
