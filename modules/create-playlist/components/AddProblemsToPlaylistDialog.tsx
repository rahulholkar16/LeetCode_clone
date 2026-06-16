"use client";

import { useMemo, useState } from "react";
import { Check, Loader2, Plus, Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGetAllProblems } from "@/modules/problem/hooks/useGetAllProblems";
import { useProblmStore } from "@/modules/problem/stores/problem-store";
import { getDifficultyColor } from "@/modules/problem/constant";
import type { AddProblemsToPlaylistDialogProps } from "@/types";
import { useAddProblemsToPlaylist } from "../hooks/use-playlists";

export function AddProblemsToPlaylistDialog({
    open,
    onOpenChange,
    playlist,
}: AddProblemsToPlaylistDialogProps) {
    const [search, setSearch] = useState("");
    const [selectedProblemIds, setSelectedProblemIds] = useState<Set<string>>(
        new Set(),
    );

    const problems = useProblmStore((state) => state.problems);
    const { isLoading } = useGetAllProblems();
    const addProblemsMutation = useAddProblemsToPlaylist(playlist.id);
    const isSaving = addProblemsMutation.isPending;
    const selectedCount = selectedProblemIds.size;

    const existingProblemIds = useMemo(
        () =>
            new Set(
                playlist.problems?.map((entry) => entry.problemId) ?? [],
            ),
        [playlist.problems],
    );

    const availableProblems = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase();

        return problems
            .filter((problem) => !existingProblemIds.has(problem.id))
            .filter((problem) => {
                if (!normalizedSearch) return true;

                return problem.title.toLowerCase().includes(normalizedSearch);
            });
    }, [existingProblemIds, problems, search]);

    const handleOpenChange = (nextOpen: boolean) => {
        if (!nextOpen) {
            setSearch("");
            setSelectedProblemIds(new Set());
        }

        onOpenChange(nextOpen);
    };

    const handleToggleProblem = (problemId: string) => {
        if (isSaving) return;

        setSelectedProblemIds((current) => {
            const next = new Set(current);

            if (next.has(problemId)) {
                next.delete(problemId);
            } else {
                next.add(problemId);
            }

            return next;
        });
    };

    const handleAddProblems = async () => {
        if (selectedProblemIds.size === 0 || isSaving) return;

        const result = await addProblemsMutation
            .mutateAsync(Array.from(selectedProblemIds))
            .catch(() => null);

        if (!result) return;

        handleOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[640px]">
                <DialogHeader>
                    <div className="flex items-start justify-between gap-4 pr-8">
                        <div>
                            <DialogTitle>Add Problems</DialogTitle>
                            <DialogDescription className="mt-2">
                                Add problems to &quot;{playlist.name}&quot;.
                            </DialogDescription>
                        </div>
                        <Badge variant="secondary" className="mt-0.5">
                            {selectedCount} selected
                        </Badge>
                    </div>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="relative flex-1">
                            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder="Search problems"
                                className="pr-9 pl-9"
                                disabled={isSaving}
                            />
                            {search && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon-sm"
                                    onClick={() => setSearch("")}
                                    disabled={isSaving}
                                    className="absolute top-1/2 right-1 size-6 -translate-y-1/2"
                                    aria-label="Clear search"
                                >
                                    <X className="size-3.5" />
                                </Button>
                            )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {availableProblems.length} available
                        </p>
                    </div>

                    {isLoading ? (
                        <div className="flex min-h-[360px] items-center justify-center rounded-lg border border-dashed">
                            <div className="text-center">
                                <Loader2 className="mx-auto mb-3 size-8 animate-spin text-primary" />
                                <p className="text-sm text-muted-foreground">
                                    Loading problems...
                                </p>
                            </div>
                        </div>
                    ) : availableProblems.length > 0 ? (
                        <ScrollArea className="h-[360px] pr-4">
                            <div className="space-y-2">
                                {availableProblems.map((problem) => {
                                    const isSelected =
                                        selectedProblemIds.has(problem.id);

                                    return (
                                        <button
                                            key={problem.id}
                                            type="button"
                                            className={`flex w-full cursor-pointer items-center gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-accent ${
                                                isSelected
                                                    ? "border-primary/40 bg-primary/5"
                                                    : "border-border"
                                            }`}
                                            onClick={() =>
                                                handleToggleProblem(problem.id)
                                            }
                                            disabled={isSaving}
                                        >
                                            <Checkbox
                                                checked={isSelected}
                                                disabled={isSaving}
                                                onClick={(event) =>
                                                    event.preventDefault()
                                                }
                                            />
                                            <span className="min-w-0 flex-1">
                                                <span className="flex items-center gap-2">
                                                    <span className="block truncate font-medium">
                                                        {problem.title}
                                                    </span>
                                                    {isSelected && (
                                                        <Check className="size-4 shrink-0 text-green-500" />
                                                    )}
                                                </span>
                                                <span className="mt-2 flex flex-wrap items-center gap-2">
                                                    <Badge
                                                        className={getDifficultyColor(
                                                            problem.difficulty,
                                                        )}
                                                    >
                                                        {problem.difficulty}
                                                    </Badge>
                                                    {(problem.tags ?? [])
                                                        .slice(0, 3)
                                                        .map((topic) => (
                                                            <Badge
                                                                key={
                                                                    topic.tag
                                                                        .id
                                                                }
                                                                variant="outline"
                                                                className="text-xs"
                                                            >
                                                                {
                                                                    topic.tag
                                                                        .name
                                                                }
                                                            </Badge>
                                                        ))}
                                                    {(problem.tags?.length ??
                                                        0) > 3 && (
                                                        <Badge
                                                            variant="ghost"
                                                            className="text-xs"
                                                        >
                                                            +
                                                            {(problem.tags
                                                                ?.length ??
                                                                0) - 3}
                                                        </Badge>
                                                    )}
                                                </span>
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </ScrollArea>
                    ) : (
                        <div className="min-h-[260px] rounded-lg border border-dashed py-12 text-center">
                            <Plus className="mx-auto mb-3 size-8 text-foreground/30" />
                            <p className="font-medium">
                                {search
                                    ? "No matching problems"
                                    : "No problems available"}
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {search
                                    ? "Try a different search term."
                                    : "Every problem is already in this playlist."}
                            </p>
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-muted-foreground">
                        {selectedCount > 0
                            ? `${selectedCount} problem${selectedCount > 1 ? "s" : ""} ready to add`
                            : "Select one or more problems"}
                    </p>
                    <div className="flex justify-end gap-2">
                    <Button
                        variant="outline"
                        onClick={() => handleOpenChange(false)}
                        disabled={isSaving}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleAddProblems}
                        disabled={selectedCount === 0 || isSaving}
                    >
                        {isSaving && (
                            <Loader2 className="mr-2 size-4 animate-spin" />
                        )}
                        Add Selected
                    </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
