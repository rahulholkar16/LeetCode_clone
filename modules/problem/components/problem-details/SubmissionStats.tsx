import { ResSubmission } from "@/types";
import { Check, X, Clock, AlertCircle } from "lucide-react";

interface SubmissionsStatsProps {
    submissions: ResSubmission[];
}

export function SubmissionsStats({ submissions }: SubmissionsStatsProps) {
    if (submissions.length === 0) return null;

    const stats = {
        total: submissions.length,
        accepted: submissions.filter((s) => s.status === "Accepted").length,
        wrongAnswer: submissions.filter((s) => s.status === "Wrong Answer")
            .length,
        timeLimitExceeded: submissions.filter(
            (s) => s.status === "Time Limit Exceeded",
        ).length,
        errors: submissions.filter(
            (s) => s.status === "Runtime Error" || s.status === "Compile Error",
        ).length,
    };

    const acceptanceRate =
        stats.total > 0
            ? ((stats.accepted / stats.total) * 100).toFixed(1)
            : "0.0";

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 mb-6">
            {/* Total */}
            <div className="bg-background border border-border rounded-lg p-3 sm:p-4">
                <div className="text-xs sm:text-sm text-foreground/60 mb-1 truncate">
                    Total
                </div>
                <div className="text-xl sm:text-2xl font-bold">
                    {stats.total}
                </div>
            </div>

            {/* Accepted */}
            <div className="bg-background border border-green-500/20 rounded-lg p-3 sm:p-4">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                    <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 shrink-0" />
                    <div className="text-xs sm:text-sm text-foreground/60 truncate">
                        Accepted
                    </div>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-green-500">
                    {stats.accepted}
                </div>
                <div className="text-xs text-foreground/50 mt-1">
                    {acceptanceRate}%
                </div>
            </div>

            {/* Wrong Answer */}
            <div className="bg-background border border-red-500/20 rounded-lg p-3 sm:p-4">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                    <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500 shrink-0" />
                    <div className="text-xs sm:text-sm text-foreground/60 truncate">
                        Wrong Ans.
                    </div>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-red-500">
                    {stats.wrongAnswer}
                </div>
            </div>

            {/* TLE */}
            <div className="bg-background border border-yellow-500/20 rounded-lg p-3 sm:p-4">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                    <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-500 shrink-0" />
                    <div className="text-xs sm:text-sm text-foreground/60 truncate">
                        TLE
                    </div>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-yellow-500">
                    {stats.timeLimitExceeded}
                </div>
            </div>

            {/* Errors — spans full width on 2-col so it doesn't sit alone */}
            <div className="bg-background border border-orange-500/20 rounded-lg p-3 sm:p-4 col-span-2 sm:col-span-1">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                    <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-500 shrink-0" />
                    <div className="text-xs sm:text-sm text-foreground/60 truncate">
                        Errors
                    </div>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-orange-500">
                    {stats.errors}
                </div>
            </div>
        </div>
    );
};