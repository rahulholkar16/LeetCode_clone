"use client";
import {
    generateCalendarData,
    getRecentActivity,
    getLanguageStats,
} from "../utils/index";
import {
  Settings,
  Share2,
  Trophy,
  TrendingUp,
  Calendar as CalendarIcon,
  Flame,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { useProfileQuery } from '../hooks/useProfileQuery';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SubmissionCalendar } from './SubmissionCalendar';
import { Progress } from '@/components/ui/progress';
import { Spinner } from '@/components/ui/spinner';
import Image from 'next/image';

export function ProfileView() {
    const { data, isLoading, error } = useProfileQuery();
    if (isLoading) return (
        <div className="flex items-center justify-center h-screen">
            <Spinner className="size-8 text-amber-400" />
        </div>
    );
    if (error) return <div>Failed to load profile.</div>;
    if (!data) return null;
    // Calculate stats from submissions
    if (!data.stats) {
        return <div>Stats not found</div>;
    }

    const stats = data.stats;
    const streak = {
        currentStreak: stats.currentStreak,
        maxStreak: stats.maxStreak,
    };
    const calendarData = generateCalendarData(data?.submission);
    const recentActivity = getRecentActivity(data?.submission, 5);
    const languageStats = getLanguageStats(data?.submission);
    const memberSince = new Date(data.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
    });

    const formatTime = (timestamp: string) => {
        const now = new Date();
        const date = new Date(timestamp);
        const diff = now.getTime() - date.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days}d ago`;
        if (hours > 0) return `${hours}h ago`;
        return "Just now";
    };

    return (
        <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8">
            <div className="max-w-7xl mx-auto">
                {/* Profile Header */}
                <div className="mb-8">
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-6">
                            {data.image ? (
                                <Image
                                    src={data.image}
                                    alt={data.name}
                                    width={96}
                                    height={96}
                                    className="w-24 h-24 rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-4xl font-bold text-black">
                                    {data.name.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <div>
                                <h1 className="text-4xl font-bold mb-2">
                                    {data.name}
                                </h1>
                                <p className="text-foreground/70 mb-3">
                                    {data.email}
                                </p>
                                <div className="flex items-center gap-2">
                                    <Badge
                                        variant="outline"
                                        className="capitalize"
                                    >
                                        {data.role}
                                    </Badge>
                                    {data.emailVerified && (
                                        <Badge
                                            variant="secondary"
                                            className="gap-1"
                                        >
                                            <CheckCircle className="h-3 w-3" />
                                            Verified
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="icon">
                                <Share2 className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon">
                                <Settings className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="flex items-center gap-8 text-sm text-foreground/60">
                        <div>
                            <span className="text-foreground font-semibold">
                                {stats.totalSolved}
                            </span>{" "}
                            problems solved
                        </div>
                        <div>
                            <span className="text-foreground font-semibold">
                                {stats.acceptanceRate.toFixed(1)}%
                            </span>{" "}
                            acceptance rate
                        </div>
                        <div>
                            <span className="text-foreground font-semibold">
                                {streak.currentStreak}
                            </span>{" "}
                            day streak
                        </div>
                        <div>
                            <span className="text-foreground font-semibold">
                                Member since {memberSince}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-foreground/60">
                                        Problems Solved
                                    </p>
                                    <p className="text-3xl font-bold">
                                        {stats.totalSolved}
                                    </p>
                                    <p className="text-xs text-foreground/40 mt-1">
                                        Total submissions:{" "}
                                        {stats.totalSubmissions}
                                    </p>
                                </div>
                                <Trophy className="h-10 w-10 text-yellow-500" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-foreground/60">
                                        Acceptance Rate
                                    </p>
                                    <p className="text-3xl font-bold">
                                        {stats.acceptanceRate.toFixed(1)}%
                                    </p>
                                    <p className="text-xs text-foreground/40 mt-1">
                                        {stats.acceptedSubmissions} /{" "}
                                        {stats.totalSubmissions}
                                    </p>
                                </div>
                                <TrendingUp className="h-10 w-10 text-green-500" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-foreground/60">
                                        Current Streak
                                    </p>
                                    <p className="text-3xl font-bold">
                                        {streak.currentStreak}
                                    </p>
                                    <p className="text-xs text-foreground/40 mt-1">
                                        Max: {streak.maxStreak} days
                                    </p>
                                </div>
                                <Flame className="h-10 w-10 text-orange-500" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-foreground/60">
                                        Playlists
                                    </p>
                                    <p className="text-3xl font-bold">
                                        {data.playlists.length}
                                    </p>
                                    <p className="text-xs text-foreground/40 mt-1">
                                        created
                                    </p>
                                </div>
                                <CalendarIcon className="h-10 w-10 text-blue-500" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Submission Calendar */}
                <div className="mb-8">
                    <SubmissionCalendar submissions={calendarData} />
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Activity */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Submissions</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {recentActivity.length > 0 ? (
                                        recentActivity.map((submission) => (
                                            <div
                                                key={submission.id}
                                                className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors"
                                            >
                                                <div className="flex items-center gap-4 flex-1">
                                                    <div className="shrink-0">
                                                        {submission.status ===
                                                        "Accepted" ? (
                                                            <CheckCircle className="h-5 w-5 text-green-500" />
                                                        ) : (
                                                            <XCircle className="h-5 w-5 text-red-500" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="font-medium">
                                                                Problem
                                                            </span>
                                                            <Badge
                                                                variant="secondary"
                                                                className="text-xs"
                                                            >
                                                                {
                                                                    submission.language
                                                                }
                                                            </Badge>
                                                        </div>
                                                        <div className="flex items-center gap-3 text-xs text-foreground/60">
                                                            {submission.status ===
                                                                "Accepted" &&
                                                                submission.time && (
                                                                    <>
                                                                        <span>
                                                                            {
                                                                                submission.time
                                                                            }
                                                                        </span>
                                                                        <span>
                                                                            •
                                                                        </span>
                                                                        <span>
                                                                            {
                                                                                submission.memory
                                                                            }
                                                                        </span>
                                                                    </>
                                                                )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 shrink-0">
                                                    <Badge
                                                        variant={
                                                            submission.status ===
                                                            "Accepted"
                                                                ? "default"
                                                                : "destructive"
                                                        }
                                                        className={
                                                            submission.status ===
                                                            "Accepted"
                                                                ? "bg-green-500/10 text-green-500 hover:bg-green-500/20"
                                                                : ""
                                                        }
                                                    >
                                                        {submission.status}
                                                    </Badge>
                                                    <span className="text-xs text-foreground/40">
                                                        {formatTime(
                                                            submission.createdAt,
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8 text-foreground/50">
                                            No submissions yet
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Language Stats */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle>Languages Used</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {languageStats.length > 0 ? (
                                        languageStats.map((lang) => {
                                            const percentage =
                                                (lang.count /
                                                    stats.totalSubmissions) *
                                                100;
                                            return (
                                                <div
                                                    key={lang.language}
                                                    className="space-y-2"
                                                >
                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="font-medium capitalize">
                                                            {lang.language.toLowerCase()}
                                                        </span>
                                                        <span className="text-foreground/60">
                                                            {lang.count}{" "}
                                                            submissions
                                                        </span>
                                                    </div>
                                                    <Progress
                                                        value={percentage}
                                                        className="h-2"
                                                    />
                                                    <p className="text-xs text-foreground/40">
                                                        {percentage.toFixed(1)}%
                                                    </p>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="text-center py-8 text-foreground/50">
                                            No data available
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
