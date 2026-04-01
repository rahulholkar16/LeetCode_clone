"use client";

import { useEffect, useMemo, useState } from "react";
import { Language, Problem } from "@/types";
import { useProblmStore } from "../../stores/problem-store";
import { TestResultPanel } from "./TestResultPanel";
import { CodeEditor } from "./CodeEditor";

interface ProblemWorkspaceProps {
    initialProblem: Problem;
}

export function ProblemWorkspace({ initialProblem }: ProblemWorkspaceProps) {
    const { selectedProblem, setSelectedProblem, getProblemById, addProblem } =
        useProblmStore();

    useEffect(() => {
        const existingProblem = getProblemById(initialProblem.id);
        if (!existingProblem) addProblem(initialProblem);
        setSelectedProblem(initialProblem);

        return () => setSelectedProblem(null);
    }, [initialProblem, addProblem, getProblemById, setSelectedProblem]);

    const problem = selectedProblem ?? initialProblem;

    const availableLanguages = useMemo(
        () => problem.snippets?.map((s) => s.language as Language) ?? [],
        [problem.snippets],
    );

    const defaultLanguage: Language = availableLanguages[0] ?? "Javascript";

    const [language, setLanguage] = useState<Language>(defaultLanguage);
    const [code, setCode] = useState(
        () =>
            problem.snippets?.find((s) => s.language === defaultLanguage)
                ?.code ?? "",
    );
    const [testResult, setTestResult] = useState<"pass" | "fail" | null>(null);

    const handleLanguageChange = (newLang: Language) => {
        setLanguage(newLang);
        const snippet = problem.snippets?.find((s) => s.language === newLang);
        setCode(snippet?.code ?? "");
    };

    const handleRunCode = () => {
        setTestResult(Math.random() > 0.3 ? "pass" : "fail");
    };

    const handleSubmit = () => {
        setTestResult(Math.random() > 0.2 ? "pass" : "fail");
    };

    return (
        <>
            <div className="flex-1 m-4 rounded-lg border border-border overflow-hidden bg-background">
                <CodeEditor
                    language={language}
                    code={code}
                    availableLanguages={availableLanguages}
                    onLanguageChange={handleLanguageChange}
                    onCodeChange={setCode}
                    onRunCode={handleRunCode}
                    onSubmit={handleSubmit}
                />
            </div>

            <div className="mx-4 mb-4">
                <TestResultPanel result={testResult} />
            </div>
        </>
    );
};