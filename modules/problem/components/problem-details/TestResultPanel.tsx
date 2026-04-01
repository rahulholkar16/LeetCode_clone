import { Check, X } from "lucide-react";

interface TestResultPanelProps {
    result: "pass" | "fail" | null;
}

export function TestResultPanel({ result }: TestResultPanelProps) {
    if (!result) return null;

    const isPass = result === "pass";

    return (
        <div
            className={`border rounded-lg p-4 ${
                isPass
                    ? "bg-green-500/10 border-green-500/30"
                    : "bg-red-500/10 border-red-500/30"
            }`}
        >
            <div className="flex items-center gap-2">
                {isPass ? (
                    <>
                        <Check className="w-5 h-5 text-green-500" />
                        <span className="text-green-500 font-semibold">
                            All test cases passed!
                        </span>
                    </>
                ) : (
                    <>
                        <X className="w-5 h-5 text-red-500" />
                        <span className="text-red-500 font-semibold">
                            Test case failed. Please review your solution.
                        </span>
                    </>
                )}
            </div>
        </div>
    );
};