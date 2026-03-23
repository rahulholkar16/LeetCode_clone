import { ReactNode } from "react";

interface QueryProviderProp {
    children: ReactNode;
}

interface SignInUserData {
    email: string;
    password: string;
}

interface SignUpUserData extends SignInUserData {
    name: string;
}

type ActionResponse<T> = {
    success: boolean;
    data?: T;
    message?: string;
};

export type Role = "USER" | "ADMIN";

interface USER {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    emailVerified: boolean;
    name: string;
    image?: string | null | undefined;
    role: Role;
};

type AuthState = {
    user: USER | null;
    isAuthenticated: boolean;
    setUser: (user: USER | null) => void;
    logout: () => void;
};

interface RootLayoutProp {
    children: ReactNode;
}

interface AvatarDropdownProp {
    user: USER | null;
}

interface AuthLayerProp {
    children: ReactNode
}

interface ProtectedLayerProp {
    children: ReactNode
}

interface ProtectedLayoutProp {
    children: ReactNode
}