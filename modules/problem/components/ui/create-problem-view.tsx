"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/modules/auth/store/auth-store";
import {
    BasicInformation,
    CodeSnippetsSection,
    ExamplesSection,
    ProblemDescription,
    ReferenceSolutionSection,
    TestCasesSection,
} from "@/modules/problem/components";
import { useProblem } from "../../hooks/useProblem";
import { useUiProblmStore } from "../../stores/problem-ui-store";

export function CreateProblemView() {
    // SAMPLE
    const sampleProblem = {
        title: "Two Sum",
        description:
            "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.",
        difficulty: "EASY" as const,
        tags: ["Array", "Hash Table"],
        constraints:
            "2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9\nOnly one valid answer exists.",
        examples: [
            {
                id: 1,
                input: "nums = [2,7,11,15], target = 9",
                output: "[0,1]",
                explanation: "Because nums[0] + nums[1] == 9, we return [0,1].",
            },
            {
                id: 2,
                input: "nums = [3,2,4], target = 6",
                output: "[1,2]",
                explanation: "Because nums[1] + nums[2] == 6, we return [1,2].",
            },
        ],
        testCases: [
            { input: "4\n2 7 11 15\n9", output: "0 1", isHidden: false },
            { input: "3\n3 2 4\n6", output: "1 2", isHidden: false },
            { input: "2\n3 3\n6", output: "0 1", isHidden: true },
        ],
        codeSnippets: {
            PYTHON: `def solve():\n    ...`,
            JAVASCRIPT: `function solve() {\n    ...}\nsolve();`,
        },
        referenceSolutions: {
            PYTHON: `def solve():\n    ...\nif __name__ == "__main__":\n    solve()`,
            JAVASCRIPT: `function solve() {\n    ...\n}\nsolve();`,
        },
    };

    const title = useUiProblmStore(s => s.title);
    const tags = useUiProblmStore(s => s.tags);
    const difficulty = useUiProblmStore(s => s.difficulty);
    const description = useUiProblmStore(s => s.description);
    const constraints = useUiProblmStore((s) => s.constraints);
    const examples = useUiProblmStore(s => s.examples);
    const testCases = useUiProblmStore(s => s.testCases);
    const codeSnippets = useUiProblmStore(s => s.codeSnippets);

    const { createProblem, isCreateProblem: isLoading } = useProblem();
    const router = useRouter();
    const isAdmin = useAuthStore((s) => s.user?.role === "ADMIN");

    useEffect(() => {
        if (isAdmin === false) {
            router.push("/");
        }
    }, [isAdmin, router]);

    if (!isAdmin) return null;

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const codeSnippetsRecord = codeSnippets.reduce(
                (acc, snippet) => {
                    acc[snippet.language] = snippet.code;
                    return acc;
                },
                {} as Record<string, string>,
            );

            const body = {
                title: title,
                description: description,
                difficulty: difficulty,
                tags,
                examples: examples.map(({ id, ...rest }) => rest),
                constraints: constraints,
                testCases: testCases.map(({ id, ...rest }) => rest),
                codeSnippets: codeSnippetsRecord,
                referenceSolution: {
                    javascript: formData.referenceSolution,
                },
            };

            console.log("Problem created:", body);

            // api
            await createProblem(body);

        } catch (error) {
            console.error("Error creating problem:", error);
        }
    };

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">
                        Create New Problem
                    </h1>
                    <p className="text-foreground/70">
                        Add a new coding problem to the platform
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info Form */}
                    <BasicInformation />

                    {/* Problem Description Form */}
                    <ProblemDescription />

                    {/* Example Section Form */}
                    <ExamplesSection />

                    {/* Test Case Form */}
                    <TestCasesSection />

                    {/* Code Snippets Form */}
                    <CodeSnippetsSection />

                    <ReferenceSolutionSection
                        referenceSolution={formData.referenceSolution}
                        onReferenceSolutionChange={(value) =>
                            setFormData({
                                ...formData,
                                referenceSolution: value,
                            })
                        }
                    />

                    <div className="flex items-center justify-end gap-3 sticky bottom-4 bg-background/95 backdrop-blur-md border border-border rounded-lg p-4 shadow-lg">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.push("/problems")}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="button"
                            variant="secondary"
                            onClick={fillSampleProblem}
                        >
                            Add Sample
                        </Button>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="bg-linear-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-semibold"
                        >
                            {isLoading ? "Creating..." : "Create Problem"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
