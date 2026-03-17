"use server";

import { ActionResponse, SignInUserData, SignUpUserData } from "@/types";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const handleError = (error: unknown): ActionResponse<null> => {
    const message =
        error instanceof Error ? error.message : "Something went wrong";

    return {
        success: false,
        message,
    };
};

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
    } catch (error) {
        return handleError(error);
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
                callbackURL: process.env.BETTER_AUTH_URL,
            },
            headers: await headers(),
        });
        return {
            success: true,
            data: res
        }
    } catch (error) {
        return handleError(error);
    }
};