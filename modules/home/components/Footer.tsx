import { Code2, Github, Twitter, Linkedin, Mail, Heart } from "lucide-react";
import Link from "next/link";

export function Footer() {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        product: [
            { name: "Problems", path: "/problems" },
            { name: "About", path: "/about" },
            { name: "Profile", path: "/profile" },
        ],
        resources: [
            { name: "Documentation", path: "#" },
            { name: "Tutorials", path: "#" },
            { name: "Blog", path: "#" },
        ],
        company: [
            { name: "About Us", path: "/about" },
            { name: "Contact", path: "#" },
            { name: "Careers", path: "#" },
        ],
        legal: [
            { name: "Privacy Policy", path: "#" },
            { name: "Terms of Service", path: "#" },
            { name: "Cookie Policy", path: "#" },
        ],
    };

    const socialLinks = [
        { icon: Github, href: "https://github.com", label: "GitHub" },
        { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
        { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
        { icon: Mail, href: "mailto:contact@leetcode.com", label: "Email" },
    ];

    return (
        <footer className="border-t border-border/40 bg-background/95 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Main Footer Content */}
                <div className="py-12 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
                    {/* Brand Section */}
                    <div className="col-span-2">
                        <Link
                            href="/"
                            className="flex items-center gap-2 mb-4 group"
                        >
                            <div className="p-2 rounded-lg bg-linear-to-br from-yellow-400 to-orange-500 group-hover:from-yellow-500 group-hover:to-orange-600 transition-all">
                                <Code2 className="w-5 h-5 text-black" />
                            </div>
                            <span className="font-bold text-xl">
                                CodeMaster
                            </span>
                        </Link>
                        <p className="text-foreground/60 text-sm mb-4 max-w-xs">
                            Master coding interviews with thousands of practice
                            problems and expert solutions.
                        </p>
                        {/* Social Links */}
                        <div className="flex items-center gap-3">
                            {socialLinks.map((social, index) => {
                                const Icon = social.icon;
                                return (
                                    <a
                                        key={index}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 rounded-lg hover:bg-accent/50 transition-all"
                                        aria-label={social.label}
                                    >
                                        <Icon className="w-5 h-5 text-foreground/60 hover:text-foreground transition-colors" />
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    {/* Product Links */}
                    <div>
                        <h3 className="font-semibold mb-4">Product</h3>
                        <ul className="space-y-3">
                            {footerLinks.product.map((link, index) => (
                                <li key={index}>
                                    <Link
                                        href={link.path}
                                        className="text-foreground/60 hover:text-foreground text-sm transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources Links */}
                    <div>
                        <h3 className="font-semibold mb-4">Resources</h3>
                        <ul className="space-y-3">
                            {footerLinks.resources.map((link, index) => (
                                <li key={index}>
                                    <a
                                        href={link.path}
                                        className="text-foreground/60 hover:text-foreground text-sm transition-colors"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h3 className="font-semibold mb-4">Company</h3>
                        <ul className="space-y-3">
                            {footerLinks.company.map((link, index) => (
                                <li key={index}>
                                    <Link
                                        href={link.path}
                                        className="text-foreground/60 hover:text-foreground text-sm transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h3 className="font-semibold mb-4">Legal</h3>
                        <ul className="space-y-3">
                            {footerLinks.legal.map((link, index) => (
                                <li key={index}>
                                    <a
                                        href={link.path}
                                        className="text-foreground/60 hover:text-foreground text-sm transition-colors"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="py-6 border-t border-border/40">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-foreground/60">
                            © {currentYear} LeetCode Clone. All rights reserved.
                        </p>
                        <p className="text-sm text-foreground/60 flex items-center gap-1">
                            Made with{" "}
                            <Heart className="w-4 h-4 text-red-500 fill-red-500" />{" "}
                            by Rahul, for developers
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};