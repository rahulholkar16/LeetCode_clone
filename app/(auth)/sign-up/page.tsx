import SignUpForm from "@/components/signup-form";
export default function SignupPage() {
    return (
        <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-background px-4 py-10 sm:px-6 lg:px-8">
            <div className="absolute left-10 top-20 h-72 w-72 rounded-full bg-yellow-500/20 blur-3xl"></div>
            <div className="absolute bottom-10 right-10 h-96 w-96 rounded-full bg-orange-500/20 blur-3xl"></div>
            <div className="relative z-10 w-full max-w-md">
                <SignUpForm />
            </div>
        </div>
    );
}
