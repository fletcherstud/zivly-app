import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';
import { useUser } from '../context/UserContext';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

export default function HomeScreen() {
  const { user, signOut } = useUser();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <StyledView className="flex-1 bg-secondary">
      {/* Header */}
      <StyledView className="bg-primary pt-16 px-6 pb-8 rounded-b-[32px]">
        <StyledText className="text-3xl font-bold text-white mb-2">
          Welcome back,
        </StyledText>
        <StyledText className="text-2xl text-white">
          {user?.firstName} {user?.lastName}
        </StyledText>
      </StyledView>

      {/* Content */}
      <StyledView className="flex-1 px-6 py-8">
        <StyledView className="bg-white/90 rounded-2xl p-6 shadow-sm">
          <StyledText className="text-lg font-medium text-gray-800 mb-2">
            Your Profile
          </StyledText>
          <StyledText className="text-gray-600 mb-1">
            Email: {user?.email}
          </StyledText>
          <StyledText className="text-gray-600">
            Member since: {new Date(user?.createdAt || '').toLocaleDateString()}
          </StyledText>
        </StyledView>

        {/* Sign Out Button */}
        <StyledTouchableOpacity
          className="bg-red-500 py-4 px-6 rounded-full mt-8"
          onPress={handleSignOut}
        >
          <StyledText className="text-white text-center font-semibold">
            Sign Out
          </StyledText>
        </StyledTouchableOpacity>
      </StyledView>
    </StyledView>
  );
} 