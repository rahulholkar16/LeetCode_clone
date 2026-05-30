import { Job, Worker } from "bullmq";
import { redis } from "@/lib/redis";
import { db } from "@/lib/db";
import { StatsJobData } from "@/types";

function calculateStreak(dates: Date[]) {
    if (dates.length === 0) {
        return {
            currentStreak: 0,
            maxStreak: 0,
        };
    }

    const uniqueDates = new Set(
        dates.map(
            (date) =>
                date.toISOString().split("T")[0]
        )
    );

    // Current Streak
    let currentStreak = 0;

    const today = new Date();

    while (true) {
        const dateString =
            today.toISOString().split("T")[0];

        if (uniqueDates.has(dateString)) {
            currentStreak++;
            today.setDate(
                today.getDate() - 1
            );
        } else {
            break;
        }
    }

    // Max Streak
    const sortedDates = Array.from(
        uniqueDates
    ).sort();

    let maxStreak = 0;
    let streak = 0;

    let previousDate: Date | null = null;

    for (const dateString of sortedDates) {
        const currentDate =
            new Date(dateString);

        if (!previousDate) {
            streak = 1;
        } else {
            const diffDays =
                Math.floor(
                    (currentDate.getTime() -
                        previousDate.getTime()) /
                    (1000 * 60 * 60 * 24)
                );

            if (diffDays === 1) {
                streak++;
            } else {
                streak = 1;
            }
        }

        maxStreak = Math.max(
            maxStreak,
            streak
        );

        previousDate = currentDate;
    }

    return {
        currentStreak,
        maxStreak,
    };
}

export const StatsWorker = new Worker(
    "stats",

    async (
        job: Job<StatsJobData>
    ) => {
        const { userId } = job.data;

        try {
            const [
                totalSolved,
                totalSubmissions,
                acceptedSubmissions,
                easySolved,
                mediumSolved,
                hardSolved,
                submissions,
            ] = await Promise.all([
                db.problemSolved.count({
                    where: { userId },
                }),

                db.submission.count({
                    where: { userId },
                }),

                db.submission.count({
                    where: {
                        userId,
                        status: "ACCEPTED",
                    },
                }),

                db.problemSolved.count({
                    where: {
                        userId,
                        problem: {
                            difficulty:
                                "EASY",
                        },
                    },
                }),

                db.problemSolved.count({
                    where: {
                        userId,
                        problem: {
                            difficulty:
                                "MEDIUM",
                        },
                    },
                }),

                db.problemSolved.count({
                    where: {
                        userId,
                        problem: {
                            difficulty:
                                "HARD",
                        },
                    },
                }),

                db.submission.findMany({
                    where: {
                        userId,
                    },

                    select: {
                        createdAt: true,
                    },
                }),
            ]);

            const acceptanceRate =
                totalSubmissions > 0
                    ? (
                        acceptedSubmissions /
                        totalSubmissions
                    ) * 100
                    : 0;

            const {
                currentStreak,
                maxStreak,
            } = calculateStreak(
                submissions.map(
                    (s) => s.createdAt
                )
            );

            await db.userStats.upsert({
                where: {
                    userId,
                },

                update: {
                    totalSolved,
                    totalSubmissions,
                    acceptedSubmissions,

                    easySolved,
                    mediumSolved,
                    hardSolved,

                    acceptanceRate,

                    currentStreak,
                    maxStreak,
                },

                create: {
                    userId,

                    totalSolved,
                    totalSubmissions,
                    acceptedSubmissions,

                    easySolved,
                    mediumSolved,
                    hardSolved,

                    acceptanceRate,

                    currentStreak,
                    maxStreak,
                },
            });

            console.log(
                `Stats updated for ${userId}`
            );
        } catch (error) {
            console.error(
                "Error updating user stats:",
                error
            );

            throw error;
        }
    },

    {
        connection: redis,
        concurrency: 5,
    }
);

StatsWorker.on(
    "completed",
    (job) => {
        console.log(
            `Stats job ${job.id} completed`
        );
    }
);

StatsWorker.on(
    "failed",
    (job, error) => {
        console.error(
            `Stats job ${job?.id ?? "unknown"
            } failed`,
            error
        );
    }
);

console.log(
    "Stats Worker Started 🚀"
);

const shutdown = async () => {
    await StatsWorker.close();
    await redis.quit();

    process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);