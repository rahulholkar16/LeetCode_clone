import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useAuthStore } from "@/modules/auth/store/auth-store";
import { fetchSession } from "../api/session.api";

export const useSession = () => {
    const setUser = useAuthStore((s) => s.setUser);

    const { data, isLoading } = useQuery({
        queryKey: ["session"],
        queryFn: fetchSession,
        staleTime: 1000 * 60 * 5,
        retry: false,
    });

    useEffect(() => {
        if (data) {
            setUser(data?.user || null);
        }
    }, [data, setUser]);

    return { data, isLoading };
};