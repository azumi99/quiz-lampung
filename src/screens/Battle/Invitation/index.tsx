import React, { useEffect, useState, useRef } from "react";
import {
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    RefreshControl,
    Animated
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { formatDate } from "@components/dateConvert";
import SafeAreaCustom from "@components/safeArea";
import { TextHeading } from "@components/textHeading";
import { ShowToast } from "@components/toast";
import { NotifStore, UserStore } from "@config/store";
import { Button, ButtonText, Card, HStack, Text, VStack } from "@gluestack-ui/themed";
import { useNavigation } from "@react-navigation/native";
import { DeleteNotif, GetNotif, GetNotifInterface } from "@services/Notifications";
import { supabase } from "@config/supabase";

interface NotificationInterface {
    id?: number;
    title?: string;
    body?: string;
    created_at?: string;
    updated_at?: string;
    id_user?: number;
    invite?: number;
    id_battle?: number;
    opacity?: any;
}


const InvitationNotif = () => {
    const navigation = useNavigation<any>();
    const { user } = UserStore();
    const [page, setPage] = useState(1);
    const [notif, setNotif] = useState<NotificationInterface[]>([]);
    const [isFetching, setIsFetching] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const { notifs } = NotifStore();


    const errorFunc = () => console.log("error");

    const GetNotifService = async () => {
        const param: GetNotifInterface = {
            id_user: user?.id,
            invite: 1,
            page: page
        };
        setIsFetching(true);
        try {
            const response = await GetNotif(errorFunc, param);
            if (response.status) {
                const notifications = response.data.map((notif) => ({
                    ...notif,
                    opacity: new Animated.Value(1),
                }));
                setNotif((prev) => [...prev, ...notifications]);
                setHasMore(response.next_page_url !== null);
            }
        } catch (error) {
            errorFunc();
        } finally {
            setIsFetching(false);
        }
    };

    useEffect(() => {
        GetNotifService();
    }, [page]);

    useEffect(() => {
        setPage(1);
        setNotif([]);
        GetNotifService();
    }, [notifs]);

    const loadMore = () => {
        if (!isFetching && hasMore) {
            setPage((prev) => prev + 1);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        setPage(1);
        setNotif([]);
        await GetNotifService();
        setRefreshing(false);
    };

    const handleDelete = async (id: number, index: number) => {
        try {
            const response = await DeleteNotif(errorFunc, id);
            if (response.status) {
                ShowToast("Notification deleted!");
                animateDelete(index);
            }
        } catch (error) {
            errorFunc();
        }
    };

    const animateDelete = (index: number) => {
        const item = notif[index];
        if (item && item.opacity) {
            Animated.timing(item.opacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start(() => {
                setNotif((prev) => prev.filter((_, i) => i !== index));
            });
        }
    };

    const renderRightActions = (id: number, index: number) => (
        <TouchableOpacity
            style={styles.rightActionContainer}
            onPress={() => handleDelete(id, index)}
        >
            <Text color="white" size="sm">Hapus</Text>
        </TouchableOpacity>
    );

    const JoinRoom = async (roomId) => {
        try {
            const { data, error } = await supabase
                .from('battle')
                .update({ id_user_2: user?.id })
                .eq('id', roomId)
                .select('*');

            if (error) {
                console.error('Error updating room with id_user_2:', error);
                ShowToast('Failed to join room');
                return null;
            }

            ShowToast('Joined room successfully');
            navigation.navigate('StackNav', { screen: 'StarterScreen', params: { idbattle: roomId } })
            console.log('Updated Room Data:', data);
            return data;
        } catch (error) {
            console.log('Error updating room');
            ShowToast('Failed to join room, try again');
        }
    };

    const renderItem = ({ item, index }) => (
        <Swipeable
            key={index}
            renderRightActions={() => renderRightActions(item.id as number, index)}
            friction={2}
            rightThreshold={40}
        >
            <Animated.View
                style={[
                    styles.animatedCard,
                    { opacity: item.opacity, transform: [{ translateX: item.opacity.interpolate({ inputRange: [0, 1], outputRange: [-100, 0] }) }] },
                ]}
            >
                <Card size="md" variant="filled">
                    <HStack alignItems="center" space="md">
                        <VStack width="75%">
                            <TextHeading size="md">{item.title}</TextHeading>
                            <Text size="sm">{item.body}</Text>
                            <Text size="sm">{formatDate(item.created_at as string)}</Text>
                        </VStack>
                        {item.invite == 1 && (
                            <VStack space="xs">
                                <Button size="xs" onPress={() => JoinRoom(item?.id_battle)}>
                                    <ButtonText>Join</ButtonText>
                                </Button>
                                <Button size="xs" action="negative">
                                    <ButtonText>Tolak</ButtonText>
                                </Button>
                            </VStack>
                        )}
                    </HStack>
                </Card>
            </Animated.View>
        </Swipeable>
    );

    return (
        <SafeAreaCustom>
            <ScrollView
                contentContainerStyle={styles.scrollViewContainer}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
                onScroll={({ nativeEvent }) => {
                    const contentHeight = nativeEvent.contentSize.height;
                    const contentOffsetY = nativeEvent.contentOffset.y;
                    const screenHeight = nativeEvent.layoutMeasurement.height;
                    if (contentOffsetY + screenHeight >= contentHeight - 20) {
                        loadMore();
                    }
                }}
                style={{ paddingHorizontal: 16, paddingVertical: 16 }}
            >
                <VStack space="md">
                    {notif.map((item, index) => renderItem({ item, index }))}
                    {isFetching && <ActivityIndicator size="small" color="#0000ff" />}
                </VStack>
            </ScrollView>
        </SafeAreaCustom>
    );
};

const styles = StyleSheet.create({
    rightActionContainer: {
        justifyContent: "center",
        alignItems: "center",
        width: 75,
        backgroundColor: "#e11d48",
        marginVertical: 30,
        borderRadius: 10
    },
    scrollViewContainer: {
        paddingBottom: 100,
    },
    animatedCard: {
        marginVertical: 0,
    }
});

export { InvitationNotif };
