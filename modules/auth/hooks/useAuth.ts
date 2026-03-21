"use client";

import { signInUser, signOutUser, signUpUser } from "@/modules/auth/api/auth.api";
import { useAuthStore } from "@/modules/auth/store/auth-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchSession } from "@/modules/auth/api/session.api"; // make sure this exists
import { useRouter } from "next/navigation";

export const useAuth = () => {
    const setUser = useAuthStore((s) => s.setUser);
    const logout = useAuthStore((s) => s.logout);
    const router = useRouter();
    const queryClient = useQueryClient();

    const signInMutation = useMutation({
        mutationFn: signInUser,

        onSuccess: async (res) => {
            if (!res.success) {
                toast.error(res.message);
                return;
            }

            toast.success(res.message);

            const session = await queryClient.fetchQuery({
                queryKey: ["session"],
                queryFn: fetchSession,
            });
            console.log("USER:: ", session?.user);
            setUser(session?.user || null);
            router.push("/");
        },

        onError: (error) => {
            console.error("ERR:: ", error);
            toast.error("Unexpected error occurred");
        },
    });

    const signUpMutation = useMutation({
        mutationFn: signUpUser,

        onSuccess: (res) => {
            if (!res?.success) {
                toast.error(res?.message || "Signup failed");
                return;
            }
            toast.success("Signup successful 🎉");
            router.push("/sign-in");
        },
    });

    const signOutMutation = useMutation({
        mutationFn: signOutUser,
        onSuccess: async () => {
            logout();
            queryClient.removeQueries({ queryKey: ["session"] });
            toast.success("Log out successfully.");
            router.push("/sign-in");
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