import React from 'react';
import * as AppleAuthentication from 'expo-apple-authentication';
import { styled } from 'nativewind';

const StyledView = styled(AppleAuthentication.AppleAuthenticationButton);

interface AppleSignInButtonProps {
  onSuccess?: (credential: AppleAuthentication.AppleAuthenticationCredential) => void;
  onError?: (error: Error | { code: string }) => void;
}

export const AppleSignInButton: React.FC<AppleSignInButtonProps> = ({ onSuccess, onError }) => {
  const handleAppleSignIn = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      onSuccess?.(credential);
    } catch (e) {
      if ((e as { code: string }).code === 'ERR_CANCELED') {
        console.log('User canceled the sign-in flow');
      } else {
        console.error('Sign-in error:', e);
        onError?.(e as Error | { code: string });
      }
    }
  };

  return (
    <StyledView
      buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
      buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
      cornerRadius={5}
      className="w-full h-12"
      onPress={handleAppleSignIn}
    />
  );
}; 