import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { styled } from 'nativewind';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledTextInput = styled(TextInput);
const StyledScrollView = styled(ScrollView);

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      // TODO: Implement your login API call here
      console.log('Form submitted:', data);
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Error', 'Failed to sign in');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <StyledScrollView className="flex-1 bg-secondary">
      <StyledView className="flex-1 px-6 py-8">
        <StyledText className="text-3xl font-bold text-primary mb-2">
          Welcome Back
        </StyledText>
        <StyledText className="text-gray-600 mb-8">
          Sign in to continue your journey
        </StyledText>

        <StyledView className="space-y-4">
          <StyledView>
            <StyledText className="text-gray-700 mb-1">Email</StyledText>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <StyledTextInput
                  className="bg-white p-4 rounded-lg border border-gray-300"
                  placeholder="Enter your email"
                  value={value}
                  onChangeText={onChange}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              )}
            />
            {errors.email && (
              <StyledText className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </StyledText>
            )}
          </StyledView>

          <StyledView>
            <StyledText className="text-gray-700 mb-1">Password</StyledText>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <StyledTextInput
                  className="bg-white p-4 rounded-lg border border-gray-300"
                  placeholder="Enter your password"
                  value={value}
                  onChangeText={onChange}
                  secureTextEntry
                  autoComplete="password"
                />
              )}
            />
            {errors.password && (
              <StyledText className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </StyledText>
            )}
          </StyledView>

          <StyledTouchableOpacity
            className="self-end"
            onPress={() => {
              // TODO: Implement forgot password functionality
              Alert.alert('Coming Soon', 'Forgot password functionality will be available soon');
            }}
          >
            <StyledText className="text-primary">Forgot Password?</StyledText>
          </StyledTouchableOpacity>
        </StyledView>

        <StyledTouchableOpacity
          className={`bg-primary w-full py-4 rounded-full mt-8 ${isSubmitting ? 'opacity-50' : ''}`}
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          <StyledText className="text-white text-center text-lg font-semibold">
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </StyledText>
        </StyledTouchableOpacity>

        <StyledTouchableOpacity
          className="mt-4"
          onPress={() => navigation.navigate('SignUp')}
        >
          <StyledText className="text-primary text-center">
            Don't have an account? Sign up
          </StyledText>
        </StyledTouchableOpacity>
      </StyledView>
    </StyledScrollView>
  );
} 