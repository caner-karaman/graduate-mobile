import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {View} from 'react-native';
import './global.css';

export const App = () => {
  return (
    <SafeAreaProvider>
      <View />
    </SafeAreaProvider>
  );
};

