"use server";

import { ActionResponse, SignInUserData, SignUpUserData } from "@/types";
import { signInSchema, signUpSchema } from "@/modules/auth/validators/auth.validator";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const signInUser = async ( data: SignInUserData ): Promise<ActionResponse<any>> => {
    const validated = signInSchema.safeParse(data);
    if (!validated.success) {
        return {
            success: false,
            message: validated.error.issues.map((e) => e.message).join(", "),
        };
    }

    try {
        const res = await auth.api.signInEmail({
            body: {
                email: validated.data.email,
                password: validated.data.password,
                rememberMe: true,
                callbackURL: "/",
            },
            headers: await headers(),
            asResponse: true,
        });

        const result = await res.json();

        if (!res.ok) {
            return {
                success: false,
                message: result?.message || "Login failed",
            };
        }

        return {
            success: true,
            data: result,
            message: "Login successful 🎉",
        };
    } catch (error) {
        console.error("ERROR:: ", error);
        return {
            success: false,
            message: "Something went wrong. Try again!",
        };
    }
};

export const signUpUser = async (data: SignUpUserData) => {
    const validated = signUpSchema.safeParse(data);

    if (!validated.success) {
        return {
            success: false,
            message: validated.error.issues.map((e) => e.message).join(", "),
        };
    }

    try {
        const res = await auth.api.signUpEmail({
            body: {
                ...validated.data,
                callbackURL: "/",
            },
            headers: await headers(),
            asResponse: true,
        });

        const result = await res.json();

        if (!res.ok) {
            return {
                success: false,
                message: result?.message || "Signup failed",
            };
        }

        return {
            success: true,
            data: result,
            message: "Signup successful 🎉",
        };
    } catch (error) {
        console.error("SIGNUP ERROR:: ", error);
        return {
            success: false,
            message: "Something went wrong!",
        };
    }
};

export const signOutUser = async () => {
    try {
        await auth.api.signOut({
            headers: await headers(),
        });
    } catch (error) {
        console.error("Error in SignOut:: ", error);
    }
};