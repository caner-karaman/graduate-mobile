import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {PopMaximalismScreen} from './src/screens/PopMaximalismScreen';
import './global.css';

export const App = () => {
  return (
    <SafeAreaProvider>
      <PopMaximalismScreen />
    </SafeAreaProvider>
  );
};


