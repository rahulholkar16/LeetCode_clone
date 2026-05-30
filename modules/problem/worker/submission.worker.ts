import "dotenv/config";

import { Worker } from "bullmq";
import { redis } from "@/lib/redis";
import { SUBMISSION_QUEUE_NAME } from "../constant";
import {
    markSubmissionFailed,
    processSubmission,
} from "../services/submission.service";
import type { SubmissionJobData } from "../services/submission.service";

const worker = new Worker<SubmissionJobData>(
    SUBMISSION_QUEUE_NAME,
    async (job) => {
        console.log(`Processing submission ${job.data.submissionId}`);
        return processSubmission(job.data);
    },
    {
        connection: redis,
        concurrency: Number(process.env.SUBMISSION_WORKER_CONCURRENCY ?? 3),
    },
);

worker.on("completed", (job) => {
    console.log(`Submission job ${job.id} completed`);
});

worker.on("failed", async (job, error) => {
    console.error(`Submission job ${job?.id ?? "unknown"} failed`, error);

    if (job && job.attemptsMade >= (job.opts.attempts ?? 1)) {
        await markSubmissionFailed(job.data.submissionId, error);
    }
});

const shutdown = async () => {
    await worker.close();
    await redis.quit();
    process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

console.log(`Submission worker listening on ${SUBMISSION_QUEUE_NAME}`);
