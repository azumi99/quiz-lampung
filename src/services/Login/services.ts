import {instance} from '@config/intance';
import loginInterface from '@services/Login/interface';

type Props = (message: string) => void;
const loginService = async (param: loginInterface, errorFunc?: Props) => {
  try {
    const response = await instance.post('/auth/login', param);
    return response.data;
  } catch (error) {
    errorFunc!('error connection');
    throw error;
  }
};
const checkLogin = async (errorFunc?: Props) => {
  try {
    const response = await instance.post('/auth/check');
    return response.data;
  } catch (error) {
    errorFunc!('error connection');
    throw error;
  }
};
const userService = async (errorFunc?: Props) => {
  try {
    const response = await instance.get('/auth/user-profile');
    return response.data;
  } catch (error) {
    errorFunc!('error connection');
    throw error;
  }
};
const logoutService = async (errorFunc?: Props) => {
  try {
    const response = await instance.post('/auth/logout');
    return response.data;
  } catch (error) {
    errorFunc!('error connection');
    throw error;
  }
};



export {loginService, checkLogin, userService, logoutService};
