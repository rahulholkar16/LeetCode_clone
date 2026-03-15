"use server";

import { SignUpUserData } from "@/types";
import { auth } from "../auth";

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