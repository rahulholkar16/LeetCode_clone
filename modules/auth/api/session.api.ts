"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const fetchSession = async () => {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });
        return session;
    } catch (error) {
        console.error("SESSION ERROR:: ", error);
        return null;
    }
};