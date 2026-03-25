import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="text-center">
                <h1 className="text-9xl font-bold mb-4 bg-linear-to-r from-yellow-400 to-purple-600 bg-clip-text text-transparent">
                    404
                </h1>
                <h2 className="text-3xl font-bold mb-4">Page Not Found</h2>
                <p className="text-foreground/70 mb-8 max-w-md mx-auto">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <Button asChild size="lg">
                    <Link href="/">
                        <Home className="w-4 h-4 mr-2" />
                        Back to Home
                    </Link>
                </Button>
            </div>
        </div>
    );
}
