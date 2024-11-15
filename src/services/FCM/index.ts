import {instance} from '@config/intance';

type Props = (message: string) => void;
const FcmSave = async (errorFunc?: Props, id_user?: number, token?: string) => {
  try {
    const response = await instance.post('/saveFcmToken', {
      id_user: id_user,
      token: token,
    });
    return response.data;
  } catch (error) {
    errorFunc!('error connection');
    throw error;
  }
};

export {FcmSave};
