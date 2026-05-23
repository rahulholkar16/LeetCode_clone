import { Queue } from 'bullmq';
import { redis } from '@/lib/redis';

const StatsQueue = new Queue('stats', {
    connection: redis,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
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

export default StatsQueue;