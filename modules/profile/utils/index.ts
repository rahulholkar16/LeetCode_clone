import type { ProfileSubmission } from "@/types";

export function generateCalendarData(submissions: ProfileSubmission[]) {
    const submissionsByDate = new Map<string, ProfileSubmission[]>();

    submissions.forEach(sub => {
        const date = new Date(sub.createdAt).toISOString().split('T')[0];
        if (!submissionsByDate.has(date)) {
            submissionsByDate.set(date, []);
        }
        submissionsByDate.get(date)!.push(sub);
    });

    const calendarData: { date: string; count: number; problems: string[] }[] = [];
    const today = new Date();

    for (let i = 365; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateString = date.toISOString().split('T')[0];

        const daySubs = submissionsByDate.get(dateString) || [];
        const uniqueProblems = Array.from(new Set(daySubs.map(s => s.problemId)));

        calendarData.push({
            date: dateString,
            count: daySubs.length,
            problems: uniqueProblems,
        });
    }

    return calendarData;
}

export function getRecentActivity(submissions: ProfileSubmission[], limit = 10) {
    return submissions
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, limit);
}

export function getLanguageStats(submissions: ProfileSubmission[]) {
    const languageCount = new Map<string, number>();

    submissions.forEach(sub => {
        languageCount.set(sub.language, (languageCount.get(sub.language) || 0) + 1);
    });

    return Array.from(languageCount.entries())
        .map(([language, count]) => ({ language, count }))
        .sort((a, b) => b.count - a.count);
};
