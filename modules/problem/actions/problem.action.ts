"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { useAuthStore } from "@/modules/auth/store/auth-store";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { submissionQueue } from "../queue/queue";
import {
    createPendingSubmission,
    runJudge0TestCases,
    validateExecutionPayload,
} from "../services/submission.service";

export const getAllProblem = async () => {
    try {
        const { user } = useAuthStore.getState();

        const problems = await db.problem.findMany({
            orderBy: {
                createdAt: "desc",
            },
            include: {
                tags: { include: { tag: true } },
                solvedBy: {
                    where: {
                        userId: user?.id
                    }
                }
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
            },
            include: {
                tags: { include: { tag: true } },
                examples: true,
                snippets: true,
                solutions: true,
                testCases: { where: { isHidden: false } },
            },
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

export const deleteProblemById = async (id: string) => {
    try {
        const { user } = useAuthStore.getState();

        if (!user || user.role !== "ADMIN") {
            return {
                success: false,
                message: "Unauthorized: Only admins can delete problems",
            };
        };

        await db.problem.delete({
            where: { id }
        });

        revalidatePath("/problems");
        return {
            success: true,
            message: "Problems deleted successfully",
        };
    } catch (error) {
        console.error("Error Deleteing problem:", error);

        return {
            success: false,
            message: "Something went wrong while Deleteing problem",
        };
    }
};

export const runCode = async (
    source_code: string,
    language_id: number,
    stdin: Array<string>,
    expected_outputs: Array<string>,
) => {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session) {
            return {
                success: false,
                message: "Unauthorized",
            };
        }

        if (!source_code.trim()) {
            return {
                success: false,
                message: "Please write code before running.",
            };
        }

        if (!validateExecutionPayload(stdin, expected_outputs)) return {
            success: false,
            message: "Invalid testCases",
        }

        const { testCaseResult } = await runJudge0TestCases(
            source_code,
            language_id,
            stdin,
            expected_outputs,
        );

        return {
            success: true,
            testCaseResult,
        };
    } catch (error) {
        console.error("Error running code:", error);

        return {
            success: false,
            message: "Something went wrong.",
        };
    }
};

export const executeCode = async (source_code: string, language_id: number, stdin: Array<string>, expected_outputs: Array<string>, problem_id: string) => {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session) {
            return {
                success: false,
                message: "Unauthorized",
            };
        }

        if (!source_code.trim()) {
            return {
                success: false,
                message: "Please write code before submitting.",
            };
        }

        if (!validateExecutionPayload(stdin, expected_outputs)) return {
            success: false,
            message: "Invalid testCases",
        }

        const submission = await createPendingSubmission({
            userId: session.user.id,
            problemId: problem_id,
            sourceCode: source_code,
            languageId: language_id,
            stdin,
        });

        await submissionQueue.add("process-submission", {
            submissionId: submission.id,
            userId: session.user.id,
            problemId: problem_id,
            sourceCode: source_code,
            languageId: language_id,
            stdin,
            expectedOutputs: expected_outputs,
        });

        return {
            success: true,
            message: "Submission queued",
            submission,
        }
    } catch (error) {
        console.error("Error submitting code:", error);

        return {
            success: false,
            message: "Something went wrong.",
        };
    }
    
};

export const getSubmissionById = async (submissionId: string) => {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session) {
            return {
                success: false,
                message: "Unauthorized",
            };
        }

        if (!submissionId) return {
            success: false,
            message: "Submission Id is required.",
        }

        const submission = await db.submission.findFirst({
            where: {
                id: submissionId,
                userId: session.user.id,
            },
            include: {
                testCaseResult: {
                    orderBy: {
                        testCase: "asc",
                    },
                },
            },
        });

        if (!submission) return {
            success: false,
            message: "Submission not found.",
        }

        return {
            success: true,
            submission,
        };
    } catch (error) {
        console.error("Error fetching submission:", error);

        return {
            success: false,
            message: "Something went wrong.",
        };
    }
};

export const getAllSubmissionByUser = async (problemId: string) => {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session) {
            return {
                success: false,
                message: "Unauthorized",
            };
        }

        if (!problemId) return {
            success: false,
            messgae: "Problem Id is required."
        }

        const submissions = await db.submission.findMany({
            where: {
                userId: session.user.id,
                problemId,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        console.log("submission::", submissions);
        
        return {
            success: true,
            submissions,
            message: "Fetch successfully"
        }

    } catch (error) {
        console.error("Error::", error);

        return {
            success: false,
            message: "Something went wrong.",
        };
    }
};
