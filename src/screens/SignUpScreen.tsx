import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert, Platform } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { styled } from 'nativewind';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledTextInput = styled(TextInput);
const StyledScrollView = styled(ScrollView);

type SignUpScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'SignUp'>;
};

const signUpSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  birthday: z.date().refine((date: Date) => {
    const today = new Date();
    let age = today.getFullYear() - date.getFullYear();
    const monthDiff = today.getMonth() - date.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
      age--;
    }
    return age >= 18;
  }, 'You must be at least 18 years old'),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUpScreen({ navigation }: SignUpScreenProps) {
  const [showDatePicker, setShowDatePicker] = useState(Platform.OS === 'ios');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      birthday: new Date(Date.now() - (18 * 365 * 24 * 60 * 60 * 1000)), // Set default to 18 years ago
    },
  });

  const onSubmit = async (data: SignUpFormData) => {
    try {
      setIsSubmitting(true);
      // TODO: Implement your registration API call here
      console.log('Form submitted:', data);
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Error', 'Failed to create account');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <StyledScrollView className="flex-1 bg-secondary">
      <StyledView className="flex-1 px-6 py-8">
        <StyledText className="text-3xl font-bold text-primary mb-2">
          Create Account
        </StyledText>
        <StyledText className="text-gray-600 mb-8">
          Join Zivly and start your journey to meaningful connections
        </StyledText>

        <StyledView className="space-y-4">
          <StyledView>
            <StyledText className="text-gray-700 mb-1">First Name</StyledText>
            <Controller
              control={control}
              name="firstName"
              render={({ field: { onChange, value } }) => (
                <StyledTextInput
                  className="bg-white p-4 rounded-lg border border-gray-300"
                  placeholder="Enter your first name"
                  value={value}
                  onChangeText={onChange}
                  autoCapitalize="words"
                />
              )}
            />
            {errors.firstName && (
              <StyledText className="text-red-500 text-sm mt-1">
                {errors.firstName.message}
              </StyledText>
            )}
          </StyledView>

          <StyledView>
            <StyledText className="text-gray-700 mb-1">Last Name</StyledText>
            <Controller
              control={control}
              name="lastName"
              render={({ field: { onChange, value } }) => (
                <StyledTextInput
                  className="bg-white p-4 rounded-lg border border-gray-300"
                  placeholder="Enter your last name"
                  value={value}
                  onChangeText={onChange}
                  autoCapitalize="words"
                />
              )}
            />
            {errors.lastName && (
              <StyledText className="text-red-500 text-sm mt-1">
                {errors.lastName.message}
              </StyledText>
            )}
          </StyledView>

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
                  placeholder="Create a password"
                  value={value}
                  onChangeText={onChange}
                  secureTextEntry
                />
              )}
            />
            {errors.password && (
              <StyledText className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </StyledText>
            )}
          </StyledView>

          <StyledView>
            <StyledText className="text-gray-700 mb-1">Birthday</StyledText>
            <Controller
              control={control}
              name="birthday"
              render={({ field: { value } }) => (
                <>
                  {Platform.OS === 'ios' ? (
                    <DateTimePicker
                      value={value}
                      mode="date"
                      display="inline"
                      onChange={(event: DateTimePickerEvent, selectedDate?: Date) => {
                        if (selectedDate) {
                          setValue('birthday', selectedDate);
                        }
                      }}
                      maximumDate={new Date()}
                      accentColor="#FF6B8B"
                      textColor="#374151"
                      themeVariant="light"
                      style={{ height: 300, marginTop: -8 }}
                    />
                  ) : (
                    <>
                      <StyledTouchableOpacity
                        className="bg-white p-4 rounded-lg border border-gray-300"
                        onPress={() => setShowDatePicker(true)}
                      >
                        <StyledText className="text-gray-600">
                          {formatDate(value)}
                        </StyledText>
                      </StyledTouchableOpacity>
                      {showDatePicker && (
                        <DateTimePicker
                          value={value}
                          mode="date"
                          display="default"
                          onChange={(event: DateTimePickerEvent, selectedDate?: Date) => {
                            setShowDatePicker(false);
                            if (selectedDate) {
                              setValue('birthday', selectedDate);
                            }
                          }}
                          maximumDate={new Date()}
                        />
                      )}
                    </>
                  )}
                </>
              )}
            />
            {errors.birthday && (
              <StyledText className="text-red-500 text-sm mt-1">
                {errors.birthday.message}
              </StyledText>
            )}
          </StyledView>
        </StyledView>

        <StyledTouchableOpacity
          className={`bg-primary w-full py-4 rounded-full mt-8 ${isSubmitting ? 'opacity-50' : ''}`}
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          <StyledText className="text-white text-center text-lg font-semibold">
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </StyledText>
        </StyledTouchableOpacity>

        <StyledTouchableOpacity
          className="mt-4"
          onPress={() => navigation.navigate('Login')}
        >
          <StyledText className="text-primary text-center">
            Already have an account? Sign in
          </StyledText>
        </StyledTouchableOpacity>
      </StyledView>
    </StyledScrollView>
  );
} 