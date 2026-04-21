"use client";

import { useState } from "react";
import {
    Check,
    X,
    Clock,
    AlertCircle,
    Code2,
    ChevronDown,
    ChevronUp,
    Filter,
} from "lucide-react";
import { ResSubmission } from "@/types";
import { SubmissionsStats } from "./SubmissionStats";
import { formatSubmissionDate } from "../../constant";

interface SubmissionsListProps {
    submissions: ResSubmission[];
}

export default function SubmissionsList({ submissions }: SubmissionsListProps) {
    const [expandedSubmission, setExpandedSubmission] = useState<string | null>(
        null,
    );
    const [statusFilter, setStatusFilter] = useState<
        ResSubmission["status"] | "All"
    >("All");
    const [languageFilter, setLanguageFilter] = useState<
        ResSubmission["language"] | "All"
    >("All");

    if (submissions.length === 0) {
        return (
            <div className="text-center py-12 text-foreground/60 border border-border rounded-lg bg-muted/20">
                <Code2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm px-4">
                    No submissions yet. Start coding to see your submissions
                    here!
                </p>
            </div>
        );
    }

    const toggleExpanded = (id: string) => {
        setExpandedSubmission(expandedSubmission === id ? null : id);
    };

    const getStatusIcon = (status: ResSubmission["status"]) => {
        switch (status) {
            case "Accepted":
                return <Check className="w-4 h-4 text-green-500 shrink-0" />;
            case "Wrong Answer":
                return <X className="w-4 h-4 text-red-500 shrink-0" />;
            case "Time Limit Exceeded":
                return <Clock className="w-4 h-4 text-yellow-500 shrink-0" />;
            case "Runtime Error":
            case "Compile Error":
                return (
                    <AlertCircle className="w-4 h-4 text-orange-500 shrink-0" />
                );
            default:
                return null;
        }
    };

    const getStatusColor = (status: ResSubmission["status"]) => {
        switch (status) {
            case "Accepted":
                return "text-green-500";
            case "Wrong Answer":
                return "text-red-500";
            case "Time Limit Exceeded":
                return "text-yellow-500";
            case "Runtime Error":
            case "Compile Error":
                return "text-orange-500";
            default:
                return "text-foreground/60";
        }
    };

    const getLanguageDisplay = (language: ResSubmission["language"]) => {
        const langMap = {
            JAVASCRIPT: "JavaScript",
            PYTHON: "Python",
            JAVA: "Java",
            CPP: "C++",
        };
        return langMap[language] || language;
    };

    const uniqueLanguages = Array.from(
        new Set(submissions.map((s) => s.language)),
    );

    const filteredSubmissions = submissions.filter((submission) => {
        const matchesStatus =
            statusFilter === "All" || submission.status === statusFilter;
        const matchesLanguage =
            languageFilter === "All" || submission.language === languageFilter;
        return matchesStatus && matchesLanguage;
    });

    return (
        <div className="space-y-6">
            <SubmissionsStats submissions={submissions} />

            {/* Filters */}
            <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-2 text-sm text-foreground/60">
                    <Filter className="w-4 h-4 shrink-0" />
                    <span>Filter:</span>
                </div>

                <div className="flex items-center gap-2 flex-wrap flex-1">
                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) =>
                            setStatusFilter(
                                e.target.value as
                                    | ResSubmission["status"]
                                    | "All",
                            )
                        }
                        className="px-2 py-1.5 rounded-lg border border-border bg-background text-sm hover:border-primary/50 transition-colors min-w-0 shrink"
                    >
                        <option value="All">All Status</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Wrong Answer">Wrong Answer</option>
                        <option value="Time Limit Exceeded">TLE</option>
                        <option value="Runtime Error">Runtime Error</option>
                        <option value="Compile Error">Compile Error</option>
                    </select>

                    {/* Language Filter */}
                    <select
                        value={languageFilter}
                        onChange={(e) =>
                            setLanguageFilter(
                                e.target.value as
                                    | ResSubmission["language"]
                                    | "All",
                            )
                        }
                        className="px-2 py-1.5 rounded-lg border border-border bg-background text-sm hover:border-primary/50 transition-colors min-w-0 shrink"
                    >
                        <option value="All">All Languages</option>
                        {uniqueLanguages.map((lang) => (
                            <option key={lang} value={lang}>
                                {getLanguageDisplay(lang)}
                            </option>
                        ))}
                    </select>

                    <span className="text-sm text-foreground/60 ml-auto whitespace-nowrap">
                        {filteredSubmissions.length} submission
                        {filteredSubmissions.length !== 1 ? "s" : ""}
                    </span>
                </div>
            </div>

            {/* Submissions */}
            <div className="space-y-3">
                {filteredSubmissions.map((submission) => {
                    const isExpanded = expandedSubmission === submission.id;

                    return (
                        <div
                            key={submission.id}
                            className="border border-border rounded-lg bg-background hover:border-primary/50 transition-colors"
                        >
                            <div
                                className="p-3 sm:p-4 cursor-pointer"
                                onClick={() => toggleExpanded(submission.id)}
                            >
                                <div className="flex items-center justify-between gap-2">
                                    {/* Left: status + language stacked on mobile, inline on sm+ */}
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            {getStatusIcon(submission.status)}
                                            <span
                                                className={`font-medium text-sm sm:text-base truncate ${getStatusColor(submission.status)}`}
                                            >
                                                {submission.status}
                                            </span>
                                        </div>
                                        <div className="text-xs sm:text-sm text-foreground/60 pl-6 sm:pl-0">
                                            {getLanguageDisplay(
                                                submission.language,
                                            )}
                                        </div>
                                    </div>

                                    {/* Right: date + chevron */}
                                    <div className="flex items-center gap-2 shrink-0">
                                        <span className="text-xs sm:text-sm text-foreground/60 hidden xs:block sm:block">
                                            {formatSubmissionDate(
                                                submission.createdAt,
                                            )}
                                        </span>
                                        {isExpanded ? (
                                            <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                                        ) : (
                                            <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                                        )}
                                    </div>
                                </div>

                                {/* Date shown below on very small screens */}
                                <div className="text-xs text-foreground/50 mt-1 sm:hidden">
                                    {formatSubmissionDate(submission.createdAt)}
                                </div>
                            </div>

                            {isExpanded && (
                                <div className="p-3 sm:p-4 border-t border-border overflow-x-auto">
                                    <pre className="text-xs sm:text-sm font-mono whitespace-pre">
                                        {submission.sourceCode}
                                    </pre>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};