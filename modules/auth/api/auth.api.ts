import { SignInUserData, SignUpUserData } from "@/types";
import { signInSchema, signUpSchema } from "@/modules/auth/validators/auth.validator";

export const signInUser = async (data: SignInUserData) => {
    const validated = signInSchema.safeParse(data);
    if (!validated.success) return {
        success: false,
        message: validated.error.issues.map((e) => e.message).join(", ")
    }
    const res = await fetch("/api/auth/sign-in/email", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            ...validated.data,
            rememberMe: true,
            callbackURL: window.location.origin,
        }),
    });

    if (!res.ok) {
        throw new Error("Login failed");
    }

    return res.json();
};

export const signUpUser = async (data: SignUpUserData) => {
    const validated = signUpSchema.safeParse(data);
    if (!validated.success) return {
        success: false,
        message: validated.error.issues.map((e) => e.message).join(", "),
    };

    const res = await fetch("/api/auth/sign-up/email", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            ...validated.data,
            callbackURL: window.location.origin,
        }),
    });

    if (!res.ok) throw new Error("Signup failed");
    return res.json();
};
