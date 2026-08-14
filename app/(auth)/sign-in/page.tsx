import SingInForm from "@/components/signin-form";
import { Code2 } from "lucide-react";
import Link from "next/link";

const SingInPage = () => {
    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-10 sm:px-6 lg:px-8">
            <div className="absolute left-10 top-20 h-72 w-72 rounded-full bg-yellow-500/20 blur-3xl"></div>
            <div className="absolute bottom-10 right-10 h-96 w-96 rounded-full bg-orange-500/20 blur-3xl"></div>
            <div className="relative z-10 w-full max-w-md">
                <div className="text-center mb-8">
                    <Link
                        href="/"
                        className="mb-4 inline-flex items-center gap-2 text-primary"
                    >
                        <div className="rounded-lg bg-linear-to-br from-yellow-400 to-orange-500 p-2">
                            <Code2 className="h-5 w-5 text-black" />
                        </div>
                        <span className="font-bold text-2xl">CodeMaster</span>
                    </Link>
                    <h1 className="mb-2 bg-linear-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-3xl font-bold text-transparent">
                        Welcome Back
                    </h1>
                    <p className="text-foreground/70">
                        Sign in to continue your coding journey
                    </p>
                </div>
                <SingInForm />
            </div>
        </div>
    );
};

export default SingInPage;
