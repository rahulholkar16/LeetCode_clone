"use client";

import { ChildrenProps } from "@/types";
import { useSession } from "../hooks/useSession";
import { Spinner } from "@/components/ui/spinner";

const AuthLayer = ({ children }: ChildrenProps) => {
    const { isLoading } = useSession();

    if (isLoading)
        return (
            <div className="flex items-center justify-center h-screen">
                <Spinner />
            </div>
        );

    return <>{children}</>;
};

export default AuthLayer;
