"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Problem } from "@/types";
import { useUiProblmStore } from "../../stores/problem-ui-store";
import useGetAllSubmission from "../../hooks/useGetAllSubmission";
import SubmissionsList from "./SubmissionList";

interface ProblemDescriptionProps {
    problem: Problem;
}

export function ProblemDescription({ problem }: ProblemDescriptionProps) {
    const submissions = useUiProblmStore(s => s.submissions);
    useGetAllSubmission(problem.id);
    console.log("submmision:::", submissions);
    
    return (
        <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full justify-start border-b border-border rounded-none bg-transparent p-0 h-auto">
                <TabsTrigger
                    value="description"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                >
                    Description
                </TabsTrigger>

                <TabsTrigger
                    value="solutions"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                >
                    Solutions
                </TabsTrigger>

                <TabsTrigger
                    value="submissions"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                >
                    Submissions
                </TabsTrigger>
            </TabsList>

            {/* Description Tab */}
            <TabsContent value="description" className="space-y-6 mt-6">
                <div>
                    <div className="text-foreground/90 whitespace-pre-line mb-6">
                        {problem.description}
                    </div>
                </div>

                {!!problem.examples?.length && (
                    <div>
                        <h3 className="font-semibold mb-3">Examples:</h3>

                        {problem.examples.map((example, index) => (
                            <div
                                key={example.id}
                                className="bg-muted/30 border border-border rounded-lg p-4 mb-4"
                            >
                                <div className="mb-2">
                                    <span className="font-semibold">
                                        Example {index + 1}:
                                    </span>
                                </div>

                                <div className="mb-1">
                                    <span className="font-mono text-sm">
                                        Input: {example.input}
                                    </span>
                                </div>

                                <div className="mb-1">
                                    <span className="font-mono text-sm">
                                        Output: {example.output}
                                    </span>
                                </div>

                                {example.explanation && (
                                    <div className="text-sm text-foreground/70 mt-2">
                                        Explanation: {example.explanation}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                <div className="pb-6">
                    <h3 className="font-semibold mb-3">Constraints:</h3>

                    <div className="rounded-lg border border-border bg-muted/20 p-4">
                        <pre className="whitespace-pre-wrap text-sm font-mono text-foreground/80">
                            {problem.constraints}
                        </pre>
                    </div>
                </div>
            </TabsContent>

            {/* Solutions Tab */}
            <TabsContent value="solutions" className="mt-6">
                {!!problem.solutions?.length ? (
                    <div className="space-y-4">
                        {problem.solutions.map((solution) => (
                            <div
                                key={solution.id}
                                className="rounded-lg border border-border bg-muted/20 p-4"
                            >
                                <div className="font-semibold mb-2">
                                    {solution.language}
                                </div>
                                <pre className="overflow-x-auto text-sm font-mono whitespace-pre-wrap">
                                    {solution.code}
                                </pre>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 text-foreground/60 border border-border rounded-lg bg-muted/20">
                        Solutions will be available after you solve the problem.
                    </div>
                )}
            </TabsContent>

            {/* Submissions Tab */}
            <TabsContent value="submissions" className="mt-6">
                <SubmissionsList submissions={submissions} />
            </TabsContent>
        </Tabs>
    );
};