import { difficulties } from "../constant";
export function DifficultyStats() {
    return (
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            {difficulties.map((diff, index) => (
                <div key={index} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${diff.color}`} />
                    <span className="text-foreground/60">{diff.level}:</span>
                    <span className="font-bold">{diff.count}</span>
                </div>
            ))}
        </div>
    );
};