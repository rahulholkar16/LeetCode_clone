"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useProblmStore } from "../stores/problem-store";
import { getProblemById } from "../actions/problem.action";

export const useGetProblemById = (id: string) => {
    const addProblem = useProblmStore((state) => state.addProblem);

    const query = useQuery({
        queryKey: ["problem", id],
        queryFn: () => getProblemById(id),
        staleTime: 1000 * 60 * 5,
    });

    useEffect(() => {
        if (query.data?.success && query.data.data) {
            addProblem(query.data.data);
        }
    }, [query.data, addProblem]);

    return query;
};