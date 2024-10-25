import React, { useEffect } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { GluestackUIProvider, useColorMode } from '@gluestack-ui/themed';
import { NavigatorScreen } from './src/navigation';
import { config } from './src/config/customTheme';
import { DarkModeStore } from '@config/store';

const App = () => {
  const colorMode = useColorMode();
  const isDarkMode = useColorScheme() === colorMode;
  const { mode, setMode } = DarkModeStore();

  const backgroundStyle = {
    backgroundColor: isDarkMode ? 'white' : 'black',
  };
  useEffect(() => {

  }, []);


  return (
    <>
      <StatusBar
        barStyle={isDarkMode ? 'dark-content' : 'light-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <GluestackUIProvider config={config} colorMode={mode ? 'dark' : 'light'}>
        <NavigatorScreen />
      </GluestackUIProvider>
    </>
  );
};

export default App;
