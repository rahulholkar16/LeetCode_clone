"use client";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { useAuthStore } from "@/modules/auth/store/auth-store";
import { Code2, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const Navbar = ({ userRole }) => {
    const { user } = useAuthStore();
    const isLoggedIn = !!user;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    return (
        <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
            <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-primary group flex-shrink-0"
                    >
                        <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500">
                            <Code2 className="w-5 h-5 text-black" />
                        </div>
                        <span className="font-bold text-xl">CodeMaster</span>
                    </Link>

                    {/* Center Links */}
                    <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
                        <Link
                            href="/problems"
                            className="px-4 py-2 rounded-lg text-foreground/70 hover:text-foreground hover:bg-accent/50"
                        >
                            Problems
                        </Link>
                        <Link
                            href="/about"
                            className="px-4 py-2 rounded-lg text-foreground/70 hover:text-foreground hover:bg-accent/50"
                        >
                            About
                        </Link>
                        <Link
                            href="/profile"
                            className="px-4 py-2 rounded-lg text-foreground/70 hover:text-foreground hover:bg-accent/50"
                        >
                            Profile
                        </Link>
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <ModeToggle />

                        {/* 🔐 AUTH LOGIC */}
                        <div className="hidden md:flex items-center gap-2">
                            {isLoggedIn ? (
                                <>
                                    {/* ADMIN BUTTON */}
                                    {user?.role === userRole.ADMIN && (
                                        <Button asChild variant="outline">
                                            <Link href="/create-problem">
                                                Create Problem
                                            </Link>
                                        </Button>
                                    )}

                                    {/* USER PROFILE */}
                                    <Button asChild variant="ghost">
                                        <Link href="/profile">Profile</Link>
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button
                                        asChild
                                        variant="ghost"
                                        className="rounded-lg"
                                    >
                                        <Link href="/sign-in">Sign In</Link>
                                    </Button>

                                    <Button
                                        asChild
                                        className="bg-linear-to-r from-yellow-400 to-orange-500 text-black font-semibold rounded-lg"
                                    >
                                        <Link href="/sign-up">Sign Up</Link>
                                    </Button>
                                </>
                            )}
                        </div>

                        {/* Mobile Toggle */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg hover:bg-accent/50"
                        >
                            {mobileMenuOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>

                {/* 📱 MOBILE MENU */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 space-y-2 border-t border-border/40">
                        <Link
                            href="/problems"
                            className="block px-4 py-2 rounded-lg"
                        >
                            Problems
                        </Link>

                        <Link
                            href="/about"
                            className="block px-4 py-2 rounded-lg"
                        >
                            About
                        </Link>

                        <Link
                            href="/profile"
                            className="block px-4 py-2 rounded-lg"
                        >
                            Profile
                        </Link>

                        <div className="pt-2 space-y-2">
                            {isLoggedIn ? (
                                <>
                                    {user?.role === userRole.ADMIN && (
                                        <Button asChild className="w-full">
                                            <Link href="/create-problem">
                                                Create Problem
                                            </Link>
                                        </Button>
                                    )}

                                    <Button
                                        asChild
                                        variant="ghost"
                                        className="w-full"
                                    >
                                        <Link href="/profile">Profile</Link>
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button
                                        asChild
                                        variant="ghost"
                                        className="w-full"
                                    >
                                        <Link href="/sign-in">Sign In</Link>
                                    </Button>

                                    <Button
                                        asChild
                                        className="w-full bg-yellow-400 text-black"
                                    >
                                        <Link href="/sign-up">Sign Up</Link>
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
