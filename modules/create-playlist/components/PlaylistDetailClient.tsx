"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    Calendar,
    Circle,
    Edit,
    Globe,
    ListChecks,
    Loader2,
    Lock,
    MoreVertical,
    Plus,
    Trash2,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession } from "@/modules/auth/hooks/useSession";
import { getDifficultyColor } from "@/modules/problem/constant";
import type { PlaylistDetailClientProps, PlaylistPayload } from "@/types";
import {
    useDeletePlaylist,
    usePlaylists,
    useRemoveProblemFromPlaylist,
    useUpdatePlaylist,
} from "../hooks/use-playlists";
import { usePlaylistStore } from "../stores/playlist-store";
import { AddProblemsToPlaylistDialog } from "./AddProblemsToPlaylistDialog";
import { CreateEditPlaylistDialog } from "./CreateEditPlaylistDialog";

const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });

export function PlaylistDetailClient({ id }: PlaylistDetailClientProps) {
    const router = useRouter();
    const [isAddProblemsOpen, setIsAddProblemsOpen] = useState(false);
    const { data: session } = useSession();
    const playlists = usePlaylistStore((state) => state.playlists);
    const editingPlaylist = usePlaylistStore((state) => state.editingPlaylist);
    const closeDialog = usePlaylistStore((state) => state.closeDialog);
    const setEditingPlaylist = usePlaylistStore(
        (state) => state.setEditingPlaylist,
    );

    const { isLoading } = usePlaylists();
    const updatePlaylistMutation = useUpdatePlaylist();
    const deletePlaylistMutation = useDeletePlaylist();
    const removeProblemMutation = useRemoveProblemFromPlaylist(id);

    const playlist = playlists.find((current) => current.id === id);
    const isOwner = playlist?.userId === session?.user?.id;
    const problemCount = playlist?.problems?.length ?? 0;

    const handleUpdatePlaylist = async (playlistData: PlaylistPayload) => {
        if (!playlist) return;

        await updatePlaylistMutation
            .mutateAsync({
                playlistId: playlist.id,
                playlistData,
            })
            .catch(() => {});
    };

    const handleDeletePlaylist = async () => {
        if (!playlist) return;

        const confirmed = window.confirm(
            `Are you sure you want to delete "${playlist.name}"?`,
        );

        if (!confirmed) return;

        await deletePlaylistMutation
            .mutateAsync(playlist.id)
            .then(() => router.push("/playlist"))
            .catch(() => {});
    };

    const handleRemoveProblem = async (problemId: string) => {
        await removeProblemMutation.mutateAsync(problemId).catch(() => {});
    };

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
                <div className="text-center">
                    <Loader2 className="mx-auto mb-4 size-8 animate-spin text-primary" />
                    <p className="text-foreground/70">Loading playlist...</p>
                </div>
            </div>
        );
    }

    if (!playlist) {
        return (
            <div className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
                <div className="max-w-xl text-center">
                    <h1 className="mb-2 text-3xl font-bold">
                        Playlist Not Found
                    </h1>
                    <p className="mb-4 text-foreground/60">
                        The playlist you are looking for does not exist or you
                        do not have access to it.
                    </p>
                    <Button asChild>
                        <Link href="/playlist">
                            <ArrowLeft className="mr-2 size-4" />
                            Back to Playlists
                        </Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8">
                    <Button variant="ghost" asChild className="mb-4">
                        <Link href="/playlist">
                            <ArrowLeft className="mr-2 size-4" />
                            Back to Playlists
                        </Link>
                    </Button>

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0 flex-1">
                            <div className="mb-4 flex items-center gap-3">
                                {playlist.isPublic ? (
                                    <Globe className="size-6 shrink-0 text-green-500" />
                                ) : (
                                    <Lock className="size-6 shrink-0 text-yellow-500" />
                                )}
                                <h1 className="min-w-0 break-words text-4xl font-bold">
                                    {playlist.name}
                                </h1>
                            </div>

                            {playlist.description && (
                                <p className="mb-4 max-w-3xl text-lg text-foreground/70">
                                    {playlist.description}
                                </p>
                            )}

                            <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-foreground/60">
                                <span className="flex items-center gap-2">
                                    <ListChecks className="size-4" />
                                    {problemCount} problems
                                </span>
                                <span className="flex items-center gap-2">
                                    <Calendar className="size-4" />
                                    Updated {formatDate(playlist.updateAt)}
                                </span>
                            </div>

                            <Badge
                                variant={
                                    playlist.isPublic
                                        ? "outline"
                                        : "secondary"
                                }
                                className="text-xs"
                            >
                                {playlist.isPublic ? "Public" : "Private"}
                            </Badge>
                        </div>

                        {isOwner && (
                            <div className="flex items-center gap-2">
                                <Button
                                    onClick={() => setIsAddProblemsOpen(true)}
                                    className="gap-2"
                                >
                                    <Plus className="size-4" />
                                    Add Problems
                                </Button>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            aria-label="Playlist actions"
                                        >
                                            <MoreVertical className="size-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem
                                            onClick={() =>
                                                setEditingPlaylist(playlist)
                                            }
                                        >
                                            <Edit className="mr-2 size-4" />
                                            Edit Playlist
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={handleDeletePlaylist}
                                            variant="destructive"
                                        >
                                            <Trash2 className="mr-2 size-4" />
                                            Delete Playlist
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mb-4 flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-xl font-semibold">Problems</h2>
                        <p className="text-sm text-muted-foreground">
                            {problemCount > 0
                                ? `${problemCount} problem${problemCount > 1 ? "s" : ""} saved in this playlist`
                                : "Build this playlist by adding problems below"}
                        </p>
                    </div>
                    {isOwner && problemCount > 0 && (
                        <Button
                            variant="outline"
                            onClick={() => setIsAddProblemsOpen(true)}
                            className="gap-2 sm:self-start"
                        >
                            <Plus className="size-4" />
                            Add Problems
                        </Button>
                    )}
                </div>

                {problemCount > 0 ? (
                    <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border bg-muted/50">
                                        <th className="p-4 text-left font-semibold">
                                            Status
                                        </th>
                                        <th className="p-4 text-left font-semibold">
                                            Title
                                        </th>
                                        <th className="p-4 text-left font-semibold">
                                            Difficulty
                                        </th>
                                        {isOwner && (
                                            <th className="p-4 text-right font-semibold">
                                                Actions
                                            </th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {playlist.problems.map((entry, index) => (
                                        <tr
                                            key={entry.id}
                                            className="border-b border-border transition-colors last:border-b-0 hover:bg-muted/30"
                                        >
                                            <td className="p-4">
                                                <Circle className="size-4 text-foreground/40" />
                                            </td>
                                            <td className="p-4">
                                                <Link
                                                    href={`/problems/${entry.problem.id}`}
                                                    className="font-medium text-primary hover:text-primary/80"
                                                >
                                                    {index + 1}.{" "}
                                                    {entry.problem.title}
                                                </Link>
                                            </td>
                                            <td className="p-4">
                                                <Badge
                                                    className={getDifficultyColor(
                                                        entry.problem
                                                            .difficulty,
                                                    )}
                                                >
                                                    {entry.problem.difficulty}
                                                </Badge>
                                            </td>
                                            {isOwner && (
                                                <td className="p-4 text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleRemoveProblem(
                                                                entry.problemId,
                                                            )
                                                        }
                                                        disabled={
                                                            removeProblemMutation.isPending
                                                        }
                                                        className="text-destructive hover:text-destructive"
                                                    >
                                                        Remove
                                                    </Button>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="rounded-lg border border-dashed bg-card py-16 text-center shadow-sm">
                        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-muted">
                            <ListChecks className="size-7 text-foreground/40" />
                        </div>
                        <p className="mb-2 text-lg font-medium">
                            This playlist is empty
                        </p>
                        <p className="mx-auto mb-6 max-w-md text-sm text-muted-foreground">
                            Add problems directly from here and start building
                            a focused practice set.
                        </p>
                        {isOwner && (
                            <Button
                                onClick={() => setIsAddProblemsOpen(true)}
                                className="gap-2"
                            >
                                <Plus className="size-4" />
                                Add Problems
                            </Button>
                        )}
                    </div>
                )}

                {isOwner && (
                    <>
                        <AddProblemsToPlaylistDialog
                            open={isAddProblemsOpen}
                            onOpenChange={setIsAddProblemsOpen}
                            playlist={playlist}
                        />
                        <CreateEditPlaylistDialog
                            open={!!editingPlaylist}
                            onOpenChange={(open) => {
                                if (!open) closeDialog();
                            }}
                            onSave={handleUpdatePlaylist}
                            playlist={editingPlaylist}
                        />
                    </>
                )}
            </div>
        </div>
    );
}
