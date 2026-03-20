"use client";

import { signInUser, signOutUser, signUpUser } from "@/modules/auth/api/auth.api";
import { useAuthStore } from "@/modules/auth/store/auth-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchSession } from "@/modules/auth/api/session.api"; // make sure this exists

export const useAuth = () => {
    const setUser = useAuthStore((s) => s.setUser);
    const logout = useAuthStore((s) => s.logout);

    const queryClient = useQueryClient(); // ✅ correct

    // ✅ SIGN IN
    const signInMutation = useMutation({
        mutationFn: signInUser,

        onSuccess: async (res) => {
            if (!res.success) {
                toast.error(res.message);
                return;
            }

            toast.success(res.message);

            // ✅ fetch session correctly
            const session = await queryClient.fetchQuery({
                queryKey: ["session"],
                queryFn: fetchSession,
            });
            console.log("USER:: ", session?.user);
            
            setUser(session?.user || null);
        },

        onError: (error) => {
            console.error("ERR:: ", error);
            toast.error("Unexpected error occurred");
        },
    });

    // ✅ SIGN UP
    const signUpMutation = useMutation({
        mutationFn: signUpUser,

        onSuccess: (res) => {
            if (!res?.success) {
                toast.error(res?.message || "Signup failed");
                return;
            }

            toast.success(res.message || "Signup successful 🎉");
        },
    });

    // ✅ SIGN OUT
    const signOutMutation = useMutation({
        mutationFn: signOutUser,

        onSuccess: async () => {
            logout();

            // optional: clear cache
            queryClient.clear();
        },
    });

    return {
        signIn: signInMutation.mutateAsync,
        signUp: signUpMutation.mutateAsync,
        signOut: signOutMutation.mutateAsync,

        isSigningIn: signInMutation.isPending,
        isSigningUp: signUpMutation.isPending,
        isSigningOut: signOutMutation.isPending,

        error: signInMutation.error,
    };
};