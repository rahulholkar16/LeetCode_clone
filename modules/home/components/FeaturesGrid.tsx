import { features } from "../constant";
export function FeaturesGrid() {
    return (
        <section className="px-4 sm:px-6 lg:px-8 pb-20">
            <div className="max-w-6xl mx-auto">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={index}
                                className="group relative bg-card border border-border rounded-2xl p-6 hover:border-transparent hover:shadow-2xl transition-all duration-300 overflow-hidden"
                            >
                                {/* Gradient Background on Hover */}
                                <div
                                    className={`absolute inset-0 bg-linear-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                                ></div>

                                <div className="relative z-10">
                                    <div
                                        className={`w-12 h-12 rounded-xl bg-linear-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                                    >
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-lg font-bold mb-2">
                                        {feature.title}
                                    </h3>
                                    <p className="text-sm text-foreground/60">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};