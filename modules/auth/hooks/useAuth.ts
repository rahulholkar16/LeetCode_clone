"use client";

import { signInUser, signUpUser } from "@/modules/auth/api/auth.api";
import { useAuthStore } from "@/modules/auth/store/auth-store";
import { useMutation } from "@tanstack/react-query";

export const useAuth = () => {
    const setUser = useAuthStore(s => s.setUser);
    const signInMutation = useMutation({
        mutationFn: signInUser,
        onSuccess: (res) => {
            if (res.success) setUser(res.data.user)
        }
    });

    const signUpMutation = useMutation({
        mutationFn: signUpUser,
    });

    return {
        signIn: signInMutation.mutateAsync,
        signUp: signUpMutation.mutateAsync,

        isSigningIn: signInMutation.isPending,
        isSigningUp: signUpMutation.isPending,

        error: signInMutation.error,
    };
};