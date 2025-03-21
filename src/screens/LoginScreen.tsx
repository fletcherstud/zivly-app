import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList, RootStackParamList } from '../types/navigation';
import { styled } from 'nativewind';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { authApi } from '../api/auth';
import { useUser } from '../context/UserContext';
import { CompositeNavigationProp } from '@react-navigation/native';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledTextInput = styled(TextInput);
const StyledScrollView = styled(ScrollView);

type LoginScreenNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<AuthStackParamList, 'Login'>,
  NativeStackNavigationProp<RootStackParamList>
>;

type LoginScreenProps = {
  navigation: LoginScreenNavigationProp;
};

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn } = useUser();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsSubmitting(true);
      
      // Call login API
      const response = await authApi.login({
        email: data.email,
        password: data.password,
      });
      console.log(response);
      // Update user context
      await signIn(response);

      // The navigation will happen automatically due to the user context change
    } catch (error) {
      let errorMessage = 'Failed to sign in';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      Alert.alert(
        'Error',
        errorMessage,
        [
          {
            text: 'Try Again',
            style: 'cancel',
          },
        ]
      );
    } finally {
      setIsSubmitting(false);
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
          <StyledText className="text-3xl font-bold text-white">
            Welcome Back
          </StyledText>
        </StyledView>

        {/* Bottom Section with White Background */}
        <StyledView className="bg-secondary flex-1 rounded-t-[32px] px-6 pt-8 pb-12 mt-8">
          <StyledView className="space-y-6">
            <StyledView>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value } }) => (
                  <StyledTextInput
                    className="bg-white/50 p-4 rounded-xl border-0"
                    placeholder="Email"
                    value={value}
                    onChangeText={onChange}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                  />
                )}
              />
              {errors.email && (
                <StyledText className="text-red-500 text-sm mt-1 ml-1">
                  {errors.email.message}
                </StyledText>
              )}
            </StyledView>

            <StyledView>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value } }) => (
                  <StyledTextInput
                    className="bg-white/50 p-4 rounded-xl border-0"
                    placeholder="Password"
                    value={value}
                    onChangeText={onChange}
                    secureTextEntry
                    autoComplete="password"
                  />
                )}
              />
              {errors.password && (
                <StyledText className="text-red-500 text-sm mt-1 ml-1">
                  {errors.password.message}
                </StyledText>
              )}
            </StyledView>

            <StyledTouchableOpacity
              className="self-end"
              onPress={() => {
                Alert.alert('Coming Soon', 'Forgot password functionality will be available soon');
              }}
            >
              <StyledText className="text-primary font-medium">
                Forgot password?
              </StyledText>
            </StyledTouchableOpacity>

            <StyledTouchableOpacity
              className={`bg-primary w-full py-4 rounded-full mt-4 ${isSubmitting ? 'opacity-50' : ''}`}
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}
            >
              <StyledText className="text-white text-center text-lg font-semibold">
                {isSubmitting ? 'Signing in...' : 'Log in'}
              </StyledText>
            </StyledTouchableOpacity>

            <StyledView className="w-full flex-row items-center my-4">
              <StyledView className="flex-1 h-[1px] bg-gray-200" />
              <StyledText className="mx-4 text-gray-400">or</StyledText>
              <StyledView className="flex-1 h-[1px] bg-gray-200" />
            </StyledView>

            <StyledTouchableOpacity
              className="w-full"
              onPress={() => navigation.navigate('SignUp')}
            >
              <StyledText className="text-primary text-center">
                Sign up
              </StyledText>
            </StyledTouchableOpacity>
          </StyledView>
        </StyledView>
      </StyledView>
    </StyledView>
  );
} 