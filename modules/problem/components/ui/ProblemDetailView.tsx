"use client";

import { useState } from "react";
import { useGetProblemById } from "../../hooks/useGetProblemById";
import { notFound } from "next/navigation";
import { useProblmStore } from "../../stores/problem-store";
import { ProblemDescription } from "../problem-details/ProblemDescription";
import { ProblemWorkspace } from "../problem-details/ProblemWorkSpace";
import { ProblemHeader } from "../problem-details/ProblemHerder";

interface ProblemDetailViewProps {
    id: string;
}

type Tab = "description" | "workspace";

export function ProblemDetailView({ id }: ProblemDetailViewProps) {
    const { isLoading } = useGetProblemById(id);
    const [activeTab, setActiveTab] = useState<Tab>("description");

    const problem = useProblmStore((s) => s.problems.find((p) => p.id === id));

    if (isLoading) {
        return (
            <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
                <p className="text-foreground/50 text-sm">Loading...</p>
            </div>
        );
    }

    if (!problem) return notFound();

    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col border-t border-border bg-muted/20">
            {/* ── Mobile tab bar (hidden on lg+) ── */}
            <div className="flex lg:hidden border-b border-border bg-background shrink-0">
                {(["description", "workspace"] as Tab[]).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-2.5 text-sm font-medium capitalize transition-colors
              ${
                  activeTab === tab
                      ? "border-b-2 border-primary text-primary"
                      : "text-foreground/50 hover:text-foreground/80"
              }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* ── Content area ── */}
            <div className="flex flex-1 min-h-0">
                {/* Left panel — always visible on lg, tab-controlled on mobile */}
                <div
                    className={`
            w-full lg:w-1/2 lg:border-r lg:border-border overflow-y-auto
            ${activeTab === "description" ? "block" : "hidden"} lg:block
          `}
                >
                    <div className="p-4 sm:p-6 bg-background m-3 sm:m-4 rounded-lg border border-border">
                        <ProblemHeader problem={problem} />
                        <ProblemDescription problem={problem} />
                    </div>
                </div>

                {/* Right panel — always visible on lg, tab-controlled on mobile */}
                <div
                    className={`
            w-full lg:w-1/2 min-h-0 flex-col overflow-hidden
            ${activeTab === "workspace" ? "flex" : "hidden"} lg:flex
          `}
                >
                    <ProblemWorkspace initialProblem={problem} />
                </div>
            </div>
        </div>
    );
};
