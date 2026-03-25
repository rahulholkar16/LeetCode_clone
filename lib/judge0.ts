import { Judge0Result, Submission, SubmitBatchResponse } from '@/types';
import axios from 'axios';

export function getJudge0LanguageId(language: string): number {
    const languageMap: Record<string, number> = {
        "PYTHON": 71,
        "JAVASCRIPT": 63,
        "JAVA": 62,
        "CPP": 54,
        "GO": 60
    };

    return languageMap[language.toUpperCase()];
};

export async function submitBatch(submission: Array<Submission>): Promise<SubmitBatchResponse> {
    const { data } = await axios.post(
        `http://judge0-server:2358/submissions/batch?base64_encoded=false`,
        {
            submissions: submission,
        }
    );
    return data;
};

export async function pollBatchResults(tokens: Array<string>): Promise<Judge0Result[]> {
    let results: Judge0Result[];
    for (let i = 0; i < 10; i++) {
        const res = await axios.get(
            `http://judge0-server:2358/submissions/batch?tokens=${tokens.join(",")}&base64_encoded=false`
        ); 

        results = res.data.submissions;

        const allDone = results.every(r => r.status.id !== 1 && r.status.id !== 2);

        if (allDone) return results;

        await sleep(1000);
    }

    throw new Error("Judge0 timeout");
};

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));