import { useQuery } from "@tanstack/react-query";
import { getProblemById } from "../actions/problem.action";
import { useProblmStore } from "../stores/problem-store";

export const useGetProblemById = (id: string) => {
    const addProblem = useProblmStore((state) => state.addProblem);

    const query = useQuery({
        queryKey: ["problem", id],
        queryFn: async () => {
            const result = await getProblemById(id);
            if (result.success && result.data) {
                addProblem(result.data);
            }
            return result;
        },
        staleTime: 1000 * 60 * 5,
    });

    return query;
};