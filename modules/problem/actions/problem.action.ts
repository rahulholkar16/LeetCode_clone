"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { headers } from "next/headers";

export const getAllProblem = async () => {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) return {
            success: false,
            message: "Unauthorized",
        }

        const problems = await db.problem.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });

        return {
            success: true,
            message: "Problems fetched successfully",
            data: problems,
        };
    } catch (error) {
        console.error("Error fetching problems:", error);

        return {
            success: false,
            message: "Something went wrong while fetching problems",
        };
    }
};