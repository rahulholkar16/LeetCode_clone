"use client";

import { useEffect, useState } from "react";
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
import { languages } from "@/modules/problem/constant";
import {
    CodeSnippet,
    Difficulty,
    Example,
    InternalCodeSnippet,
    InternalExample,
    InternalTestCase,
    TestCase,
} from "@/types";
import { useProblem } from "../../hooks/useProblem";

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


    const { createProblem, isCreateProblem: isLoading } = useProblem();
    const router = useRouter();
    const isAdmin = useAuthStore((s) => s.user?.role === "ADMIN");
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        difficulty: "MEDIUM" as Difficulty,
        constraints: "",
        referenceSolution: "",
    });

    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState("");

    const [examples, setExamples] = useState<InternalExample[]>([
        { id: "1", input: "", output: "", explanation: "" },
    ]);

    const [testCases, setTestCases] = useState<InternalTestCase[]>([
        { id: "1", input: "", output: "", explanation: "", isHidden: false },
    ]);

    const [codeSnippets, setCodeSnippets] = useState<InternalCodeSnippet[]>([
        { id: "1", language: "javascript", code: "" },
    ]);

    useEffect(() => {
        if (isAdmin === false) {
            router.push("/");
        }
    }, [isAdmin, router]);

    if (!isAdmin) return null;

    // Tags
    const addTag = () => {
        const trimmed = tagInput.trim();
        if (trimmed && !tags.includes(trimmed)) {
            setTags([...tags, trimmed]);
            setTagInput("");
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter((tag) => tag !== tagToRemove));
    };

    const handleTagKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addTag();
        }
    };

    // Examples
    const addExample = () => {
        setExamples([
            ...examples,
            {
                id: Date.now().toString(),
                input: "",
                output: "",
                explanation: "",
            },
        ]);
    };

    const removeExample = (id: string) => {
        if (examples.length > 1) {
            setExamples(examples.filter((ex) => ex.id !== id));
        }
    };

    const updateExample = (id: string, field: keyof Example, value: string) => {
        setExamples(
            examples.map((ex) =>
                ex.id === id ? { ...ex, [field]: value } : ex,
            ),
        );
    };

    // Test Cases
    const addTestCase = () => {
        setTestCases([
            ...testCases,
            {
                id: Date.now().toString(),
                input: "",
                output: "",
                explanation: "",
                isHidden: false,
            },
        ]);
    };

    const removeTestCase = (id: string) => {
        if (testCases.length > 1) {
            setTestCases(testCases.filter((tc) => tc.id !== id));
        }
    };

    const updateTestCase = (
        id: string,
        field: keyof TestCase | "explanation",
        value: string | boolean,
    ) => {
        setTestCases(
            testCases.map((tc) =>
                tc.id === id ? { ...tc, [field]: value } : tc,
            ),
        );
    };

    // Code Snippets
    const addCodeSnippet = () => {
        setCodeSnippets([
            ...codeSnippets,
            { id: Date.now().toString(), language: "javascript", code: "" },
        ]);
    };

    const removeCodeSnippet = (id: string) => {
        if (codeSnippets.length > 1) {
            setCodeSnippets(codeSnippets.filter((cs) => cs.id !== id));
        }
    };

    const updateCodeSnippet = (
        id: string,
        field: keyof CodeSnippet,
        value: string,
    ) => {
        setCodeSnippets(
            codeSnippets.map((cs) =>
                cs.id === id ? { ...cs, [field]: value } : cs,
            ),
        );
    };

    const fillSampleProblem = () => {
        setFormData({
            title: sampleProblem.title,
            description: sampleProblem.description,
            difficulty: sampleProblem.difficulty,
            constraints: sampleProblem.constraints,
            referenceSolution: sampleProblem.referenceSolutions.JAVASCRIPT,
        });

        setTags(sampleProblem.tags);
        setExamples(sampleProblem.examples);
        setTestCases(sampleProblem.testCases);
        setCodeSnippets(sampleProblem.codeSnippets);
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

            const body = {
                title: formData.title,
                description: formData.description,
                difficulty: formData.difficulty,
                tags,
                examples: examples.map(({ id, ...rest }) => rest),
                constraints: formData.constraints,
                testCases: testCases.map(
                    ({ id, explanation, ...rest }) => rest,
                ),
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
                    <BasicInformation
                        title={formData.title}
                        difficulty={formData.difficulty}
                        tags={tags}
                        tagInput={tagInput}
                        onTitleChange={(value) =>
                            setFormData({ ...formData, title: value })
                        }
                        onDifficultyChange={(value) =>
                            setFormData({ ...formData, difficulty: value })
                        }
                        onTagInputChange={setTagInput}
                        onAddTag={addTag}
                        onRemoveTag={removeTag}
                        onTagKeyPress={handleTagKeyPress}
                    />

                    <ProblemDescription
                        description={formData.description}
                        constraints={formData.constraints}
                        onDescriptionChange={(value) =>
                            setFormData({ ...formData, description: value })
                        }
                        onConstraintsChange={(value) =>
                            setFormData({ ...formData, constraints: value })
                        }
                    />

                    <ExamplesSection
                        examples={examples}
                        onAddExample={addExample}
                        onRemoveExample={removeExample}
                        onUpdateExample={updateExample}
                    />

                    <TestCasesSection
                        testCases={testCases}
                        onAddTestCase={addTestCase}
                        onRemoveTestCase={removeTestCase}
                        onUpdateTestCase={updateTestCase}
                    />

                    <CodeSnippetsSection
                        codeSnippets={codeSnippets}
                        languages={languages}
                        onAddCodeSnippet={addCodeSnippet}
                        onRemoveCodeSnippet={removeCodeSnippet}
                        onUpdateCodeSnippet={updateCodeSnippet}
                    />

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
