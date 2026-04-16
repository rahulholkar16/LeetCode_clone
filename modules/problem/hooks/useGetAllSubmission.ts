"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllSubmissionByUser } from "../actions/problem.action";
import { useUiProblmStore } from "../stores/problem-ui-store";

const useGetAllSubmission = (id: string) => {
    const setSubmissions = useUiProblmStore(s => s.setSubmissions)
    return useQuery({
        queryKey: ["submissions", id],
        queryFn: async () => {
            const res = await getAllSubmissionByUser(id);
            if (res.success && res.submissions) {
                setSubmissions(res.submissions)
            }
            return res;
        },
        staleTime: 1000 * 60 * 5
    });
}

export default useGetAllSubmission;