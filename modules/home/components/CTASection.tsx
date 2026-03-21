import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Award } from "lucide-react";

export function CTASection() {
    return (
        <section className="px-4 sm:px-6 lg:px-8 pb-24">
            <div className="max-w-4xl mx-auto">
                <div className="relative bg-linear-to-r from-yellow-400 to-orange-500 rounded-3xl p-12 text-center overflow-hidden">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIgb3BhY2l0eT0iMC4xIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>

                    <div className="relative z-10">
                        <Award className="w-16 h-16 mx-auto mb-6 text-black" />
                        <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
                            Ready to Start Coding?
                        </h2>
                        <p className="text-black/80 text-lg mb-8 max-w-2xl mx-auto">
                            Join thousands of developers improving their skills
                            every day. Create your free account and solve your
                            first problem now!
                        </p>
                        <Button
                            asChild
                            size="lg"
                            className="bg-black hover:bg-black/90 text-white font-bold text-lg px-8 shadow-xl"
                        >
                            <Link href="/signup">Start Learning Now</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
};