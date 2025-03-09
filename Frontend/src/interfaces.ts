export interface UserRequestDTO {
    username: string;
    email: string;
    password: string;
}

export interface User {
    id: string;
    username: string;
    email: string;
    accessToken: string;
    refreshToken: string;
    avatar?: string;
    name: string;
}
