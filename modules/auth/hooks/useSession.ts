import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../store/auth-store";
import { getSession } from "../api/auth.api";

export const useSession = () => {
    const setUser = useAuthStore(s => s.setUser);

    const {status, error, isPending, data} = useQuery({
        queryKey: ["session"],
        queryFn: getSession,
    });

    if (data?.session?.user ) {
        setUser(data?.session?.user)
    }

    return { isPending, status, error, data };
};