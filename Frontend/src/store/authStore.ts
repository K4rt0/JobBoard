import {create} from "zustand";
import {persist, createJSONStorage} from "zustand/middleware";
import {loginApi, loginGoogleApi, registerApi} from "@/services/authService";
import axios from "axios";
import {TokenResponse} from "@react-oauth/google";
import { User } from "@/interfaces";

interface AuthState {
    user: User | null;
    login: (username: string, password: string) => Promise<void>;
    register: (
        username: string,
        email: string,
        password: string,
    ) => Promise<void>;
    loginWithGoogle: (tokenResponse: TokenResponse) => Promise<void>;
    refreshAccessToken: () => Promise<void>;
    logout: () => void;
}

// Hàm set Authorization vào Axios
const setAuthHeader = (token: string | null) => {
    if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete axios.defaults.headers.common["Authorization"];
    }
};

// Store Zustand với persist và JSON storage
export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,

            /**
             * Đăng nhập với username/password
             */
            login: async (username, password) => {
                try {
                    const response = await loginApi(username, password);

                    const userData: User = {
                        id: response.userId,
                        username: response.username,
                        email: response.email,
                        accessToken: response.accessToken,
                        refreshToken: response.refreshToken,
                        avatar: response.avatar || "",
                        name: response.name || "",
                    };

                    set({user: userData});
                    setAuthHeader(userData.accessToken);
                } catch (error) {
                    if (axios.isAxiosError(error)) {
                        throw error.response?.data?.message || "Login failed";
                    }
                    throw new Error("An unexpected error occurred");
                }
            },

            /**
             * Đăng ký tài khoản mới
             */
            register: async (username, email, password) => {
                try {
                    const response = await registerApi({
                        username,
                        email,
                        password,
                    });

                    const userData: User = {
                        id: response.userId,
                        username: response.username,
                        email: response.email,
                        accessToken: response.accessToken,
                        refreshToken: response.refreshToken,
                        avatar: response.avatar || "",
                        name: response.name || "",
                    };

                    set({user: userData});
                    setAuthHeader(userData.accessToken);
                } catch (error) {
                    if (axios.isAxiosError(error)) {
                        throw (
                            error.response?.data?.message ||
                            "Registration failed"
                        );
                    }
                    throw new Error("An unexpected error occurred");
                }
            },

            /**
             * Đăng nhập bằng Google OAuth
             */
            loginWithGoogle: async (tokenResponse: TokenResponse) => {
                try {
                    if (!tokenResponse.access_token) {
                        throw new Error(
                            "Google login failed. No access token received.",
                        );
                    }

                    // Gửi Access Token của Google đến backend để xác thực
                    const response = await loginGoogleApi(
                        tokenResponse.access_token,
                    );

                    const userData: User = {
                        id: response.userId,
                        username: response.username,
                        email: response.email,
                        accessToken: response.accessToken,
                        refreshToken: response.refreshToken,
                        avatar: response.avatar || "",
                        name: response.name || "",
                    };

                    set({user: userData});
                    setAuthHeader(userData.accessToken);
                } catch (error) {
                    throw new Error("Google login failed. Try again!");
                }
            },

            /**
             * Refresh Access Token bằng Refresh Token
             */
            refreshAccessToken: async () => {
                try {
                    const user = get().user;
                    if (!user || !user.refreshToken) {
                        throw new Error("No refresh token available");
                    }

                    const response = await axios.post(
                        `${process.env.REACT_APP_BASE_API_URL}/auth/refresh`,
                        {
                            refreshToken: user.refreshToken,
                        },
                    );

                    const newAccessToken = response.data.accessToken;

                    set((state) => ({
                        user: state.user
                            ? {...state.user, accessToken: newAccessToken}
                            : null,
                    }));

                    setAuthHeader(newAccessToken);
                } catch (error) {
                    console.error("Refresh token failed:", error);
                    get().logout();
                }
            },

            /**
             * Đăng xuất người dùng
             */
            logout: () => {
                set({user: null});
                setAuthHeader(null);
            },
        }),
        {
            name: "auth-storage",
            storage: createJSONStorage(() => localStorage),
        },
    ),
);
