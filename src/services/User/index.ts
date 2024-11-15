import { instance } from '@config/intance';
import userInterface from './interface';
import registerInterface from './interface';

type Props = (message: string) => void;
const getUser = async (errorFunc?: Props) => {
  try {
    const response = await instance.get('/user');
    return response.data;
  } catch (error) {
    errorFunc!('error connection');
    throw error;
  }
};
const getUserId = async (errorFunc?: Props, id?: number) => {
  try {
    const response = await instance.get(`/user/${id}`);
    return response.data;
  } catch (error) {
    errorFunc!('error connection');
    throw error;
  }
};

const updateUser = async (
  errorFunc?: Props,
  id?: number,
  param?: userInterface,
) => {
  try {
    const response = await instance.post(`/user/${id}`, param);
    return response.data;
  } catch (error) {
    errorFunc!('error connection');
    throw error;
  }
};

const changePasswordService = async (
  errorFunc?: Props,
  current_password?: string,
  new_password?: string,
) => {
  try {
    const response = await instance.post('/change-password', {
      current_password: current_password,
      new_password: new_password,
    });
    return response.data;
  } catch (error) {
    errorFunc!('error connection');
    throw error;
  }
};
const resetPassword = async (
  errorFunc?: Props,
  email?: string,
  password?: string,
  password_confirmation?: string,
) => {
  try {
    const response = await instance.post('/passwordReset', {
      email: email,
      password: password,
      password_confirmation: password_confirmation,
    });
    return response.data;
  } catch (error) {
    errorFunc!('error connection');
    throw error;
  }
};
const deleteAccount = async (errorFunc?: Props, id?: number) => {
  try {
    const response = await instance.delete(`/user/${id}`);
    return response.data;
  } catch (error) {
    errorFunc!('error connection');
    throw error;
  }
};

const newAccount = async (errorFunc?: Props, param?: registerInterface) => {
  try {
    const response = await instance.post('/auth/register', param);
    return response.data;
  } catch (error) {
    errorFunc!('error connection');
    throw error;
  }
};

export {
  getUser,
  updateUser,
  changePasswordService,
  getUserId,
  resetPassword,
  deleteAccount,
  newAccount,
};
