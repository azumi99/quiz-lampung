import React, { useRef, useEffect, useState } from "react";
import SafeAreaCustom from "@components/safeArea";
import { TextHeading } from "@components/textHeading";
import { Actionsheet, ActionsheetBackdrop, ActionsheetContent, ActionsheetDragIndicator, ActionsheetDragIndicatorWrapper, ActionsheetIcon, ActionsheetItem, ActionsheetItemText, ActionsheetScrollView, Avatar, AvatarFallbackText, AvatarImage, Box, Button, ButtonText, Checkbox, CheckboxIcon, CheckboxIndicator, CheckIcon, Heading, HStack, Spinner, Text, View, VStack } from "@gluestack-ui/themed";
import { Animated, Easing, ToastAndroid, TouchableOpacity } from "react-native";
import { UserStore } from "@config/store";
import { ActionEdit } from "@components/actionRequest";
import { getUser, getUserId } from "@services/User";
import userInterface from "@services/User/interface";
import { baseURL } from "@config/intance";
import { IconCustom } from "@components/iconCustom";
import Ionicons from "react-native-vector-icons/Ionicons"
import { supabase } from "@config/supabase";
import { FCMSend, SendNotif } from "@services/Notifications";
import { useNavigation } from "@react-navigation/native";


const StarterScreen = ({ route }) => {
    const navigation = useNavigation<any>();
    const vsScale = useRef(new Animated.Value(1)).current;
    const avatarOpacity = useRef(new Animated.Value(0)).current;
    const buttonScale = useRef(new Animated.Value(1)).current;
    const { user } = UserStore();
    const [showActionsheet, setShowActionsheet] = React.useState(false)
    const handleClose = () => setShowActionsheet(!showActionsheet)
    const [dataUser, setDataUser] = useState<userInterface[]>([])
    const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
    const [anemy, setAnemy] = useState<any>(null);
    const [my, setMy] = useState<any>(null);
    const [status, setStatus] = useState<any>([])
    const [loadAnemy, setLoadAnemy] = useState<boolean>(false)

    console.log('route', route.params.idbattle);

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(vsScale, {
                    toValue: 1.2,
                    duration: 500,
                    easing: Easing.bounce,
                    useNativeDriver: true,
                }),
                Animated.timing(vsScale, {
                    toValue: 1,
                    duration: 500,
                    easing: Easing.bounce,
                    useNativeDriver: true,
                }),
            ])
        ).start();

        Animated.timing(avatarOpacity, {
            toValue: 1,
            duration: 1000,
            easing: Easing.ease,
            useNativeDriver: true,
        }).start();

        Animated.loop(
            Animated.sequence([
                Animated.timing(buttonScale, {
                    toValue: 1.1,
                    duration: 700,
                    easing: Easing.ease,
                    useNativeDriver: true,
                }),
                Animated.timing(buttonScale, {
                    toValue: 1,
                    duration: 700,
                    easing: Easing.ease,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);



    useEffect(() => {
        const FetchUser = async () => {
            try {
                const response = await getUser();
                if (response.status) {
                    setDataUser(response.data);
                }
            } catch (error) {
                console.log('error fetch user');
            }
        }

        FetchUser()
    }, [])
    const errorFunc = () => {
        console.log('error')
    }

    const FetchUserID = async (id) => {
        console.log('id', id[0])
        try {
            const response_1 = await getUserId(errorFunc, id[0]);
            if (response_1.status) {
                setMy(response_1.data)
            }
            const response_2 = await getUserId(errorFunc, id[1]);
            if (response_2.status) {
                setAnemy(response_2.data)
                setLoadAnemy(false);
            }
        } catch (error) {
            console.log('error fetch user id');
        }
    }


    useEffect(() => {
        const fetchOnline = async () => {
            try {
                const { data, error, status } = await supabase
                    .from('user_status')
                    .select('*');

                if (status === 200) {
                    setStatus(data);
                }
            } catch (error) {
                console.error('Error fetching online status:', error);
            }
        };
        fetchOnline();

        const channel = supabase
            .channel('public:user_status')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'user_status' }, (payload) => {
                console.log('Change received!', payload);
                fetchOnline();
            })
            .subscribe();


        return () => {
            supabase.removeChannel(channel);
        };
    }, []);



    const toggleMemberSelection = (id: number, isChecked: boolean) => {
        console.log('id', id)
        setLoadAnemy(true);

        setSelectedMembers(prevSelectedMembers => {
            if (isChecked) {
                return [...prevSelectedMembers, id];
            } else {
                return prevSelectedMembers.filter(memberId => memberId !== id);
            }
        });
        handleClose()
        const SendNotifService = async () => {
            const param: FCMSend = {
                id_user: id,
                title: `Undangan Battle ${user?.name}`,
                body: `Kamu di undang battle gabung sekarang`,
                id_battle: route.params.idbattle,
                invite: 1
            }
            try {
                const response = await SendNotif(errorFunc, param)
                if (response?.status) {
                    return response;
                }
            } catch (error) {
                console.log('error func SendNotifService')
            }
        }
        SendNotifService()
    };
    console.log('item', anemy);

    useEffect(() => {
        const getBattleData = async () => {
            try {
                const { data, status } = await supabase
                    .from('battle')
                    .select('*')
                    .eq('id', route.params.idbattle)
                    .single();

                if (status == 200) {
                    console.log('update', data)
                    FetchUserID([data.id_user_1, data.id_user_2])
                }
            } catch (error) {
                console.log('error get data battle')
            }
        }

        getBattleData();
        const subscription = supabase
            .channel('public:battle')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'battle', filter: `id=eq.${route.params.idbattle}` },
                (payload) => {
                    console.log('New record inserted:', payload);
                    getBattleData();
                }
            )
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'battle', filter: `id=eq.${route.params.idbattle}` },
                (payload) => {
                    console.log('Battle updated:', payload);
                    getBattleData();
                }
            )
            .on(
                'postgres_changes',
                { event: 'DELETE', schema: 'public', table: 'battle', filter: `id=eq.${route.params.idbattle}` },
                (payload) => {
                    console.log('Battle deleted:', payload);
                    getBattleData();
                    navigation.navigate('TabNav', { screen: 'Battle' });
                }
            )
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };

    }, [route.params.idbattle])


    return (
        <SafeAreaCustom>
            <View flex={1} marginHorizontal={16} alignItems="center" justifyContent="center">
                <VStack alignItems="center" space="4xl">
                    <VStack alignItems="center">
                        <TextHeading style={{ color: '#ca8a04' }}><TextHeading>Battle</TextHeading> Quizz Lampung</TextHeading>
                        <Text>Undang teman untuk battle</Text>
                    </VStack>
                    <HStack alignItems="center" space="4xl">
                        <Animated.View style={{ opacity: avatarOpacity, width: '43%' }}>
                            <VStack alignItems="center" space="xs" >
                                <Avatar bgColor="$amber600" size="md" borderRadius="$full">
                                    <AvatarFallbackText>{my?.name}</AvatarFallbackText>
                                </Avatar>
                                {user?.id == my?.id ? <TextHeading size="sm">{my?.name}</TextHeading> : <Text size="sm">{my?.name}</Text>}
                            </VStack>
                        </Animated.View>
                        <Animated.Text style={{ transform: [{ scale: vsScale }] }}>
                            <TextHeading>VS</TextHeading>
                        </Animated.Text>
                        <Animated.View style={{ opacity: avatarOpacity, width: '43%' }}>
                            <VStack alignItems="center" space="xs" >
                                <TouchableOpacity onPress={handleClose}>
                                    <Avatar bgColor="$indigo600" size="md" borderRadius="$full">
                                        {loadAnemy ? <Spinner size="small" color={'white'} /> : <AvatarFallbackText>{anemy != null ? anemy.name : '+'}</AvatarFallbackText>}
                                    </Avatar>
                                </TouchableOpacity>
                                {loadAnemy ? <Text size="sm">Waiting</Text> : user?.id == anemy?.id ? <TextHeading size="sm">{anemy != null ? anemy.name : ''}</TextHeading> : <Text size="sm">{anemy != null ? anemy.name : ''}</Text>}
                            </VStack>
                        </Animated.View>
                    </HStack>
                    <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                        <Button action="negative" onPress={() => navigation.navigate('StackNav', {
                            screen: 'BattleRoom', params: {
                                name: `${my?.name} vs ${anemy?.name}`,
                                code_soal: 4,
                            },
                        })} borderRadius={10} mt={20}>
                            <ButtonText>Mulai</ButtonText>
                        </Button>
                    </Animated.View>
                </VStack>
                <Box>
                    <Actionsheet isOpen={showActionsheet} onClose={handleClose} zIndex={999}>
                        <ActionsheetBackdrop />
                        <ActionsheetContent h="$72" zIndex={999}>
                            <ActionsheetDragIndicatorWrapper>
                                <ActionsheetDragIndicator />
                            </ActionsheetDragIndicatorWrapper>
                            <ActionsheetScrollView h={'90%'} >
                                <HStack alignSelf="center">
                                    <TouchableOpacity onPress={() => { setSelectedMembers([]); setAnemy(null); setLoadAnemy(false); }}>
                                        <View bgColor="$yellow500" padding={7} borderRadius={50} mt={10} >
                                            <IconCustom As={Ionicons} name={'repeat'} size={16} />
                                        </View>
                                    </TouchableOpacity>
                                </HStack>
                                {dataUser.length > 0 ?
                                    dataUser.map((value, index) => (
                                        <ActionsheetItem
                                            key={index}
                                            justifyContent="space-between">
                                            <HStack space="md">
                                                <ActionsheetIcon>
                                                    <Avatar
                                                        bgColor={'$amber600'}
                                                        size="xs"
                                                        borderRadius="$full">
                                                        <AvatarFallbackText>
                                                            {value.name}
                                                        </AvatarFallbackText>
                                                        {(value.url?.length as number) > 0 && (
                                                            <AvatarImage
                                                                alt={value?.name}
                                                                source={{
                                                                    uri: `${baseURL}${value.url}`,
                                                                }}
                                                            />
                                                        )}
                                                    </Avatar>
                                                </ActionsheetIcon>
                                                <HStack alignItems="center">
                                                    <ActionsheetItemText>
                                                        {value.name}
                                                    </ActionsheetItemText>
                                                    {status.some(item => item.user_id === value.id && item.is_online) ? (
                                                        <Text color="green" size="xs">
                                                            online
                                                        </Text>
                                                    ) : (
                                                        <Text color="$secondary400" size="xs">
                                                            offline
                                                        </Text>
                                                    )}

                                                </HStack>

                                            </HStack>
                                            <Checkbox
                                                size="md"
                                                isChecked={selectedMembers.includes(
                                                    value?.id as number,
                                                )}
                                                onChange={isChecked => {
                                                    toggleMemberSelection(
                                                        value.id as number,
                                                        isChecked,
                                                    );
                                                }}
                                                isDisabled={selectedMembers.length > 0 || value.id == user?.id}
                                                value={value?.name as string}
                                                aria-label={value.name}>
                                                <CheckboxIndicator mr="$2">
                                                    <CheckboxIcon as={CheckIcon} />
                                                </CheckboxIndicator>
                                            </Checkbox>
                                        </ActionsheetItem>
                                    )) :
                                    <View justifyContent="center" alignItems="center" mt={30}>
                                        <Spinner size="small" />
                                    </View>
                                }


                            </ActionsheetScrollView>

                        </ActionsheetContent>
                    </Actionsheet>
                </Box>
            </View>
        </SafeAreaCustom>
    );
};

export { StarterScreen };
