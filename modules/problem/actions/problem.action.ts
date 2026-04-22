"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { pollBatchResults, submitBatch } from "@/lib/judge0";
import { useAuthStore } from "@/modules/auth/store/auth-store";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { getLanguageName } from "../constant";

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

const runJudge0TestCases = async (
    source_code: string,
    language_id: number,
    stdin: Array<string>,
    expected_outputs: Array<string>,
) => {
    const submissions = stdin.map((input) => ({
        source_code,
        language_id,
        stdin: input,
        base64_encode: false,
        wait: false,
    }));

    const submitResponse = await submitBatch(submissions);
    const tokens = submitResponse.map((res) => res.token);
    const results = await pollBatchResults(tokens);
    let allPassed = true;

    const testCaseResult = results.map((result, idx) => {
        const stdout = result.stdout?.trim() ?? null;
        const expected_output = expected_outputs[idx]?.trim() ?? null;
        const passed = stdout === expected_output;
        if (!passed) allPassed = false;

        return {
            testCase: idx + 1,
            passed,
            stdout,
            expected: expected_output,
            stderr: result.stderr,
            compileOutput: result.compile_output,
            status: result.status.description,
            memory: result.memory ? `${result.memory} KB` : null,
            time: result.time ? `${result.time} s` : null,
        };
    });

    return { allPassed, testCaseResult };
};

const validateExecutionPayload = (
    stdin: Array<string>,
    expected_outputs: Array<string>,
) => {
    return (
        Array.isArray(stdin) &&
        stdin.length > 0 &&
        Array.isArray(expected_outputs) &&
        expected_outputs.length === stdin.length
    );
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

        if (!validateExecutionPayload(stdin, expected_outputs)) return {
            success: false,
            message: "Invalid testCases",
        }

        const { allPassed, testCaseResult } = await runJudge0TestCases(
            source_code,
            language_id,
            stdin,
            expected_outputs,
        );

        const submission = await db.submission.create({
            data: {
                userId: session.user.id,
                problemId: problem_id,
                sourceCode: source_code,
                language: getLanguageName(language_id),
                stdin: stdin.join("\n"),
                stdout: JSON.stringify(testCaseResult.map(r => r.stdout)),
                stderr: testCaseResult.some(r => r.stderr) ? JSON.stringify(testCaseResult.map(r => r.stderr)) : null,
                compileOutput: testCaseResult.some(r => r.compileOutput) ? JSON.stringify(testCaseResult.map(r => r.compileOutput)) : null,
                status: allPassed ? "Accepted" : "Wrong Answer",
                memory: testCaseResult.some(r => r.memory) ? JSON.stringify(testCaseResult.map(r => r.memory)) : null,
                time: testCaseResult.some(r => r.time) ? JSON.stringify(testCaseResult.map(r => r.time)) : null,

            }
        });

        if (allPassed) {
            await db.problemSolved.upsert({
                where: {
                    userId_problemId: {userId: session.user.id, problemId: problem_id},

                },
                update: {},
                create: {
                    userId: session.user.id,
                    problemId: problem_id,
                }
            })
        }

        const persistedTestCaseResult = testCaseResult.map((result) => ({
            submmisionId: submission.id,
            testCase: result.testCase,
            passed: result.passed,
            stdout: result.stdout,
            expected: result.expected,
            stderr: result.stderr,
            compileOutput: result.compileOutput,
            status: result.status,
            memory: result.memory,
            time: result.time
        }));

        await db.testCaseResult.createMany({ data: persistedTestCaseResult });
        
        const submissionWithTestCases = await db.submission.findUnique({
            where: {
                id: submission.id
            },
            include: { testCaseResult: true }
        });

        return {
            success: true,
            submission: submissionWithTestCases
        }
    } catch (error) {
        console.error("Error submitting code:", error);

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