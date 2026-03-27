"use server";

import { db } from "@/lib/db";

export const getAllProblem = async () => {
    try {
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

export const getProblemById = async (id: string) => {
    try {
        const problem = await db.problem.findUnique({
            where: {
                id: id
            }
        });

        return {
            success: true,
            message: "Problem fetched successfully",
            data: problem,
        };
    } catch (error) {
        console.error("Error fetching problem:", error);

        return {
            success: false,
            message: "Something went wrong while fetching problem",
        };
    }
};