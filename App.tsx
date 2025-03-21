import React from 'react';
import { UserProvider } from './src/context/UserContext';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  return (
    <UserProvider>
      <RootNavigator />
    </UserProvider>
  );
} 