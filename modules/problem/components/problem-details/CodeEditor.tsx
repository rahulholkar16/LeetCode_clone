"use client";

import Editor from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { Play, Check } from "lucide-react";
import { useTheme } from "next-themes";

import { Language } from "@/types";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface CodeEditorProps {
    language: Language;
    code: string;
    availableLanguages: Language[];
    onLanguageChange: (language: Language) => void;
    onCodeChange: (code: string) => void;
    onRunCode: () => void;
    onSubmit: () => void;
}

const LANGUAGE_LABELS: Record<Language, string> = {
    Javascript: "JavaScript",
    Python: "Python",
    Java: "Java",
    Cpp: "C++",
};

const MONACO_LANGUAGE_MAP: Record<Language, string> = {
    Javascript: "javascript",
    Python: "python",
    Java: "java",
    Cpp: "cpp",
};

export function CodeEditor({
    language,
    code,
    availableLanguages,
    onLanguageChange,
    onCodeChange,
    onRunCode,
    onSubmit,
}: CodeEditorProps) {
    const { theme } = useTheme();

    const handleEditorDidMount = (
        editorInstance: editor.IStandaloneCodeEditor,
    ) => {
        editorInstance.updateOptions({ minimap: { enabled: false } });
    };

    const editorOptions: editor.IStandaloneEditorConstructionOptions = {
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: "on",
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 2,
        padding: { top: 16, bottom: 16 },
        scrollbar: {
            vertical: "visible",
            horizontal: "visible",
            useShadows: false,
            verticalScrollbarSize: 10,
            horizontalScrollbarSize: 10,
        },
    };

    return (
        <div className="flex h-full min-h-0 flex-col">
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-border bg-background p-4">
                <Select
                    value={language}
                    onValueChange={(value) => {
                        if (value) onLanguageChange(value as Language);
                    }}
                >
                    <SelectTrigger className="w-45">
                        <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                        {availableLanguages.map((lang) => (
                            <SelectItem key={lang} value={lang}>
                                {LANGUAGE_LABELS[lang]}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <div className="flex gap-2">
                    <Button variant="outline" onClick={onRunCode}>
                        <Play className="w-4 h-4 mr-2" />
                        Run Code
                    </Button>
                    <Button
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={onSubmit}
                    >
                        <Check className="w-4 h-4 mr-2" />
                        Submit
                    </Button>
                </div>
            </div>

            {/* Editor */}
            <div className="min-h-0 flex-1 bg-background">
                <Editor
                    height="100%"
                    language={MONACO_LANGUAGE_MAP[language]}
                    value={code}
                    onChange={(value) => onCodeChange(value || "")}
                    theme={theme === "dark" ? "vs-dark" : "light"}
                    options={editorOptions}
                    onMount={handleEditorDidMount}
                />
            </div>
        </div>
    );
};
