import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Trash2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useUiProblmStore } from "../stores/problem-ui-store";
import { useEffect, useRef, useState } from "react";
import { TestCase } from "@/types";

type LocalTestCase = TestCase;

export function TestCasesSection() {
    const testCases = useUiProblmStore((s) => s.testCases);
    const addTestCase = useUiProblmStore((s) => s.addTestCase);
    const removeTestCase = useUiProblmStore((s) => s.removeTestCase);
    const updateTestCase = useUiProblmStore((s) => s.updateTestCase);

    const [localTestCases, setLocalTestCases] = useState<LocalTestCase[]>(testCases);

    const knownIdsRef = useRef<Set<string>>(
        new Set(testCases.map((t) => t.id)),
    );

    useEffect(() => {
        setLocalTestCases((prev) => {
            const prevIds = new Set(prev.map((t) => t.id));
            const storeIds = new Set(testCases.map((t) => t.id));

            const added = testCases.filter((t) => !prevIds.has(t.id));

            const filtered = prev.filter((t) => storeIds.has(t.id));

            added.forEach((t) => knownIdsRef.current.add(t.id));

            return added.length || filtered.length !== prev.length
                ? [...filtered, ...added]
                : prev;
        });
    }, [testCases]);

    useEffect(() => {
        const timer = setTimeout(() => {
            localTestCases.forEach((localCase) => {
                const original = testCases.find((t) => t.id === localCase.id);
                if (!original) return;

                (["input", "output", "isHidden"] as const).forEach((field) => {
                    if (original[field] !== localCase[field]) {
                        updateTestCase(localCase.id, field, localCase[field]);
                    }
                });
            });
        }, 300);

        return () => clearTimeout(timer);
    }, [localTestCases, testCases, updateTestCase]);

    const onUpdateLocalTestCase = <K extends keyof Omit<TestCase, "id">>(
        id: string,
        field: K,
        value: TestCase[K],
    ) => {
        setLocalTestCases((prev) =>
            prev.map((tc) => (tc.id === id ? { ...tc, [field]: value } : tc)),
        );
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Test Cases</CardTitle>
                        <CardDescription>
                            Add test cases to validate solutions
                        </CardDescription>
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addTestCase}
                    >
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Add Test Case
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {localTestCases.map((testCase, index) => (
                    <div
                        key={testCase.id}
                        className="p-4 border border-border rounded-lg space-y-3"
                    >
                        <div className="flex items-center justify-between">
                            <h4 className="font-semibold">
                                Test Case {index + 1}
                            </h4>
                            {localTestCases.length > 1 && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeTestCase(testCase.id)}
                                >
                                    <Trash2 className="w-4 h-4 text-destructive" />
                                </Button>
                            )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <Label>Input *</Label>
                                <Textarea
                                    placeholder="Enter input..."
                                    value={testCase.input}
                                    onChange={(e) =>
                                        onUpdateLocalTestCase(
                                            testCase.id,
                                            "input",
                                            e.target.value,
                                        )
                                    }
                                    rows={3}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Expected Output *</Label>
                                <Textarea
                                    placeholder="Enter expected output..."
                                    value={testCase.output}
                                    onChange={(e) =>
                                        onUpdateLocalTestCase(
                                            testCase.id,
                                            "output",
                                            e.target.value,
                                        )
                                    }
                                    rows={3}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id={`visibility-${testCase.id}`}
                                    checked={!testCase.isHidden}
                                    onCheckedChange={(checked) =>
                                        onUpdateLocalTestCase(
                                            testCase.id,
                                            "isHidden",
                                            !checked,
                                        )
                                    }
                                />
                                <label
                                    htmlFor={`visibility-${testCase.id}`}
                                    className="text-sm font-medium flex items-center gap-2 cursor-pointer"
                                >
                                    {testCase.isHidden ? (
                                        <>
                                            <EyeOff className="w-4 h-4 text-muted-foreground" />
                                            <span className="text-muted-foreground">
                                                Hidden (runs on Submit only)
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <Eye className="w-4 h-4 text-green-500" />
                                            <span className="text-foreground">
                                                Visible (runs on Run & Submit)
                                            </span>
                                        </>
                                    )}
                                </label>
                            </div>
                            <p className="text-xs text-muted-foreground ml-6">
                                {testCase.isHidden
                                    ? "This test case will only run when user clicks Submit button"
                                    : "This test case will run when user clicks Run or Submit button"}
                            </p>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};