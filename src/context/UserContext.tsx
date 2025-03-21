import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { apiClient } from '../api/client';
import { authApi } from '../api/auth';

interface UserContextType {
  user: UserResponse | null;
  isLoading: boolean;
  signIn: (response: UserCreateResponse) => Promise<void>;
  signOut: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      
      if (token) {
        // Set the token in API client
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Fetch user data
        const userData = await authApi.getUser();
        setUser(userData);
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      // If there's an error (e.g., token expired), clear everything
      await signOut();
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (response: UserCreateResponse) => {
    try {
      const { userResponse, tokenResponse } = response;
      
      // Store tokens securely
      await Promise.all([
        SecureStore.setItemAsync(TOKEN_KEY, tokenResponse.accessToken),
        SecureStore.setItemAsync(REFRESH_TOKEN_KEY, tokenResponse.refreshToken),
      ]);

      // Set the token in API client
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${tokenResponse.accessToken}`;

      // Update context state with user data
      setUser(userResponse);
    } catch (error) {
      console.error('Error signing in:', error);
      throw new Error('Failed to sign in');
    }
  };

  const signOut = async () => {
    try {
      // Clear stored tokens
      await Promise.all([
        SecureStore.deleteItemAsync(TOKEN_KEY),
        SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
      ]);

      // Clear API client headers
      delete apiClient.defaults.headers.common['Authorization'];

      // Clear context state
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw new Error('Failed to sign out');
    }
  };

  return (
    <UserContext.Provider value={{ user, isLoading, signIn, signOut }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
} 