import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {PopMaximalismScreen} from '../screens/PopMaximalismScreen';
import {UploadSuccessScreen} from '../screens/UploadSuccessScreen';
import {ComparisonScanRevealScreen} from '../screens/ComparisonScanRevealScreen';
import {PopMaximalismResultScreen} from '../screens/PopMaximalismResultScreen';

export type AppStackParamList = {
  PopMaximalism: undefined;
  UploadSuccess: {imageUri: string};
  ComparisonScanReveal: {imageUri: string};
  PopMaximalismResult: {imageUri?: string};
};

const Stack = createNativeStackNavigator<AppStackParamList>();

export const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="PopMaximalism"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="PopMaximalism"
        component={PopMaximalismScreen}
      />
      <Stack.Screen
        name="UploadSuccess"
        component={UploadSuccessScreen}
      />
      <Stack.Screen
        name="ComparisonScanReveal"
        component={ComparisonScanRevealScreen}
      />
      <Stack.Screen
        name="PopMaximalismResult"
        component={PopMaximalismResultScreen}
      />
    </Stack.Navigator>
  );
};
