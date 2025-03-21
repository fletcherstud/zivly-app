import React from 'react';
import { View, Text, TouchableOpacity, Alert, Image } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../types/navigation';
import { styled } from 'nativewind';
import { AppleSignInButton } from '../components/AppleSignInButton';
import * as AppleAuthentication from 'expo-apple-authentication';
import axios from 'axios';
import { useUser } from '../context/UserContext';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledImage = styled(Image);

type WelcomeScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Welcome'>;
};

export default function WelcomeScreen({ navigation }: WelcomeScreenProps) {
  const { signIn } = useUser();

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

      // Only include user if fullName has non-null fields or email is present
      const hasValidName = fullName && (fullName.givenName || fullName.familyName);
      if (hasValidName || email) {
        data.user = JSON.stringify({
          firstName: fullName?.givenName || undefined,
          lastName: fullName?.familyName || undefined,
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
      // Update user context instead of navigating
      await signIn(response.data);
    } catch (error) {
      console.error('Authentication error:', error);
      Alert.alert('Error', 'Failed to sign in with Apple');
    }
  };

  return (
    <StyledView className="flex-1 bg-primary">
      {/* Background Pattern */}
      <StyledView className="absolute top-0 left-0 right-0 h-3/4 opacity-20">
        <StyledView className="absolute top-[10%] right-[15%] w-24 h-24 rounded-full bg-white opacity-25" />
        <StyledView className="absolute top-[20%] left-[10%] w-16 h-16 rounded-full bg-white opacity-20" />
        <StyledView className="absolute top-[40%] right-[25%] w-20 h-20 rounded-full bg-white opacity-15" />
      </StyledView>

      {/* Content */}
      <StyledView className="flex-1 justify-between">
        {/* Top Section */}
        <StyledView className="pt-16 px-6">
          <StyledText className="text-2xl font-bold text-white">
            zivly
          </StyledText>
        </StyledView>

        {/* Bottom Section with White Background */}
        <StyledView className="bg-secondary rounded-t-[32px] px-6 pt-8 pb-12">
          <StyledText className="text-3xl font-bold text-gray-800 mb-3">
            Find Your Perfect Match
          </StyledText>
          <StyledText className="text-gray-600 text-lg mb-8">
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
            <StyledView className="flex-1 h-[1px] bg-gray-200" />
            <StyledText className="mx-4 text-gray-400">or</StyledText>
            <StyledView className="flex-1 h-[1px] bg-gray-200" />
          </StyledView>

          <StyledTouchableOpacity
            className="bg-primary w-full py-4 rounded-full mb-4"
            onPress={() => navigation.navigate('SignUp')}
          >
            <StyledText className="text-white text-center text-lg font-semibold">
              Get Started
            </StyledText>
          </StyledTouchableOpacity>

          <StyledTouchableOpacity
            className="w-full"
            onPress={() => navigation.navigate('Login')}
          >
            <StyledText className="text-primary text-center text-base">
              Already have an account?
            </StyledText>
          </StyledTouchableOpacity>
        </StyledView>
      </StyledView>
    </StyledView>
  );
} 