"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { headers } from "next/headers";
export const getCurrentUserData = async () => {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        const user = db.user.findUnique({
            where: { id: session?.user?.id },
            include: {
                solvedProblems: true,
                submission: true,
                playlists: true,
                stats: true,
            },
        });
        return user;
    } catch (error) {
        console.error("Error fetching current user data:", error);
    }
}