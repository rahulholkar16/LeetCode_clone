import { db } from "@/lib/db";
import { pollBatchResults, submitBatch } from "@/lib/judge0";
import { getLanguageName } from "../constant";
import StatsQueue from "@/modules/profile/Queue/queue";

export interface SubmissionJobData {
    submissionId: string;
    userId: string;
    problemId: string;
    sourceCode: string;
    languageId: number;
    stdin: string[];
    expectedOutputs: string[];
}

export const validateExecutionPayload = (
    stdin: string[],
    expectedOutputs: string[],
) => {
    return (
        Array.isArray(stdin) &&
        stdin.length > 0 &&
        Array.isArray(expectedOutputs) &&
        expectedOutputs.length === stdin.length
    );
};

export const runJudge0TestCases = async (
    sourceCode: string,
    languageId: number,
    stdin: string[],
    expectedOutputs: string[],
) => {
    const submissions = stdin.map((input) => ({
        source_code: sourceCode,
        language_id: languageId,
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
        const expected = expectedOutputs[idx]?.trim() ?? null;
        const judgeStatus = result.status.description;
        const passed = judgeStatus === "Accepted" && stdout === expected;
        if (!passed) allPassed = false;

        return {
            testCase: idx + 1,
            passed,
            stdout,
            expected,
            stderr: result.stderr,
            compileOutput: result.compile_output,
            status: passed ? "Accepted" : judgeStatus,
            memory: result.memory ? `${result.memory} KB` : null,
            time: result.time ? `${result.time} s` : null,
        };
    });

    return { allPassed, testCaseResult };
};

const getSubmissionStatus = (
    allPassed: boolean,
    testCaseResult: Awaited<ReturnType<typeof runJudge0TestCases>>["testCaseResult"],
) => {
    if (allPassed) return "Accepted";

    const failedStatus = testCaseResult.find((result) => !result.passed)?.status;
    if (!failedStatus || failedStatus === "Accepted") return "Wrong Answer";

    return failedStatus;
};

export const processSubmission = async (data: SubmissionJobData) => {
    const { allPassed, testCaseResult } = await runJudge0TestCases(
        data.sourceCode,
        data.languageId,
        data.stdin,
        data.expectedOutputs,
    );

    const status = getSubmissionStatus(allPassed, testCaseResult);

    await db.$transaction([
        db.testCaseResult.deleteMany({
            where: { submmisionId: data.submissionId },
        }),
        db.submission.update({
            where: { id: data.submissionId },
            data: {
                stdout: JSON.stringify(testCaseResult.map((r) => r.stdout)),
                stderr: testCaseResult.some((r) => r.stderr)
                    ? JSON.stringify(testCaseResult.map((r) => r.stderr))
                    : null,
                compileOutput: testCaseResult.some((r) => r.compileOutput)
                    ? JSON.stringify(testCaseResult.map((r) => r.compileOutput))
                    : null,
                status,
                memory: testCaseResult.some((r) => r.memory)
                    ? JSON.stringify(testCaseResult.map((r) => r.memory))
                    : null,
                time: testCaseResult.some((r) => r.time)
                    ? JSON.stringify(testCaseResult.map((r) => r.time))
                    : null,
            },
        }),
        db.testCaseResult.createMany({
            data: testCaseResult.map((result) => ({
                submmisionId: data.submissionId,
                testCase: result.testCase,
                passed: result.passed,
                stdout: result.stdout,
                expected: result.expected,
                stderr: result.stderr,
                compileOutput: result.compileOutput,
                status: result.status,
                memory: result.memory,
                time: result.time,
            })),
        }),
        ...(allPassed
            ? [
                db.problemSolved.upsert({
                    where: {
                        userId_problemId: {
                            userId: data.userId,
                            problemId: data.problemId,
                        },
                    },
                    update: {},
                    create: {
                        userId: data.userId,
                        problemId: data.problemId,
                    },
                }),
            ]
            : []),
    ]);

    // Stats JOB to update user stats after submission is processed
    await StatsQueue.add("update-user-stats", { userId: data.userId }, { jobId: `update-user-stats-${data.userId}`, removeOnComplete: true });

    return {
        allPassed,
        status,
        testCaseResult,
    };
};

export const markSubmissionFailed = async (
    submissionId: string,
    error: unknown,
) => {
    const message = error instanceof Error ? error.message : "Unknown error";

    await db.submission.update({
        where: { id: submissionId },
        data: {
            status: "Runtime Error",
            stderr: message,
        },
    });
};

export const createPendingSubmission = async (data: {
    userId: string;
    problemId: string;
    sourceCode: string;
    languageId: number;
    stdin: string[];
}) => {
    return db.submission.create({
        data: {
            userId: data.userId,
            problemId: data.problemId,
            sourceCode: data.sourceCode,
            language: getLanguageName(data.languageId),
            stdin: data.stdin.join("\n"),
            status: "Pending",
        },
        include: { testCaseResult: true },
    });
};
