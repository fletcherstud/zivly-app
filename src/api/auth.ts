import { apiClient } from './client';

interface SignUpData {
  email: string;
  birthDate: string; // ISO date string
  firstName: string;
  lastName: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

export const authApi = {
  signUp: async (data: SignUpData) => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginData): Promise<UserCreateResponse> => {
    const response = await apiClient.post('/auth/login', data);
    
    // // Store the token in the client headers for future requests
    // if (response.data.token) {
    //   apiClient.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    // }
    
    return response.data as UserCreateResponse;
  },

  getUser: async (): Promise<UserResponse> => {
    const response = await apiClient.get('/auth/user');
    return response.data as UserResponse;
  },
}; 