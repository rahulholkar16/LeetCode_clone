import Link from "next/link";
import { categories } from "../constant";
export function CategoriesSection() {
    return (
        <section className="px-4 sm:px-6 lg:px-8 pb-20">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">
                        Popular Problem Categories
                    </h2>
                    <p className="text-foreground/60 text-lg">
                        Master essential topics for technical interviews
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {categories.map((category, index) => (
                        <Link
                            key={index}
                            href="/problems"
                            className="group bg-card border border-border rounded-xl px-6 py-4 text-center hover:border-orange-500 hover:bg-orange-500/5 transition-all duration-300"
                        >
                            <div className="font-semibold group-hover:text-orange-500 transition-colors">
                                {category}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
