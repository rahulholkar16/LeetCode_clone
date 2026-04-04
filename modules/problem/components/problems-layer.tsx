"use client";

import { ChildrenProps } from "@/types";
import { useGetAllProblems } from "../hooks/useGetAllProblems";

const ProblemsLayer = ({ children }: ChildrenProps) => {
    useGetAllProblems();
    return <>{children}</>;
};

export default ProblemsLayer;