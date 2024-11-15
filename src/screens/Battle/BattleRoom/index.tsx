import { IconCustom } from "@components/iconCustom"
import SafeAreaCustom from "@components/safeArea"
import { TextHeading } from "@components/textHeading"
import { Card, Heading, HStack, Progress, ProgressFilledTrack, Text, View, VStack } from "@gluestack-ui/themed"
import { useNavigation } from "@react-navigation/native"
import React, { useEffect, useRef, useState } from "react"
import { Animated, StyleSheet, TouchableOpacity } from "react-native"
import CircularProgress from "react-native-circular-progress-indicator"
import Ionicons from 'react-native-vector-icons/Ionicons';
import { supabase } from "@config/supabase"
import Spinner from "react-native-loading-spinner-overlay"
import { UserStore } from "@config/store"


const BattleRoom = ({ route }) => {
    const navigation = useNavigation<any>();
    const [selected, setSelected] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [dataSoal, setDataSoal] = useState<any>([]);
    const [poin, setPoint] = useState(0)
    const [loading, setLoading] = useState(true);
    const [totalPage, setTotalPage] = useState<any>(0);
    const { user } = UserStore();
    const [hasil, setHasil] = useState(0);
    const [jawaban, setJawaban] = useState<any>([]);



    const nextQuestion = () => {
        if (currentIndex < totalPage - 1) {
            setCurrentIndex(currentIndex + 1);
            jawaban?.[0]?.answer == undefined && selected != null && SendJawaban(dataSoal?.[0]?.id, user?.id, selected, hasil, route.params.code_soal)
            setSelected(null)
            setLoading(true)
        }
    };

    const prevQuestion = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const fadeAnim = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        if (selected !== null || jawaban?.[0]?.answer != undefined) {
            fadeAnim.setValue(0);
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [selected, jawaban?.[0]?.answer]);

    const handlePress = (index, answer) => {
        if (selected === index) return;
        index == answer ? setHasil(1) : setHasil(0);
        setSelected(index);

    };
    const CardComponent = ({ index, title, answer }) => {
        const isSelected = selected === index;
        const isAnswer = index === answer;
        console.log('mm', jawaban?.[0]?.answer);
        return (
            <TouchableOpacity onPress={() => handlePress(index, answer)} disabled={selected != null || jawaban?.[0]?.answer != undefined}>
                <Card size="md" variant="filled" style={styles.card} >
                    <Text mb="$1" size="lg" bold={jawaban?.[0]?.answer == index || isSelected} >
                        {title}
                    </Text>
                    <Animated.View style={[styles.iconContainer, { opacity: fadeAnim }]}>
                        {isAnswer && jawaban?.[0]?.answer != undefined && < Ionicons name="checkmark-circle" size={24} color="green" />}
                        {jawaban?.[0]?.answer == index && jawaban?.[0]?.answer != answer && <Ionicons name="close-sharp" size={24} color="red" />}
                    </Animated.View>


                    {(isSelected || isAnswer) && (
                        <Animated.View
                            style={[styles.iconContainer, { opacity: fadeAnim }]}>
                            {isAnswer && selected != null && (
                                <Ionicons name="checkmark-circle" size={24} color="green" />
                            )}
                            {isSelected && !isAnswer && (
                                <Ionicons name="close-sharp" size={24} color="red" />
                            )}

                        </Animated.View>
                    )}
                </Card>
            </TouchableOpacity >
        );
    };

    const getSelectedTitle = () => {
        return selected !== null ? dataSoal[currentIndex].pilihan[selected] : 'Tidak ada yang dipilih';
    };


    useEffect(() => {
        const FetchSoal = async () => {
            try {
                const { count } = await supabase
                    .from('soal')
                    .select('*', { count: 'exact', head: true })
                    .eq('code_soal', route.params.code_soal);

                let page = currentIndex;
                const itemsPerPage = 1;
                const response = await supabase
                    .from('soal')
                    .select('*')
                    .eq('code_soal', route.params.code_soal)
                    .range((page) * itemsPerPage, page * itemsPerPage);


                if (response.status == 200) {
                    setTotalPage(count)
                    setDataSoal(response.data);
                    setLoading(false);
                    setPoint(prevPoint => prevPoint + (response.data?.[0]?.point || 0));
                }
            } catch {
                console.log('Error fetching users');
                setLoading(false);
            }
        };

        FetchSoal();

        const subscription = supabase
            .channel('public:soal')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'soal' },
                (payload) => {
                    console.log('New record added:', payload);
                    setDataSoal((prevSoal: any) => [...prevSoal, payload.new]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, [currentIndex])

    useEffect(() => {
        const FetchJawaban = async () => {
            try {
                const { data, error, status } = await supabase
                    .from('jawaban')
                    .select('*')
                    .eq('id_user', user?.id)
                    .eq('id_soal', dataSoal?.[0]?.id)
                    .eq('code_soal', route.params.code_soal);

                if (status == 200) {
                    setJawaban(data)
                }

            } catch (error) {
                console.log('Error fetching jawaban');

            }
        }
        FetchJawaban()
    }, [dataSoal?.[0]?.id])



    const SendJawaban = async (id_soal, id_user, answer, hasil, code_soal) => {
        try {
            const { data, error } = await supabase
                .from('jawaban')
                .insert([
                    {
                        id_soal,
                        id_user,
                        answer,
                        hasil,
                        code_soal
                    }
                ]);
            if (error) {
                console.error('Error inserting data:', error);
                return null;
            }

            console.log('Data inserted successfully:', data);
            return data;
        } catch (error) {
            console.log('Error fetching jawaban');
            setLoading(false);

        }
    }

    console.log('jawaban', jawaban?.[0]?.answer)
    const submit = () => {
        if (jawaban?.[0]?.answer == undefined && selected != null) {
            SendJawaban(dataSoal?.[0]?.id, user?.id, selected, hasil, route.params.code_soal);
        }
    }
    return (
        <SafeAreaCustom>
            <Spinner
                visible={loading}
                textContent={'Loading...'}
                textStyle={{ color: '#FFF' }}
            />
            <View flex={1} paddingHorizontal={16} mt={20} mb={20}>
                <VStack space="xl">
                    <HStack justifyContent="space-between" alignItems="center"  >
                        <VStack>
                            <CircularProgress value={poin} radius={15} activeStrokeColor="#eab308" activeStrokeWidth={5} inActiveStrokeWidth={5} />
                        </VStack>
                        <TextHeading >{route.params.name}</TextHeading>
                        <HStack >
                            <Text>2</Text>
                        </HStack>
                    </HStack>
                    {dataSoal.map((item, keys) => {
                        return (
                            <VStack key={keys} space="3xl">
                                <VStack >
                                    <Card size="md" variant="elevated" bgColor='$purple400'>
                                        <Heading mb="$1" size="md" color='white'>
                                            Pertanyaan {currentIndex + 1}
                                        </Heading>
                                        <Text size="xl" color='white'>{item?.pertanyaan}</Text>
                                    </Card>
                                </VStack>

                                <VStack space="md">
                                    {item?.pilihan.map((title, index) => (
                                        <CardComponent key={index} index={index} title={title} answer={item?.jawaban} />
                                    ))}
                                </VStack>
                            </VStack>
                        )
                    })}
                </VStack>
            </View>
            <View marginHorizontal={16} marginVertical={16}>
                {dataSoal.length > 0 &&
                    <TouchableOpacity disabled={selected == null && jawaban?.[0]?.answer == undefined} onPress={currentIndex + 1 == totalPage ? () => { submit(); navigation.navigate('StackNav', { screen: 'FinishScreen', params: { name: route.params.name, code_soal: route.params.code_soal, poin: poin } }) } : nextQuestion} style={{ padding: 10, backgroundColor: selected == null && jawaban?.[0]?.answer == undefined ? '#fef08a' : '#eab308', borderRadius: 10, justifyContent: 'flex-end' }}>
                        <Text textAlign="center" color="white">{currentIndex + 1 == totalPage ? 'Selesai' : 'Selanjutnya'} </Text>
                    </TouchableOpacity>}
            </View>
        </SafeAreaCustom>
    )
}
const styles = StyleSheet.create({
    card: {
        position: 'relative',
        padding: 10,
    },
    iconContainer: {
        position: 'absolute',
        right: 10,
        top: 10,
    },
});
export { BattleRoom }