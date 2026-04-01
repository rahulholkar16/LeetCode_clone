import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getJudge0LanguageId, pollBatchResults, submitBatch } from "@/lib/judge0";
import { CreateProblem, Submission } from "@/types";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        if (session.user.role !== "ADMIN") {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const body = (await request.json()) as CreateProblem;
        const { title, description, difficulty, tags, examples, constraints, testCases, codeSnippets, referenceSolutions } = body;
        if (!title || !description || !difficulty || !testCases || !codeSnippets || !referenceSolutions) return NextResponse.json({ success: false, error: "Missing field required" }, { status: 400 });
        if (!Array.isArray(testCases) || testCases.length === 0) return NextResponse.json({ success: false, error: "At least one test case is required" }, { status: 400 });
        if (!referenceSolutions || typeof referenceSolutions !== 'object') return NextResponse.json({ success: false, error: "Reference solution is required" }, { status: 400 });

        await Promise.all(
            Object.entries(referenceSolutions).map(async ([language, solutionCode]) => {
                const languageId = getJudge0LanguageId(language);
                if (!languageId) return NextResponse.json({ success: false, error: `Unsupported language: ${language}` }, { status: 400 });

                const submission: Submission[] = testCases.map((tc) => ({
                    source_code: solutionCode,
                    language_id: languageId,
                    stdin: tc.input,
                    expected_output: tc.output,
                }));

                const tokenList = (await submitBatch(submission)).map(t => t.token);

                const results = await pollBatchResults(tokenList);
                for (let i = 0; i < results.length; i++) {
                    const result = results[i];
                    if (result.status.id !== 3) {
                        return NextResponse.json({
                            success: false,
                            error: `Validation failed for ${language}`,
                            testCase: {
                                input: submission[i].stdin,
                                expectedOutput: submission[i].expected_output,
                                actualOutput: result.stdout,
                                error: result.stderr ?? result.compile_output
                            },
                            details: result
                        }, { status: 400 });
                    }
                }
            })
        );
        

        const newProblem = await db.problem.create({
            data: {
                title,
                description,
                difficulty,
                constraints,
                userId: session.user.id,

                examples: {
                    create: examples.map((ex) => ({
                        input: ex.input,
                        output: ex.output,
                        explanation: ex.explanation,
                    })),
                },

                testCases: {
                    create: testCases.map((tc) => ({
                        input: tc.input,
                        output: tc.output,
                        isHidden: tc?.isHidden ?? true,
                    })),
                },

                snippets: {
                    create: Object.entries(codeSnippets).map(([language, code]) => ({
                        language,
                        code,
                    })),
                },

                tags: {
                    create: tags.map((tagName) => ({
                        tag: {
                            connectOrCreate: {
                                where: { name: tagName },
                                create: { name: tagName },
                            },
                        },
                    })),
                },

                solutions: {
                    create: Object.entries(referenceSolutions).map(
                        ([language, code]) => ({
                            language,
                            code,
                        })
                    ),
                },
            },
        });

        return NextResponse.json({
            success: true,
            data: newProblem
        }, { status: 201 });
    } catch (error) {
        console.error("DATABASE ERROR::", error);
        return NextResponse.json({
            success: false,
            error: "Failed to save problem"
        }, {status: 400})
    }
};