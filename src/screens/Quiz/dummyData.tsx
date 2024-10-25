interface dataInterface {
    id: number;
    soal: string;
    pilihan: string[];
    jawaban: number;
    codeSoal: number;
}

export const dataQuiz: dataInterface[] = [
    {
        id: 1,
        soal: 'Ibu kota kabupaten Mesuji',
        pilihan: [
            'Wiralaga Mulya',
            'Simpang Pematang',
            'Wirabangun',
            'Panca Jaya',
        ],
        jawaban: 1,
        codeSoal: 1
    },
    {
        id: 2,
        soal: "Ibu kota kabupaten Pringsewu",
        pilihan: [
            "Gadingrejo",
            "Ambarawa",
            "Pringsewu",
            "Pagelaran"
        ],
        jawaban: 2,
        codeSoal: 2
    },
    {
        id: 3,
        soal: "Ibu kota kabupaten Lampung Timur",
        pilihan: [
            "Sukadana",
            "Labuhan Ratu",
            "Way Jepara",
            "Metro Kibang"
        ],
        jawaban: 0,
        codeSoal: 3
    },
    {
        id: 4,
        soal: "Ibu kota kabupaten Tulang Bawang",
        pilihan: [
            "Banjar Agung",
            "Menggala",
            "Dente Teladas",
            "Rawajitu Selatan"
        ],
        jawaban: 1,
        codeSoal: 4
    },
    {
        id: 5,
        soal: "Ibu kota kabupaten Lampung Barat",
        pilihan: [
            "Liwa",
            "Sumber Jaya",
            "Belalau",
            "Sekincau"
        ],
        jawaban: 0,
        codeSoal: 5
    }




]