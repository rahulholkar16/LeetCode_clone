import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Trash2 } from "lucide-react";
import { useUiProblmStore } from "../stores/problem-ui-store";
import { useEffect, useRef, useState } from "react";
import { CodeSnippet } from "@/types";
import { languages } from "../constant";

type LoaclCodeSnippets = CodeSnippet;

export function CodeSnippetsSection() {
    const codeSnippets = useUiProblmStore((s) => s.codeSnippets);
    const addCodeSnippet = useUiProblmStore((s) => s.addCodeSnippet);
    const updateCodeSnippet = useUiProblmStore((s) => s.updateCodeSnippet);
    const removeCodeSnippet = useUiProblmStore((s) => s.removeCodeSnippet);

    const [loaclCodeSnippets, setLocalCodeSnippets] =
        useState<LoaclCodeSnippets[]>(codeSnippets);

    const knownIdsRef = useRef<Set<string>>(
        new Set(codeSnippets.map((t) => t.id)),
    );

    useEffect(() => {
        setLocalCodeSnippets((prev) => {
            const prevIds = new Set(prev.map((cs) => cs.id));
            const storeIds = new Set(codeSnippets.map((cs) => cs.id));

            const added = codeSnippets.filter((cs) => !prevIds.has(cs.id));

            const filtered = prev.filter((cs) => storeIds.has(cs.id));

            added.forEach((cs) => knownIdsRef.current.add(cs.id));

            return added.length || filtered.length !== prev.length
                ? [...filtered, ...added]
                : prev;
        });
    }, [codeSnippets]);

    useEffect(() => {
        const timer = setTimeout(() => {
            loaclCodeSnippets.forEach((localCS) => {
                const original = codeSnippets.find(
                    (cs) => cs.id === localCS.id,
                );
                if (!original) return;

                (["language", "code"] as const).forEach((field) => {
                    if (original[field] !== localCS[field]) {
                        updateCodeSnippet(localCS.id, field, localCS[field]);
                    }
                });
            });
        }, 300);
        return () => clearTimeout(timer);
    }, [loaclCodeSnippets, codeSnippets, updateCodeSnippet]);

    const onUpdateCodeSnippet = <K extends keyof Omit<CodeSnippet, "id">>(
        id: string,
        field: K,
        value: CodeSnippet[K],
    ) => {
        setLocalCodeSnippets((prev) =>
            prev.map((cs) => (cs.id === id ? { ...cs, [field]: value } : cs)),
        );
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Code Snippets</CardTitle>
                        <CardDescription>
                            Add starter code for different programming languages
                        </CardDescription>
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addCodeSnippet}
                    >
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Add Language
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {loaclCodeSnippets.map((snippet, index) => (
                    <div
                        key={snippet.id}
                        className="p-4 border border-border rounded-lg space-y-3"
                    >
                        <div className="flex items-center justify-between">
                            <h4 className="font-semibold">
                                Code Snippet {index + 1}
                            </h4>
                            {loaclCodeSnippets.length > 1 && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                        removeCodeSnippet(snippet.id)
                                    }
                                >
                                    <Trash2 className="w-4 h-4 text-destructive" />
                                </Button>
                            )}
                        </div>
                        <div className="space-y-3">
                            <div className="space-y-2">
                                <Label>Language *</Label>
                                <Select
                                    value={snippet.language}
                                    onValueChange={(value) => {
                                        if (value)
                                            onUpdateCodeSnippet(
                                                snippet.id,
                                                "language",
                                                value,
                                            );
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select language" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {languages.map((lang) => (
                                            <SelectItem key={lang} value={lang}>
                                                {lang.slice(1)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Starter Code *</Label>
                                <Textarea
                                    placeholder="function twoSum(nums, target) {&#10;    // Write your code here&#10;}"
                                    value={snippet.code}
                                    onChange={(e) =>
                                        onUpdateCodeSnippet(
                                            snippet.id,
                                            "code",
                                            e.target.value,
                                        )
                                    }
                                    rows={6}
                                    className="font-mono text-sm"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
