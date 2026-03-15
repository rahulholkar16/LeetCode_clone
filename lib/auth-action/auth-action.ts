"use server";

import { SignUpUserData } from "@/types";
import { auth } from "../auth";

export const signUpUser = async (data: SignUpUserData) => {
    const { email, name, password } = data;
    return await auth.api.signUpEmail({
        body: {
            email, password, name
        },
        asResponse: true
    })
};