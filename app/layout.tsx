import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";

import "./globals.css";

import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/components/provider/query-provider";
import { CircleX } from "lucide-react";
import { ThemeProvider } from "@/components/provider/theme-provider";
import AuthLayer from "@/modules/auth/components/auth-layer";

export const metadata: Metadata = {
    title: "Code Master",
    description:
        "Master algorithms, ace technical interviews, and become a better developer with our comprehensive problem-solving platform.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className={cn("font-sans", GeistSans.variable)}
            suppressHydrationWarning
        >
            <body
                className="antialiased"
                style={{
                    fontFamily: '"Inter Variable", sans-serif',
                }}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <QueryProvider>
                        <AuthLayer>{children}</AuthLayer>
                    </QueryProvider>
                </ThemeProvider>

                <Toaster
                    icons={{
                        error: <CircleX color="#ff0000" />,
                    }}
                />
            </body>
        </html>
    );
};