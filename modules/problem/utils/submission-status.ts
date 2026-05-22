export type SubmissionStatusCategory =
    | "Accepted"
    | "Wrong Answer"
    | "Time Limit Exceeded"
    | "Runtime Error"
    | "Compile Error"
    | "Pending"
    | "Other";

export const getSubmissionStatusCategory = (
    status: string,
): SubmissionStatusCategory => {
    if (status === "Accepted") return "Accepted";
    if (status === "Wrong Answer") return "Wrong Answer";
    if (status === "Time Limit Exceeded") return "Time Limit Exceeded";
    if (status === "Pending") return "Pending";

    if (status.includes("Runtime Error")) return "Runtime Error";
    if (status.includes("Compile") || status.includes("Compilation Error")) {
        return "Compile Error";
    }

    return "Other";
};

export const isSubmissionError = (status: string) => {
    const category = getSubmissionStatusCategory(status);
    return category === "Runtime Error" || category === "Compile Error";
};
