import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface JwtState {
  token: string;
  setToken: (token: string) => void;
}

const TokenJwt = create<JwtState>()(
  persist(
    set => ({
      token: '',
      setToken: (newToken: string) => set({ token: newToken }),
    }),
    {
      name: 'jwttoken',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
export interface UserData {
  id?: number;
  name?: string;
  email?: string;
  role?: string;
  url?: string;
}

interface UserState {
  user: UserData | null;
  setUser: (userData: UserData) => void;
}

const UserStore = create<UserState>()(
  persist(
    set => ({
      user: null,
      setUser: (userData: UserData) => set({ user: userData }),
    }),
    {
      name: 'user-data',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export interface temaData {
  id?: number;
  nama_tema?: string;
  deskripsi?: string;
  icon_name?: string;
}

interface temaDataStore {
  tema: temaData[];
  setTema: (dataTema: any) => void;
}
const TemaStore = create<temaDataStore>()(
  persist(
    set => ({
      tema: [],
      setTema: (dataTema: temaData[]) => set({ tema: dataTema }),
    }),
    {
      name: 'tema-data',
      storage: createJSONStorage(() => AsyncStorage),
    },
  )
);

interface DarkModeInterface {
  mode: boolean;
  setMode: (mode: boolean) => void;
}

const DarkModeStore = create<DarkModeInterface>()(
  persist(
    set => ({
      mode: false,
      setMode: (newToken: boolean) => set({ mode: newToken }),
    }),
    {
      name: 'mode',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

interface EditProfileInterface {
  param: boolean;
  setParam: (param: boolean) => void;
}

const EditProfileStore = create<EditProfileInterface>()(set => ({
  param: false,
  setParam: (value: boolean) => set({ param: value }),
}));

interface ChangePasswordInterface {
  change: boolean;
  setChange: (param: boolean) => void;
}

const ChangePasswordStore = create<ChangePasswordInterface>()(set => ({
  change: false,
  setChange: (value: boolean) => set({ change: value }),
}));

interface EditActionInterface {
  edit: boolean;
  setEdit: (value: boolean) => void;
}

const ActionEditStore = create<EditActionInterface>()(set => ({
  edit: false,
  setEdit: (value: boolean) => set({ edit: value }),
}));

interface addAccountInterface {
  add: boolean;
  setAdd: (value: boolean) => void;
}

const AddAccountStore = create<addAccountInterface>()(set => ({
  add: false,
  setAdd: (value: boolean) => set({ add: value }),
}));

interface navigateIdRequestInterface {
  idNav: number;
  setIdNav: (value: number) => void;
}

const navigateIdRequestStore = create<navigateIdRequestInterface>()(set => ({
  idNav: 0,
  setIdNav: (value: number) => set({ idNav: value }),
}));

export interface UserData {
  id?: number;
  name?: string;
  email?: string;
  role?: string;
  url?: string;
}
interface FcmInterface {
  fcmtoken: string;
  setFcmtoken: (value: string) => void;
}
const TokenFCMStore = create<FcmInterface>()(set => ({
  fcmtoken: '',
  setFcmtoken: (value: string) => set({ fcmtoken: value }),
}));
const MessageStore = create<any>()(set => ({
  messageData: '',
  setMessageData: (value: any) => set({ messageData: value }),
}));
interface NotifInterface {
  notifs: string;
  setNotif: (value: string) => void;
}
const NotifStore = create<NotifInterface>()(set => ({
  notifs: '',
  setNotif: (value: string) => set({ notifs: value }),
}));

export {
  TokenJwt,
  UserStore,
  DarkModeStore,
  ActionEditStore,
  EditProfileStore,
  navigateIdRequestStore,
  ChangePasswordStore,
  AddAccountStore,
  MessageStore,
  TokenFCMStore,
  NotifStore,
  TemaStore
};
