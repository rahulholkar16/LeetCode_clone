import { Job, Worker } from "bullmq";
import { redis } from "@/lib/redis";
import { db } from "@/lib/db";
import { StatsJobData } from "@/types";

const StatsWorker = new Worker('stats', async (job: Job<StatsJobData>) => {
    const { userId } = job.data;
    try {
        const totalSolved = await db.problemSolved.count({
            where: {
                userId: userId
            }
        });

        const totalSubmissions = await db.submission.count({
            where: {
                userId: userId
            }
        });

        const acceptedSubmissions = await db.submission.count({
            where: {
                userId: userId,
                status: "ACCEPTED"
            }
        });

        const easySolved = await db.problemSolved.count({
            where: {
                userId: userId,
                problem: {
                    difficulty: "EASY"
                }
            }
        });

        const mediumSolved = await db.problemSolved.count({
            where: {
                userId: userId,
                problem: {
                    difficulty: "MEDIUM"
                }
            }
        });

        const hardSolved = await db.problemSolved.count({
            where: {
                userId: userId,
                problem: {
                    difficulty: "HARD"
                }
            }
        });


        await db.userStats.upsert({
            where: {
                userId: userId
            },

            update: {
                totalSolved,
                totalSubmissions,
                acceptedSubmissions,
                easySolved,
                mediumSolved,
                hardSolved
            },

            create: {
                userId: userId,
                totalSolved,
                totalSubmissions,
                acceptedSubmissions,
                easySolved,
                mediumSolved,
                hardSolved
            }
        });
    } catch (error) {
        console.error("Error updating user stats:", error);
        throw error;
    }

}, { connection: redis });

StatsWorker.on("completed", (job) => {
    console.log(`Stats job ${job.id} completed`);
});

StatsWorker.on("failed", (job, error) => {
    console.error(`Stats job ${job?.id ?? "unknown"} failed`, error);
});

const shutdown = async () => {
    await StatsWorker.close();
    await redis.quit();
    process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);    
