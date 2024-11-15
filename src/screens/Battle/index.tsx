import React, { useState } from "react";
import SafeAreaCustom from "@components/safeArea";
import { Avatar, AvatarFallbackText, AvatarImage, Card, HStack, Text, View, VStack } from "@gluestack-ui/themed";
import { UserStore } from "@config/store";
import { TextHeading } from "@components/textHeading";
import { baseURL } from "@config/intance";
import Ionicons from 'react-native-vector-icons/Ionicons'
import { IconCustom } from "@components/iconCustom";
import { ToastAndroid, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "@config/supabase";

interface RoomBattle {
    id_soal?: number;
    id_user_1?: number;
    id_user_2?: number;
    poin?: number;
    status?: boolean;
}

const BattleScreen = () => {
    const { user } = UserStore();
    const navigation = useNavigation<any>();

    const showToast = (message: string) => {
        ToastAndroid.show(message, ToastAndroid.SHORT);
    };
    const dataParam: RoomBattle = {
        id_soal: 4,
        id_user_1: user?.id,
        status: true
    }
    const CreateRoom = async () => {
        try {
            const { data, error, status } = await supabase
                .from('battle')
                .insert(dataParam)
                .select('*')
                .single();
            if (error) {
                console.error('Error inserting data:', error);
                return null;
            }

            if (status == 201) {
                showToast('created room battle')
                console.log('data', data.id);
                navigation.navigate('StackNav', { screen: 'StarterScreen', params: { idbattle: data.id } })
            }
            return data;
        } catch (error) {
            console.log('Error fetching jawaban');
            showToast('fail created room battle try again')


        }
    }

    return (
        <SafeAreaCustom>
            <View flex={1} paddingHorizontal={16} mt={20} mb={20}>
                <VStack space="xl">
                    <HStack justifyContent="space-between" alignItems="center">
                        <TextHeading size="xl"><TextHeading size="xl" style={{ color: '#eab308' }}>Quizz</TextHeading> Battle</TextHeading>
                        <TouchableOpacity onPress={() => navigation.navigate('StackNav', { screen: 'InvitationNotif', title: 'Notification' })} >
                            <IconCustom As={Ionicons} name="notifications-circle-sharp" size={40} color="#eab308" />
                        </TouchableOpacity>
                    </HStack>
                    <TouchableOpacity onPress={() => navigation.navigate('StackNav', { screen: 'InvitationNotif', title: 'Invitation Notif' })}>
                        <Card size="md" variant="elevated" bgColor='$emerald200' >
                            <TextHeading style={{ color: '#065f46' }}>Invitation Notif</TextHeading>
                        </Card>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { CreateRoom() }}>
                        <Card size="md" variant="elevated" bgColor='$purple200' >
                            <TextHeading style={{ color: '#6b21a8' }}>Buat Room Battle 1 vs 1</TextHeading>
                        </Card>
                    </TouchableOpacity>

                </VStack>
            </View>
        </SafeAreaCustom>
    );
};

export { BattleScreen };
