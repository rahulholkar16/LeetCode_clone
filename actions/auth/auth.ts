"use server";

import { SignInUserData, SignUpUserData } from "@/types";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const signUpUser = async (data: SignUpUserData) => {
    const { email, name, password } = data;
    try {
        const res = await auth.api.signUpEmail({
            body: {
                email, password, name
            },
        });
        return {
            success: true,
            data: res,
        };
    } catch (error: any) {
        console.error("Sign up failed:: ", error);
        return {
            success: false,
            message: error?.message || "Signup failed",
        };
    }
};

export const signInUser = async (data: SignInUserData) => {
    const { email, password } = data;
    try {
        const res = await auth.api.signInEmail({
            body: {
                email,
                password,
                rememberMe: true,
                callbackURL: "http://localhost:3000",
            },
            headers: await headers(),
        });
        return {
            success: true,
            data: res
        }
    } catch (error: any) {
        console.error("Sign in failed:: ", error);
        return {
            success: false,
            message: error?.message || "Signin failed",
        };
    }
};