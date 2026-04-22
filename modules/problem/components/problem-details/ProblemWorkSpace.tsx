"use client";

import { useEffect, useMemo, useState } from "react";
import { ExecuteResponse, ExecutionResult, Language, Problem } from "@/types";
import { useProblmStore } from "../../stores/problem-store";
import { TestResultPanel } from "./TestResultPanel";
import { CodeEditor } from "./CodeEditor";
import { getJudge0LanguageId } from "@/lib/judge0";
import { executeCode } from "../../actions/problem.action";
import { toast } from "sonner";
import TestCases from "./TestCase";
import { useUiProblmStore } from "../../stores/problem-ui-store";

interface ProblemWorkspaceProps {
    initialProblem: Problem;
}

export function ProblemWorkspace({ initialProblem }: ProblemWorkspaceProps) {
    const { selectedProblem, setSelectedProblem, getProblemById, addProblem } =
        useProblmStore();
    const setSubmissions = useUiProblmStore((s) => s.setSubmissions);

    const [results, setResults] = useState<ExecutionResult[]>([]);
    const [testResult, setTestResult] = useState<"pass" | "fail" | null>(null);

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

    useEffect(() => {
        setEditorCode(snippetCode);
    }, [snippetCode]);

    const executeCurrentCode = async () => {
        const language_id = getJudge0LanguageId(selectedLanguage);
        const stdin = problem?.testCases?.map((tc) => tc.input) ?? [];
        const expected_outputs =
            problem?.testCases?.map((tc) => tc.output) ?? [];

        return executeCode(
            editorCode,
            language_id,
            stdin,
            expected_outputs,
            problem?.id,
        );
    };

    const updateResults = (res: ExecuteResponse) => {
        const testResults = res?.submission?.testCaseResult ?? [];

        setResults(testResults);

        const allPassed = testResults.every((r) => r.passed);
        setTestResult(allPassed ? "pass" : "fail");

        return allPassed;
    };

    const handleRunCode = async () => {
        try {
            const res: ExecuteResponse = await executeCurrentCode();

            if (!res?.success || !res.submission) {
                toast.error("Execution failed");
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
        }
    };

    const handleSubmit = async () => {
        try {
            const res: ExecuteResponse = await executeCurrentCode();

            if (!res?.success || !res.submission) {
                toast.error(res?.message ?? "Submission failed");
                return;
            }

            const allPassed = updateResults(res);
            setSubmissions([
                res.submission,
                ...useUiProblmStore.getState().submissions,
            ]);

            if (allPassed) {
                toast.success("Accepted");
            } else {
                toast.error("Wrong Answer");
            }
        } catch (error) {
            console.log(error);
            toast.error("Submission failed");
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
                    onLanguageChange={setSelectedLanguage}
                    onCodeChange={setEditorCode}
                    onRunCode={handleRunCode}
                    onSubmit={handleSubmit}
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
