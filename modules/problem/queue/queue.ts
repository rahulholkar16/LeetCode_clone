import { Queue } from "bullmq";
import { redis } from "@/lib/redis";
import type { SubmissionJobData } from "../services/submission.service";
import { SUBMISSION_QUEUE_NAME } from "../constant";

export const submissionQueue = new Queue<SubmissionJobData>(SUBMISSION_QUEUE_NAME, {
    connection: redis,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: "exponential",
            delay: 5000,
        },
        removeOnComplete: {
            age: 60 * 60 * 24,
            count: 1000,
        },
        removeOnFail: {
            age: 60 * 60 * 24 * 7,
        },
    },
});
