"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { QueryProviderProp } from "@/types";
import { useState } from "react";

export const QueryProvider = ({ children }: QueryProviderProp) => {
    const [client] = useState(() => new QueryClient())
    return (
        <QueryClientProvider client={client}>
            {children}
        </QueryClientProvider>
    );
};