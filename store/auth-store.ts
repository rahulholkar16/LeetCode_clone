import { AuthState } from "@/types";
import { create } from "zustand";

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,

    setUser: (user) => set({
        user,
        isAuthenticated: true
    }),
    logout: () => set({
        user: null,
        isAuthenticated: false,
    }),
}));