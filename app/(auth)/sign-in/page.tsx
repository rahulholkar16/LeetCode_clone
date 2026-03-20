import SingInForm from "@/components/signin-form";
import { Code2 } from "lucide-react";
import Link from "next/link";

const SingInPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-primary mb-4"
                    >
                        <Code2 className="w-10 h-10" />
                        <span className="font-bold text-2xl">CodeMaster</span>
                    </Link>
                    <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
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
