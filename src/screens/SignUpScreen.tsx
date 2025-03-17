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
      birthday: new Date(Date.now() - (18 * 365 * 24 * 60 * 60 * 1000)),
    },
  });

  const onSubmit = async (data: SignUpFormData) => {
    try {
      setIsSubmitting(true);
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
            Create Account
          </StyledText>
        </StyledView>

        {/* Bottom Section with White Background */}
        <StyledScrollView className="bg-secondary rounded-t-[32px] px-6 pt-8 pb-12 mt-8">
          <StyledView className="space-y-6">
            <StyledView>
              <Controller
                control={control}
                name="firstName"
                render={({ field: { onChange, value } }) => (
                  <StyledTextInput
                    className="bg-white/50 p-4 rounded-xl border-0"
                    placeholder="First Name"
                    value={value}
                    onChangeText={onChange}
                    autoCapitalize="words"
                  />
                )}
              />
              {errors.firstName && (
                <StyledText className="text-red-500 text-sm mt-1 ml-1">
                  {errors.firstName.message}
                </StyledText>
              )}
            </StyledView>

            <StyledView>
              <Controller
                control={control}
                name="lastName"
                render={({ field: { onChange, value } }) => (
                  <StyledTextInput
                    className="bg-white/50 p-4 rounded-xl border-0"
                    placeholder="Last Name"
                    value={value}
                    onChangeText={onChange}
                    autoCapitalize="words"
                  />
                )}
              />
              {errors.lastName && (
                <StyledText className="text-red-500 text-sm mt-1 ml-1">
                  {errors.lastName.message}
                </StyledText>
              )}
            </StyledView>

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

            <StyledView>
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
                          className="bg-white/50 p-4 rounded-xl border-0"
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
                <StyledText className="text-red-500 text-sm mt-1 ml-1">
                  {errors.birthday.message}
                </StyledText>
              )}
            </StyledView>

            <StyledTouchableOpacity
              className={`bg-primary w-full py-4 rounded-full mt-4 ${isSubmitting ? 'opacity-50' : ''}`}
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}
            >
              <StyledText className="text-white text-center text-lg font-semibold">
                {isSubmitting ? 'Creating Account...' : 'Sign up'}
              </StyledText>
            </StyledTouchableOpacity>

            <StyledTouchableOpacity
              className="w-full"
              onPress={() => navigation.navigate('Login')}
            >
              <StyledText className="text-primary text-center">
                Log in
              </StyledText>
            </StyledTouchableOpacity>
          </StyledView>
        </StyledScrollView>
      </StyledView>
    </StyledView>
  );
} 