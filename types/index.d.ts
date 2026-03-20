import { ReactNode } from "react";

interface QueryProviderProp {
    children: ReactNode;
}

interface SignUpUserData {
    email: string;
    password: string;
    name: string;
}

interface SignInUserData {
    email: string;
    password: string;
}

type ActionResponse<T> = {
    success: boolean;
    data?: T;
    message?: string;
};

interface USER {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    emailVerified: boolean;
    name: string;
    image ?: string | null | undefined;
};

type AuthState = {
    user: USER | null;
    isAuthenticated: boolean;
    setUser: (user: USER | null) => void;
    logout: () => void;
};