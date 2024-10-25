import { IconCustom } from "@components/iconCustom"
import SafeAreaCustom from "@components/safeArea"
import { TextHeading } from "@components/textHeading"
import { Card, Heading, HStack, Progress, ProgressFilledTrack, Text, View, VStack } from "@gluestack-ui/themed"
import { useNavigation } from "@react-navigation/native"
import React, { useEffect, useRef, useState } from "react"
import { Animated, StyleSheet, TouchableOpacity } from "react-native"
import CircularProgress from "react-native-circular-progress-indicator"
import Ionicons from 'react-native-vector-icons/Ionicons';
import { dataQuiz } from "./dummyData"
import { supabase } from "@config/supabase"
import Spinner from "react-native-loading-spinner-overlay"


const QuizScreen = ({ route }) => {
    const navigation = useNavigation<any>();
    const [selected, setSelected] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [dataSoal, setDataSoal] = useState<any>([]);
    const [poin, setPoint] = useState(dataSoal.point)
    const [loading, setLoading] = useState(true);

    const nextQuestion = () => {
        if (currentIndex < dataQuiz.length - 1) {
            setCurrentIndex(currentIndex + 1);
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
        if (selected !== null) {
            fadeAnim.setValue(0);
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [selected]);
    const handlePress = (index) => {
        if (selected === index) return;
        setSelected(index);
    };
    const CardComponent = ({ index, title }) => {
        const isSelected = selected === index;

        return (
            <TouchableOpacity onPress={() => handlePress(index)}>
                <Card size="md" variant="filled" style={styles.card}>
                    <Heading mb="$1" size="md">
                        {title}
                    </Heading>
                    {isSelected && (
                        <Animated.View
                            style={[styles.iconContainer, { opacity: fadeAnim }]}>
                            <Ionicons name="checkmark-circle" size={24} color="green" />
                        </Animated.View>
                    )}
                </Card>
            </TouchableOpacity>
        );
    };

    const getSelectedTitle = () => {
        return selected !== null ? dataQuiz[currentIndex].pilihan[selected] : 'Tidak ada yang dipilih';
    };
    console.log(getSelectedTitle());

    useEffect(() => {
        const FetchSoal = async () => {
            try {
                let page = currentIndex;
                const itemsPerPage = 1;
                const response = await supabase
                    .from('soal')
                    .select('*')
                    .eq('code_soal', route.params.code_soal)
                    .range((page) * itemsPerPage, page * itemsPerPage);

                if (response.status == 200) {
                    setDataSoal(response.data);
                    setLoading(false);
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
                            <CircularProgress value={20} radius={15} activeStrokeColor="#eab308" activeStrokeWidth={5} inActiveStrokeWidth={5} />
                        </VStack>
                        <TextHeading >{route.params.name}</TextHeading>
                        <HStack >
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <IconCustom As={Ionicons} name="close-sharp" size={30} color="#f87171" />
                            </TouchableOpacity>
                        </HStack>
                    </HStack>
                    {dataSoal.map((item, keys) => (
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
                                    <CardComponent key={index} index={index} title={title} />
                                ))}
                            </VStack>


                        </VStack>
                    ))}
                </VStack>
            </View>
            <View marginHorizontal={16} marginVertical={16}>
                {dataSoal.length > 0 &&
                    <TouchableOpacity onPress={nextQuestion} style={{ padding: 10, backgroundColor: '#eab308', borderRadius: 10, justifyContent: 'flex-end' }}>
                        <Text textAlign="center" color="white">Selanjutnya </Text>
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
export { QuizScreen }