"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/modules/auth/store/auth-store";
import { useProblem } from "../../hooks/useProblem";
import { useUiProblmStore } from "../../stores/problem-ui-store";
import { BasicInformation } from "../BasicInformation";
import { ProblemDescription } from "../ProblemDescription";
import ExamplesSection from "../ExamplesSection";
import { TestCasesSection } from "../TestCasesSection";
import { CodeSnippetsSection } from "../CodeSnippetsSection";
import { ReferenceSolutionSection } from "../ReferenceSolutionSection";
import { Difficulty } from "@/types";

export function CreateProblemView() {
    const sampleProblem = {
        title: "Two Sum",
        description:
            "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.",
        difficulty: "EASY" as Difficulty,
        tags: ["Array", "Hash Table"],
        constraints:
            "2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9\nOnly one valid answer exists.",
        examples: [
            {
                id: crypto.randomUUID(),
                input: "nums = [2,7,11,15], target = 9",
                output: "[0,1]",
                explanation:
                    "Because nums[0] + nums[1] == 9, we return [0, 1].",
            },
            {
                id: crypto.randomUUID(),
                input: "nums = [3,2,4], target = 6",
                output: "[1,2]",
                explanation:
                    "Because nums[1] + nums[2] == 6, we return [1, 2].",
            },
        ],
        testCases: [
            {
                id: crypto.randomUUID(),
                input: "4\n2 7 11 15\n9",
                output: "0 1",
                isHidden: false,
            },
            {
                id: crypto.randomUUID(),
                input: "3\n3 2 4\n6",
                output: "1 2",
                isHidden: false,
            },
            {
                id: crypto.randomUUID(),
                input: "2\n3 3\n6",
                output: "0 1",
                isHidden: true,
            },
        ],
        codeSnippets: [
            {
                id: crypto.randomUUID(),
                language: "Python" as const,
                code: `def solve():\n    ...`,
            },
            {
                id: crypto.randomUUID(),
                language: "Javascript" as const,
                code: `function solve() {\n    ...\n}\nsolve();`,
            },
        ],
        referenceSolutions: [
            {
                id: crypto.randomUUID(),
                language: "Python" as const,
                code: `def solve():\n    ...\nif __name__ == "__main__":\n    solve()`,
            },
            {
                id: crypto.randomUUID(),
                language: "Javascript" as const,
                code: `function solve() {\n    ...\n}\nsolve();`,
            },
        ],
    };

    const title = useUiProblmStore((s) => s.title);
    const tags = useUiProblmStore((s) => s.tags);
    const difficulty = useUiProblmStore((s) => s.difficulty);
    const description = useUiProblmStore((s) => s.description);
    const constraints = useUiProblmStore((s) => s.constraints);
    const examples = useUiProblmStore((s) => s.examples);
    const testCases = useUiProblmStore((s) => s.testCases);
    const codeSnippets = useUiProblmStore((s) => s.codeSnippets);
    const referenceSolutions = useUiProblmStore((s) => s.referenceSolutions); // ✅ was missing

    const setTitle = useUiProblmStore((s) => s.setTitle);
    const setDifficulty = useUiProblmStore((s) => s.setDifficulty);
    const setDescription = useUiProblmStore((s) => s.setDescription);
    const setConstraints = useUiProblmStore((s) => s.setConstraints);
    const setTag = useUiProblmStore((s) => s.setTag);

    const { createProblem, isCreateProblem: isLoading } = useProblem();
    const router = useRouter();
    const isAdmin = useAuthStore((s) => s.user?.role === "ADMIN");

    useEffect(() => {
        if (isAdmin === false) {
            router.push("/");
        }
    }, [isAdmin, router]);

    if (!isAdmin) return null;

    const fillSampleProblem = () => {
        setTitle(sampleProblem.title);
        setDifficulty(sampleProblem.difficulty);
        setDescription(sampleProblem.description);
        setConstraints(sampleProblem.constraints);
        sampleProblem.tags.forEach((tag) => setTag(tag));

        useUiProblmStore.setState({
            examples: sampleProblem.examples,
            testCases: sampleProblem.testCases,
            codeSnippets: sampleProblem.codeSnippets,
            referenceSolutions: sampleProblem.referenceSolutions,
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const codeSnippetsRecord = codeSnippets.reduce(
                (acc, snippet) => {
                    acc[snippet.language] = snippet.code;
                    return acc;
                },
                {} as Record<string, string>,
            );

            const referenceSolutionRecord = referenceSolutions.reduce(
                (acc, solution) => {
                    acc[solution.language] = solution.code;
                    return acc;
                },
                {} as Record<string, string>,
            );

            const body = {
                title,
                description,
                difficulty,
                tags,
                constraints,
                examples: examples.map(({ id, ...rest }) => rest),
                testCases: testCases.map(({ id, ...rest }) => rest),
                codeSnippets: codeSnippetsRecord,
                referenceSolutions: referenceSolutionRecord,
            };

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
                    <BasicInformation />
                    <ProblemDescription />
                    <ExamplesSection />
                    <TestCasesSection />
                    <CodeSnippetsSection />
                    <ReferenceSolutionSection />

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
};