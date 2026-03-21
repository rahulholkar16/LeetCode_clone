import { authClient } from "@/lib/auth-client";

export const googleSignUp = async () => {
    await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
    });
};

export const githubSignUp = async () => {
    await authClient.signIn.social({
        provider: "github",
        callbackURL: "/",
    });
};