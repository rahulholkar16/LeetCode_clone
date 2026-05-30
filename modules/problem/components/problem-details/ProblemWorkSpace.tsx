"use client";

import { useEffect, useMemo, useState } from "react";
import {
    ExecuteResponse,
    ExecutionResult,
    Language,
    ProblemWorkspaceProps,
} from "@/types";
import { useProblmStore } from "../../stores/problem-store";
import { TestResultPanel } from "./TestResultPanel";
import { CodeEditor } from "./CodeEditor";
import { getJudge0LanguageId } from "@/lib/judge0";
import {
    executeCode,
    getSubmissionById,
    runCode,
} from "../../actions/problem.action";
import { toast } from "sonner";
import TestCases from "./TestCase";
import { useUiProblmStore } from "../../stores/problem-ui-store";
import { getSubmissionStatusCategory } from "../../utils/submission-status";

const sleep = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

export function ProblemWorkspace({ initialProblem }: ProblemWorkspaceProps) {
    const { selectedProblem, setSelectedProblem, getProblemById, addProblem } = useProblmStore();
    const setSubmissions = useUiProblmStore((s) => s.setSubmissions);

    const [results, setResults] = useState<ExecutionResult[]>([]);
    const [testResult, setTestResult] = useState<"pass" | "fail" | null>(null);
    const [isRunning, setIsRunning] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const existingProblem = getProblemById(initialProblem.id);

        if (!existingProblem) addProblem(initialProblem);
        setSelectedProblem(initialProblem);

        return () => setSelectedProblem(null);
    }, [addProblem, getProblemById, initialProblem, setSelectedProblem]);

    const problem = selectedProblem ?? initialProblem;

    const availableLanguages = useMemo(
        () => problem.snippets?.map((s) => s.language as Language) ?? [],
        [problem.snippets],
    );

    const [selectedLanguage, setSelectedLanguage] = useState<Language>(
        () => (problem.snippets?.[0]?.language as Language) ?? "Javascript",
    );

    const snippetCode = useMemo(
        () =>
            problem.snippets?.find((s) => s.language === selectedLanguage)
                ?.code ?? "",
        [problem.snippets, selectedLanguage],
    );

    const [editorCode, setEditorCode] = useState(snippetCode);

    const getExecutionPayload = () => {
        const language_id = getJudge0LanguageId(selectedLanguage);
        const stdin = problem?.testCases?.map((tc) => tc.input) ?? [];
        const expected_outputs =
            problem?.testCases?.map((tc) => tc.output) ?? [];

        return { expected_outputs, language_id, stdin };
    };

    const updateResultsFromTestCases = (testResults: ExecutionResult[]) => {
        setResults(testResults);

        const allPassed = testResults.every((r) => r.passed);
        setTestResult(allPassed ? "pass" : "fail");

        return allPassed;
    };

    const updateResults = (res: ExecuteResponse) => {
        const testResults =
            res.testCaseResult ?? res.submission?.testCaseResult ?? [];

        return updateResultsFromTestCases(testResults);
    };

    const replaceSubmission = (submission: ExecuteResponse["submission"]) => {
        if (!submission) return;

        const currentSubmissions = useUiProblmStore.getState().submissions;
        const existingIndex = currentSubmissions.findIndex(
            (item) => item.id === submission.id,
        );

        if (existingIndex === -1) {
            setSubmissions([submission, ...currentSubmissions]);
            return;
        }

        setSubmissions(
            currentSubmissions.map((item) =>
                item.id === submission.id ? submission : item,
            ),
        );
    };

    const waitForSubmissionResult = async (submissionId: string) => {
        for (let attempt = 0; attempt < 30; attempt++) {
            await sleep(1000);

            const res: ExecuteResponse = await getSubmissionById(submissionId);
            if (!res?.success || !res.submission) continue;

            replaceSubmission(res.submission);

            if (res.submission.status !== "Pending") return res.submission;
        }

        return null;
    };

    const hasCode = () => editorCode.trim().length > 0;

    const handleLanguageChange = (language: Language) => {
        setSelectedLanguage(language);
        setEditorCode(
            problem.snippets?.find((snippet) => snippet.language === language)
                ?.code ?? "",
        );
    };

    const handleRunCode = async () => {
        if (!hasCode()) {
            toast.error("Please write code before running.");
            return;
        }

        try {
            setIsRunning(true);
            const { expected_outputs, language_id, stdin } =
                getExecutionPayload();
            const res: ExecuteResponse = await runCode(
                editorCode,
                language_id,
                stdin,
                expected_outputs,
            );

            if (!res?.success || !res.testCaseResult) {
                toast.error(res?.message ?? "Execution failed");
                return;
            }

            const allPassed = updateResults(res);

            if (allPassed) {
                toast.success("All test cases passed 🚀");
            } else {
                toast.error("Some test cases failed ❌");
            }
        } catch (error) {
            console.log(error);
            toast.error("Execution failed");
        } finally {
            setIsRunning(false);
        }
    };

    const handleSubmit = async () => {
        if (!hasCode()) {
            toast.error("Please write code before submitting.");
            return;
        }

        try {
            setIsSubmitting(true);
            const { expected_outputs, language_id, stdin } = getExecutionPayload();
            const res: ExecuteResponse = await executeCode(
                editorCode,
                language_id,
                stdin,
                expected_outputs,
                problem.id,
            );

            if (!res?.success || !res.submission) {
                toast.error(res?.message ?? "Submission failed");
                return;
            }

            setSubmissions([
                res.submission,
                ...useUiProblmStore.getState().submissions,
            ]);

            if (res.submission.status === "Pending") {
                toast.loading("Judging submission...", {
                    id: res.submission.id,
                });

                const judgedSubmission = await waitForSubmissionResult(
                    res.submission.id,
                );

                toast.dismiss(res.submission.id);

                if (!judgedSubmission) {
                    toast.error("Submission is still judging. Check Submissions soon.");
                    return;
                }

                const allPassed = updateResultsFromTestCases(
                    judgedSubmission.testCaseResult ?? [],
                );

                const statusCategory = getSubmissionStatusCategory(
                    judgedSubmission.status,
                );

                if (allPassed || statusCategory === "Accepted") {
                    toast.success("Accepted");
                } else {
                    toast.error(judgedSubmission.status);
                }

                return;
            }

            const allPassed = updateResults(res);

            if (allPassed) {
                toast.success("Accepted");
            } else {
                toast.error("Wrong Answer");
            }
        } catch (error) {
            console.log(error);
            toast.error("Submission failed");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex h-full min-h-0 flex-col">
            {/* Editor */}
            <div className="m-4 mb-3 min-h-[320px] flex-1 overflow-hidden rounded-lg border border-border bg-background">
                <CodeEditor
                    language={selectedLanguage}
                    code={editorCode}
                    availableLanguages={availableLanguages}
                    onLanguageChange={handleLanguageChange}
                    onCodeChange={setEditorCode}
                    onRunCode={handleRunCode}
                    onSubmit={handleSubmit}
                    isRunning={isRunning}
                    isSubmitting={isSubmitting}
                />
            </div>

            {/* Test Cases + Result */}
            <div className="mx-4 mb-4 max-h-[42%] shrink-0 space-y-4 overflow-y-auto">
                <TestCases
                    problem={{ ...problem, examples: problem.examples ?? [] }}
                    results={results}
                />
                <TestResultPanel result={testResult} />
            </div>
        </div>
    );
};
