import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator } from 'react-native';
import { styled } from 'nativewind';
import { View } from 'react-native';
import { useUser } from '../context/UserContext';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';

const StyledView = styled(View);

export type RootStackParamList = {
  Auth: undefined;
  App: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <StyledView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </StyledView>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="App" component={AppNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
} 