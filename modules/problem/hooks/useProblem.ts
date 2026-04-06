import { useMutation } from "@tanstack/react-query"
import { createProblem } from "../api/create.api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const useProblem = () => {
    const router = useRouter();
    const createProblemMutation = useMutation({
        mutationFn: createProblem,
        onSuccess: (res) => {
            if (!res.success) {
                toast.error(res.message);
                return;                                                                                                                                                                                                                                                                             
            }
            toast.success(res.message);
            router.push("/problems");
        },

        onError: (error) => {
            toast.error("Failed to create Problem.");
            console.log(error);
        }
    });

    return { 
        createProblem: createProblemMutation.mutateAsync,
        isCreateProblem: createProblemMutation.isPending
    }
};