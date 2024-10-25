import {InputDefault} from '@components/input/inputDefault';
import {InputPassword} from '@components/input/inputPassword';
import SafeAreaCustom from '@components/safeArea';
import {ChangePasswordStore, TokenJwt} from '@config/store';
import {VStack} from '@gluestack-ui/themed';
import {useNavigation} from '@react-navigation/native';
import {logoutService} from '@services/Login/services';
import {changePasswordService} from '@services/User';
import React, {useEffect, useState} from 'react';
import Snackbar from 'react-native-snackbar';

const ChangePasswordScreen = () => {
  const [currenPassword, setCurrenPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPasswordNew, setShowPasswordNew] = useState(false);
  const [showPasswordCurrent, setShowPasswordCurrent] = useState(false);
  const {setToken} = TokenJwt();
  const {change, setChange} = ChangePasswordStore();
  const navigation = useNavigation<any>();
  const handleStateNew = () => {
    setShowPasswordNew(showState => {
      return !showState;
    });
  };
  const handleStateCurrent = () => {
    setShowPasswordCurrent(showState => {
      return !showState;
    });
  };
  const errorFunc = (message: string) => {
    console.log(message);
  };

  const updatePasswordFunc = async () => {
    try {
      const response = await changePasswordService(
        errorFunc,
        currenPassword,
        newPassword,
      );
      if (response?.status) {
        setToken(response?.token);
        setChange(false);
        Snackbar.show({
          text: 'Password Updated Succesfull',
          backgroundColor: '#348352',
          duration: 1500,
        });
        navigation.goBack();
      }
    } catch (error) {
      console.log('updateProfileFunc error conection', error);
      setChange(false);
    }
  };
  useEffect(() => {
    change && updatePasswordFunc();
  }, [change]);
  return (
    <SafeAreaCustom>
      <VStack paddingHorizontal={40} mt={20} space="lg">
        <InputPassword
          onChange={value => setCurrenPassword(value)}
          label="Current Password"
          handle={handleStateCurrent}
          borderColor="#a8a29e"
          size="xl"
          iconColor="#C1C7D0"
          show={showPasswordCurrent}
          value={currenPassword}
        />
        <InputPassword
          size="xl"
          onChange={value => setNewPassword(value)}
          label="New Password"
          borderColor="#a8a29e"
          iconColor="#C1C7D0"
          value={newPassword}
          show={showPasswordNew}
          handle={handleStateNew}
        />
      </VStack>
    </SafeAreaCustom>
  );
};

export {ChangePasswordScreen};
