"use server";

import { ActionResponse, SignInUserData, SignUpUserData } from "@/types";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { signInSchema, signUpSchema } from "@/lib/validators/auth.validator";

const handleError = (error: unknown): ActionResponse<null> => {
    const message = error instanceof Error ? error.message : "Something went wrong";

    return {
        success: false,
        message,
    };
};

export const signUpUser = async (data: SignUpUserData): Promise<ActionResponse<any>> => {
    const validated = signUpSchema.safeParse(data);

    if (!validated.success) {
        return {
            success: false,
            message: validated.error.issues[0].message,
        };
    }

    const { email, password, name } = validated.data;
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

export const signInUser = async (data: SignInUserData): Promise<ActionResponse<any>> => {
    const validated = signInSchema.safeParse(data);

    if (!validated.success) return {
        success: false,
        message: validated.error.issues[0].message
    }
    const { email, password } = validated.data;
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