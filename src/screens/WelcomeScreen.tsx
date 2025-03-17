import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { styled } from 'nativewind';
import { AppleSignInButton } from '../components/AppleSignInButton';
import * as AppleAuthentication from 'expo-apple-authentication';
import axios from 'axios';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

type WelcomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Welcome'>;
};

export default function WelcomeScreen({ navigation }: WelcomeScreenProps) {
  const handleAppleSignInSuccess = async (credential: AppleAuthentication.AppleAuthenticationCredential) => {
    try {
      const { authorizationCode, identityToken, fullName, email } = credential;

      if (!authorizationCode || !identityToken) {
        throw new Error('Missing required authentication data');
      }

      // Prepare data for backend
      const data: Record<string, string> = {
        code: authorizationCode,
        id_token: identityToken,
        state: 'xyz123', // Match your backend's expected state
      };

      if (fullName || email) {
        data.user = JSON.stringify({
          name: fullName ? `${fullName.givenName} ${fullName.familyName}` : undefined,
          email: email || undefined,
        });
      }

      // Send to backend
      const response = await axios.post(
        'https://d19d-2601-280-4201-490-d53c-b4cb-ebb1-e6c.ngrok-free.app/auth/oauth2/code/apple',
        new URLSearchParams(data).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      console.log('Backend response:', response.data);
      navigation.navigate('Home');
    } catch (error) {
      console.error('Authentication error:', error);
      Alert.alert('Error', 'Failed to sign in with Apple');
    }
  };

  return (
    <StyledView className="flex-1 bg-secondary">
      <StyledView className="flex-1 justify-center items-center px-6">
        <StyledText className="text-4xl font-bold text-primary mb-2">
          Welcome to Zivly
        </StyledText>
        <StyledText className="text-lg text-gray-600 text-center mb-8">
          Where meaningful connections happen naturally
        </StyledText>
        
        <AppleSignInButton
          onSuccess={handleAppleSignInSuccess}
          onError={(error) => {
            console.error('Apple Sign In Error:', error);
            Alert.alert('Error', 'Failed to sign in with Apple');
          }}
        />

        <StyledView className="w-full flex-row items-center my-4">
          <StyledView className="flex-1 h-[1px] bg-gray-300" />
          <StyledText className="mx-4 text-gray-500">or</StyledText>
          <StyledView className="flex-1 h-[1px] bg-gray-300" />
        </StyledView>

        <StyledTouchableOpacity
          className="bg-primary w-full py-4 rounded-full mb-4"
          onPress={() => navigation.navigate('SignUp')}
        >
          <StyledText className="text-white text-center text-lg font-semibold">
            Get Started with Email
          </StyledText>
        </StyledTouchableOpacity>

        <StyledTouchableOpacity
          className="bg-white w-full py-4 rounded-full border-2 border-primary"
          onPress={() => navigation.navigate('Login')}
        >
          <StyledText className="text-primary text-center text-lg font-semibold">
            Sign in with Email
          </StyledText>
        </StyledTouchableOpacity>
      </StyledView>
    </StyledView>
  );
} 