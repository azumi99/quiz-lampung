import { IconCustom } from "@components/iconCustom"
import SafeAreaCustom from "@components/safeArea"
import { UserStore } from "@config/store"
import { supabase } from "@config/supabase"
import { Button, ButtonText, Heading, Text, View, VStack } from "@gluestack-ui/themed"
import { useNavigation } from "@react-navigation/native"
import React, { useEffect, useRef, useState } from "react"
import { Animated } from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"

const FinishScreen = ({ route }) => {
    const navigation = useNavigation<any>();
    const bounceAnim = useRef(new Animated.Value(0)).current;
    const { user } = UserStore();
    const [jawaban, setJawaban] = useState<any>([]);
    const [soal, setSoal] = useState<any>([]);
    const [poin, setPoin] = useState(0);
    const [finis, setFinis] = useState<boolean>(false)

    useEffect(() => {
        Animated.sequence([
            Animated.spring(bounceAnim, {
                toValue: 1,
                friction: 3,
                tension: 150,
                useNativeDriver: true,
            }),
            Animated.spring(bounceAnim, {
                toValue: 0.9,
                friction: 3,
                tension: 100,
                useNativeDriver: true,
            }),
            Animated.spring(bounceAnim, {
                toValue: 1,
                friction: 3,
                tension: 150,
                useNativeDriver: true,
            }),
        ]).start();
    }, [bounceAnim]);

    useEffect(() => {
        const FetchJawaban = async () => {
            try {
                const { data, error, status } = await supabase
                    .from('jawaban')
                    .select('*, soal(*)')
                    .eq('id_user', user?.id)
                    .eq('code_soal', route.params.code_soal);

                if (status == 200) {
                    setJawaban(data)
                }
            } catch (error) {
                console.log('error fetch jawaban')
            }
        }
        const FetchPoin = async () => {
            try {
                const { data, error, status } = await supabase
                    .from('poin')
                    .select('*')
                    .eq('id_user', user?.id)
                    .eq('code_soal', route.params.code_soal);

                if (status == 200) {
                    if (data?.[0]?.poin == undefined) {
                        setPoin(0)
                    } else {
                        setPoin(data?.[0]?.poin)
                    }

                }
            } catch (error) {
                console.log('error fetch poin')
            }
        }
        FetchPoin()
        FetchJawaban()
    }, [])

    const hasilCount = jawaban.reduce(
        (acc, value) => {
            if (value.hasil === 1) {
                acc.satu += 1;
            } else if (value.hasil === 0) {
                acc.nol += 1;
            }
            return acc;
        },
        { satu: 0, nol: 0 }
    );

    const totalPoin = jawaban.reduce(
        (acc, item) => {
            if (item.hasil === 1) {
                acc += item.soal.point;
            }
            return acc;
        },
        0
    );

    const InsertPoin = async (id_user, poin, code_soal, selesai) => {
        try {
            const { data: existingData, error: selectError } = await supabase
                .from('poin')
                .select('id')
                .eq('id_user', id_user)
                .eq('code_soal', code_soal)
                .maybeSingle();

            if (selectError) {
                console.error('Error checking data:', selectError);
                return null;
            }

            if (existingData) {
                const { data: updatedData, error: updateError } = await supabase
                    .from('poin')
                    .update({ poin, selesai })
                    .eq('id_user', id_user)
                    .eq('code_soal', code_soal);

                if (updateError) {
                    console.error('Error updating data:', updateError);
                    return null;
                }

                console.log('Poin updated successfully:', updatedData);
                return updatedData;
            } else {
                const { data: insertedData, error: insertError } = await supabase
                    .from('poin')
                    .insert([{ id_user, poin, code_soal, selesai }]);

                if (insertError) {
                    console.error('Error inserting data:', insertError);
                    return null;
                }

                console.log('Poin inserted successfully:', insertedData);
                return insertedData;
            }
        } catch (error) {
            console.log('Error during insert or update:', error);
        }
    };

    useEffect(() => {
        const fetchJawaban = async () => {
            try {
                const { data: soalData, error: soalError } = await supabase
                    .from('soal')
                    .select('*')
                    .eq('code_soal', route.params.code_soal);
                if (!soalData) {
                    console.log("Tidak ada data soal yang ditemukan.");
                    return;
                }

                const { data: jawabanData, error: jawabanError, status } = await supabase
                    .from('jawaban')
                    .select('id_soal, hasil')
                    .eq('id_user', user?.id)
                    .eq('code_soal', route.params.code_soal);

                if (status === 200) {
                    const validJawabanData = jawabanData ?? [];

                    const answeredSoalIds = validJawabanData.map((item) => item.id_soal);

                    const unansweredSoal = soalData.filter(
                        (soal) => !answeredSoalIds.includes(soal.id)
                    );

                    if (unansweredSoal.length > 0) {
                        console.log("Masih ada soal yang belum dijawab:", unansweredSoal);
                        setFinis(false);
                    } else {
                        console.log("Semua soal sudah dijawab");
                        setFinis(true)
                    }
                }
            } catch (error) {
                console.log("Error fetching data:", error);
            }
        };

        fetchJawaban()

    })
    console.log('poin', totalPoin + poin)
    return (
        <SafeAreaCustom>
            <View justifyContent="center" alignItems="center" flex={1}>
                <Animated.View style={{ transform: [{ scale: bounceAnim }] }}>

                    <VStack alignItems="center" space="md">
                        <IconCustom As={Ionicons} name="checkmark-circle" color="green" size={100} />
                        <Heading>Quizz {route.params.name}</Heading>
                        <Text>Jawaban Benar:  <Heading size="sm">{hasilCount.satu}</Heading></Text>
                        <Text>Jawaban Salah:  <Heading size="sm">{hasilCount.nol}</Heading></Text>
                        <Text>Poin :  <Heading size="sm">{totalPoin}</Heading></Text>
                        <Button onPress={() => { InsertPoin(user?.id, totalPoin, route.params.code_soal, finis ? 1 : 0); navigation.navigate('TabNav', { screen: 'HomeScreen' }) }}>
                            <ButtonText>Selesai</ButtonText>
                        </Button>
                    </VStack>
                </Animated.View>
            </View>
        </SafeAreaCustom>
    )
}

export { FinishScreen };