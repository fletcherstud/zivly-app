import { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  SignUp: undefined;
};

export type AppStackParamList = {
  Home: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  App: NavigatorScreenParams<AppStackParamList>;
  Profile: undefined;
  Matches: undefined;
  Chat: { matchId: string };
}; 