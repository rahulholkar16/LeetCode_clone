// modules/home/components/HeroSection.tsx

import { Button } from "@/components/ui/button";
import { ChevronRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { difficulties } from "../constant";

export function HeroSection() {
    return (
        <section className="relative px-4 sm:px-6 lg:px-8 pt-24 pb-20 overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

            <div className="max-w-6xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-yellow-400/20 to-orange-500/20 border border-yellow-500/30 text-foreground mb-8 animate-bounce-slow">
                        <Sparkles className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-semibold">
                            Start Your Coding Journey Today
                        </span>
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                        <span className="block mb-2">Elevate Your</span>
                        <span className="bg-linear-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                            Coding Skills
                        </span>
                    </h1>

                    <p className="text-xl text-foreground/70 mb-10 max-w-2xl mx-auto">
                        Master algorithms, ace technical interviews, and become
                        a better developer with our comprehensive
                        problem-solving platform.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                        <Button
                            asChild
                            size="lg"
                            className="bg-linear-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold text-lg px-6 py-5 shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 transition-all"
                        >
                            <Link
                                href="/signup"
                                className="flex items-center gap-2"
                            >
                                Get Started Free
                                <ChevronRight className="w-5 h-5" />
                            </Link>
                        </Button>
                        <Button
                            asChild
                            size="lg"
                            variant="outline"
                            className="border-2 text-lg px-6 py-5 hover:bg-accent"
                        >
                            <Link href="/problems">Browse Problems</Link>
                        </Button>
                    </div>

                    {/* Difficulty Stats */}
                    <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
                        {difficulties.map((diff, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-2"
                            >
                                <div
                                    className={`w-3 h-3 rounded-full ${diff.color}`}
                                ></div>
                                <span className="text-foreground/60">
                                    {diff.level}:
                                </span>
                                <span className="font-bold">{diff.count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};