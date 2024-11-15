import { instance } from "@config/intance";

type Props = (message: string) => void;
export interface GetNotifInterface {
    id_user?: number;
    page?: number;
    invite: number;
}
const GetNotif = async (errorFunc?: Props, param?: GetNotifInterface) => {
    try {
        const response = await instance.get('/notif/', {
            params: param
        });
        return response.data;
    } catch (error) {
        console.log('error conection get notif')
        errorFunc!('error connection getNotif');
    }
}

const DeleteNotif = async (errorFunc?: Props, id?: number) => {
    try {
        const response = await instance.delete(`/notif/${id}`);
        return response.data;
    } catch (error) {
        console.log('error conection DeleteNotif')
        errorFunc!('error connection DeleteNotif');
    }
}

export interface FCMSend {
    id_user?: number;
    title?: string;
    body?: string;
    id_battle?: number;
    invite?: number;
}

const SendNotif = async (errorFunc?: Props, param?: FCMSend) => {
    try {
        const response = await instance.post('/sendNotif/', param);
        return response.data;
    } catch (error) {
        console.log('error conection get notif')
        errorFunc!('error connection getNotif');
    }
}

export { GetNotif, DeleteNotif, SendNotif }