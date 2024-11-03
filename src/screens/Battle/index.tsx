import React, { useRef, useEffect, useState } from "react";
import SafeAreaCustom from "@components/safeArea";
import { TextHeading } from "@components/textHeading";
import { Actionsheet, ActionsheetBackdrop, ActionsheetContent, ActionsheetDragIndicator, ActionsheetDragIndicatorWrapper, ActionsheetIcon, ActionsheetItem, ActionsheetItemText, ActionsheetScrollView, Avatar, AvatarFallbackText, AvatarImage, Box, Button, ButtonText, Checkbox, CheckboxIcon, CheckboxIndicator, CheckIcon, Heading, HStack, Spinner, Text, View, VStack } from "@gluestack-ui/themed";
import { Animated, Easing, TouchableOpacity } from "react-native";
import { UserStore } from "@config/store";
import { ActionEdit } from "@components/actionRequest";
import { getUser, getUserId } from "@services/User";
import userInterface from "@services/User/interface";
import { baseURL } from "@config/intance";
import { IconCustom } from "@components/iconCustom";
import Ionicons from "react-native-vector-icons/Ionicons"

const BattleScreen = () => {
    const vsScale = useRef(new Animated.Value(1)).current;
    const avatarOpacity = useRef(new Animated.Value(0)).current;
    const buttonScale = useRef(new Animated.Value(1)).current;
    const { user } = UserStore();
    const [showActionsheet, setShowActionsheet] = React.useState(false)
    const handleClose = () => setShowActionsheet(!showActionsheet)
    const [dataUser, setDataUser] = useState<userInterface[]>([])
    const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
    const [anemy, setAnemy] = useState<any>(null);

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
        try {
            const response = await getUserId(errorFunc, id);
            if (response.status) {
                setAnemy(response.data)
            }
        } catch (error) {
            console.log('error fetch user id');
        }
    }


    const toggleMemberSelection = (id: number, isChecked: boolean) => {

        setSelectedMembers(prevSelectedMembers => {
            if (isChecked) {
                return [...prevSelectedMembers, id];
            } else {
                return prevSelectedMembers.filter(memberId => memberId !== id);
            }
        });
        FetchUserID(id)
        handleClose()
    };
    console.log('item', anemy);
    return (
        <SafeAreaCustom>
            <View flex={1} marginHorizontal={16} alignItems="center" justifyContent="center">
                <VStack alignItems="center" space="2xl">
                    <VStack alignItems="center">
                        <TextHeading style={{ color: '#ca8a04' }}><TextHeading>Battle</TextHeading> Quizz Lampung</TextHeading>
                        <Text>Undang teman untuk battle</Text>
                    </VStack>
                    <HStack alignItems="center" space="4xl">
                        <Animated.View style={{ opacity: avatarOpacity }}>
                            <VStack alignItems="center" space="xs">
                                <Avatar bgColor="$amber600" size="md" borderRadius="$full">
                                    <AvatarFallbackText>{user?.name}</AvatarFallbackText>
                                </Avatar>
                                <Text size="sm">{user?.name}</Text>
                            </VStack>
                        </Animated.View>
                        <Animated.Text style={{ transform: [{ scale: vsScale }] }}>
                            <TextHeading>VS</TextHeading>
                        </Animated.Text>
                        <Animated.View style={{ opacity: avatarOpacity }}>
                            <VStack alignItems="center" space="xs">
                                <TouchableOpacity onPress={handleClose}>
                                    <Avatar bgColor="$indigo600" size="md" borderRadius="$full">

                                        <AvatarFallbackText>{anemy ? anemy.name : '+'}</AvatarFallbackText>
                                    </Avatar>
                                </TouchableOpacity>
                                <Text size="sm">{anemy ? anemy.name : ''}</Text>
                            </VStack>
                        </Animated.View>
                    </HStack>
                    <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                        <Button action="negative" borderRadius={10} mt={20}>
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
                            <ActionsheetScrollView h={'50%'} >
                                <HStack alignSelf="center">
                                    <TouchableOpacity onPress={() => { setSelectedMembers([]), setAnemy(null) }}>
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
                                                <ActionsheetItemText>
                                                    {value.name}
                                                </ActionsheetItemText>
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

export { BattleScreen };
