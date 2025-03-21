interface UserCreateResponse {
    userResponse: UserResponse,
    tokenResponse: AuthResponse
}

interface UserResponse {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    birthday: string;
    gender: string;
    createdAt: string;
    updatedAt: string;
}

interface AuthResponse {
    accessToken: string;
    refreshToken: string;
}

