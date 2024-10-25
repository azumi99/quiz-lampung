import {IconCustom} from '@components/iconCustom';
import {InputDefault} from '@components/input/inputDefault';
import SafeAreaCustom from '@components/safeArea';
import {SelectComponent} from '@components/select';
import {baseURL} from '@config/intance';
import {AddAccountStore} from '@config/store';
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Badge,
  BadgeIcon,
  BadgeText,
  ButtonText,
  CloseIcon,
  GlobeIcon,
  HStack,
  Heading,
  Icon,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ScrollView,
  Text,
  Modal,
  VStack,
  Button,
  View,
  RefreshControl,
  Spinner,
} from '@gluestack-ui/themed';
import {useNavigation} from '@react-navigation/native';
import {
  deleteAccount,
  getUser,
  getUserId,
  newAccount,
  resetPassword,
  updateUser,
} from '@services/User';
import userInterface from '@services/User/interface';
import registerInterface from '@services/User/interface';
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {TouchableOpacity} from 'react-native';
import Snackbar from 'react-native-snackbar';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ManageUser = () => {
  const [userData, setUserData] = useState<userInterface[]>([]);
  const [userId, setUserId] = useState<userInterface>();
  const {add, setAdd} = AddAccountStore();
  const [showModal, setShowModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('');
  const [url, setUrl] = useState('');
  const [edit, setEdit] = useState(false);
  const [load, setLoad] = useState(true);
  const ref = React.useRef(null);
  const [search, setSearch] = useState('');
  const navigation = useNavigation<any>();

  interface selectInterface {
    label: string;
    value: string;
  }
  const prefixData: selectInterface[] = [
    {label: 'superadmin', value: 'superadmin'},
    {label: 'admin', value: 'admin'},
    {label: 'user', value: 'user'},
  ];
  const errorFunc = (message: string) => {
    console.log(message);
  };
  const getUserFunc = async () => {
    try {
      const response = await getUser(errorFunc);
      if (response?.status) {
        setUserData(response?.data);
      }
    } catch (error) {
      console.log('getRequestFunc error conection', error);
    }
  };
  const getUserFuncId = async (id?: number) => {
    try {
      const response = await getUserId(errorFunc, id);
      if (response?.status) {
        setUserId(response?.data);
        setEmail(response?.data?.email);
        setName(response?.data?.name);
        setRole(response?.data?.role);
        setUrl(response?.data?.url);
        setLoad(false);
      }
    } catch (error) {
      console.log('getUserFuncId error conection', error);
      setLoad(false);
    }
  };
  const resetPasswordFunc = async (mail?: string) => {
    try {
      const response = await resetPassword(errorFunc, mail, '123456', '123456');
      if (response?.status) {
        setShowModal(false);
        setEdit(false);
        Snackbar.show({
          text: mail + ' ' + response.message,
          backgroundColor: '#348352',
          duration: 1500,
        });
      }
    } catch (error) {
      console.log('resetPasswordFunc error conection', error);
    }
  };
  const updateProfileFunc = async (id?: number) => {
    const params: userInterface = {
      url: url,
      email: email,
      name: name,
      role: role,
    };
    try {
      const response = await updateUser(errorFunc, id, params);
      if (response?.status) {
        console.log();
        setShowModal(false);
        setEdit(false);
        getUserFunc();
        Snackbar.show({
          text: 'Account Updated Succesfull',
          backgroundColor: '#348352',
          duration: 1500,
        });
      }
    } catch (error) {
      console.log('updateProfileFunc log', error);
      if (axios.isAxiosError(error) && error?.response) {
        const response = error.response.data;
        const errorMessages = [
          response.email?.[0],
          response.name?.[0],
          response.role?.[0],
        ].filter(Boolean);
        const combinedMessage = errorMessages.join('\n');
        Snackbar.show({
          text: combinedMessage,
          backgroundColor: '#f43f5e',
          duration: 2000,
        });
      } else {
        console.error('An unexpected error occurred', error);
      }
    }
  };
  const deleteAccountFunc = async (id?: number) => {
    try {
      const response = await deleteAccount(errorFunc, id);
      if (response?.status) {
        setShowModal(false);
        setEdit(false);
        getUserFunc();
        Snackbar.show({
          text: response.message,
          backgroundColor: '#348352',
          duration: 1500,
        });
      }
    } catch (error) {
      console.log('resetPasswordFunc error conection', error);
    }
  };
  const deleteActionFunc = (id?: number) => {
    Snackbar.show({
      text: 'You want delete this account?',
      duration: 2000,
      action: {
        text: 'Delete',
        textColor: 'red',
        onPress: () => deleteAccountFunc(id),
      },
    });
  };
  const newAccountFunc = async () => {
    try {
      const param: registerInterface = {
        name: name,
        email: email,
        role: role,
        password: password,
        password_confirmation: confirmPassword,
      };
      console.log(param);
      const response = await newAccount(errorFunc, param);
      if (response?.status) {
        setShowModal(false);
        setEdit(false);
        setAdd(false);
        getUserFunc();
        Snackbar.show({
          text: response.message,
          backgroundColor: '#348352',
          duration: 1500,
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error?.response) {
        const response = error.response.data;
        const errorMessages = [
          response.email?.[0],
          response.name?.[0],
          response.role?.[0],
          response.password?.[0],
          response.password_confirmation?.[0],
        ].filter(Boolean);
        const combinedMessage = errorMessages.join('\n');
        Snackbar.show({
          text: combinedMessage,
          backgroundColor: '#f43f5e',
          duration: 2000,
        });
      } else {
        console.error('An unexpected error occurred', error);
      }
    }
  };
  useEffect(() => {
    getUserFunc();
  }, []);
  useEffect(() => {
    add && setShowModal(true);
    add && setEmail('');
    add && setName('');
    add && setRole('');
    add && setUrl('');
    add && setPassword('');
    add && setConfirmPassword('');
    add && setEdit(true);
  }, [add]);
  const onRefresh = () => {
    setRefreshing(true);
    getUserFunc().then(() => setRefreshing(false));
  };
  const handleSearch = async (value: string) => {
    setSearch(value);
    console.log('value', value);
    const responseall = await getUser(errorFunc);
    if (value === '') {
      getUserFunc();
    } else {
      const filteredData = responseall?.data.filter(
        item =>
          item.name.toLowerCase().includes(value.toLowerCase()) ||
          item.email.toLowerCase().includes(value.toLowerCase()),
      );
      setUserData(filteredData);
    }
  };
  return (
    <SafeAreaCustom>
      <VStack paddingHorizontal={16} space="xl" mt={20} pb={80}>
        <InputDefault
          showIcon={true}
          iconElement={<IconCustom As={Ionicons} name="search" size={20} />}
          changeText={value => handleSearch(value)}
          placeHolder="Search"
          value={search}
          size="lg"
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          {userData?.length > 0 ? (
            <VStack space="md">
              {userData.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setShowModal(true);
                    getUserFuncId(item?.id);
                  }}
                  style={{
                    padding: 16,
                    backgroundColor: '#0077E6',
                    borderRadius: 10,
                  }}>
                  <HStack
                    space="md"
                    alignItems="center"
                    justifyContent="space-between">
                    <VStack>
                      <Text color="white" bold>
                        {item.name}
                      </Text>
                      <Text color="white" size="sm">
                        {item.email}
                      </Text>
                      <HStack mt={10}>
                        <Badge size="md" borderRadius={20} action="warning">
                          <BadgeText>{item.role}</BadgeText>
                        </Badge>
                      </HStack>
                    </VStack>
                    <Avatar>
                      <AvatarFallbackText>SS</AvatarFallbackText>
                      {(item.url?.length as number) > 0 && (
                        <AvatarImage
                          alt={item.name}
                          source={{
                            uri: `${baseURL}${item.url}`,
                          }}
                        />
                      )}
                    </Avatar>
                  </HStack>
                </TouchableOpacity>
              ))}
            </VStack>
          ) : (
            <View alignSelf="center" mt={20}>
              {load ? (
                <Spinner size="small" />
              ) : (
                <Text size="xs">Data No Available</Text>
              )}
            </View>
          )}
          <Modal
            isOpen={showModal}
            onClose={() => {
              setShowModal(false);
              setEdit(false);
              setAdd(false);
            }}
            finalFocusRef={ref}>
            <ModalBackdrop />
            <ModalContent>
              <ModalHeader>
                <Heading size="lg">
                  {edit && add
                    ? 'Add Account'
                    : edit
                    ? 'Edit Account'
                    : userId?.name}
                </Heading>
                <ModalCloseButton>
                  <Icon as={CloseIcon} />
                </ModalCloseButton>
              </ModalHeader>
              <ModalBody>
                {edit ? (
                  <VStack space="md">
                    <InputDefault
                      label="Name"
                      defaultValue={name}
                      changeText={value => setName(value)}
                    />
                    <InputDefault
                      label="Email"
                      defaultValue={email}
                      changeText={value => setEmail(value)}
                    />
                    <SelectComponent
                      label="Role"
                      valueChange={value => setRole(value)}
                      selectDefault={role}
                      data={prefixData}
                    />
                    {add && (
                      <>
                        <InputDefault
                          label="Password"
                          defaultValue={password}
                          changeText={value => setPassword(value)}
                        />
                        <InputDefault
                          label="Confirm Password"
                          defaultValue={confirmPassword}
                          changeText={value => setConfirmPassword(value)}
                        />
                      </>
                    )}
                  </VStack>
                ) : (
                  <VStack>
                    <Text size="sm">{userId?.email}</Text>
                    <HStack mt={10}>
                      <Badge size="md" borderRadius={20} action="info">
                        <BadgeText>{userId?.role}</BadgeText>
                      </Badge>
                    </HStack>
                  </VStack>
                )}
              </ModalBody>
              <ModalFooter>
                {edit ? (
                  <>
                    {!add && (
                      <Button
                        size="sm"
                        action="secondary"
                        mr="$3"
                        onPress={() => resetPasswordFunc(userId?.email)}>
                        <ButtonText>Reset Password</ButtonText>
                      </Button>
                    )}
                    {add ? (
                      <Button
                        size="sm"
                        action="positive"
                        borderWidth="$0"
                        onPress={newAccountFunc}>
                        <ButtonText>Save</ButtonText>
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        action="positive"
                        borderWidth="$0"
                        onPress={() => updateProfileFunc(userId?.id)}>
                        <ButtonText>Save</ButtonText>
                      </Button>
                    )}
                  </>
                ) : (
                  <>
                    <Button
                      size="sm"
                      action="negative"
                      mr="$3"
                      onPress={() => deleteActionFunc(userId?.id)}>
                      <ButtonText>Delete</ButtonText>
                    </Button>

                    <Button
                      size="sm"
                      action="primary"
                      borderWidth="$0"
                      onPress={() => {
                        setEdit(true);
                      }}>
                      <ButtonText>Edit</ButtonText>
                    </Button>
                  </>
                )}
              </ModalFooter>
            </ModalContent>
          </Modal>
        </ScrollView>
      </VStack>
    </SafeAreaCustom>
  );
};

export {ManageUser};
