import { Badge } from "@/components/ui/badge";
import { Problem } from "@/types";

interface ProblemHeaderProps {
    problem: Problem;
}

export function ProblemHeader({ problem }: ProblemHeaderProps) {
    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case "EASY":
                return "bg-green-500/10 text-green-500 border-green-500/20";
            case "MEDIUM":
                return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
            case "HARD":
                return "bg-red-500/10 text-red-500 border-red-500/20";
            default:
                return "";
        }
    };

    return (
        <div className="mb-6 pb-6 border-b border-border">
            <div className="flex items-center gap-3 mb-4">
                <h1 className="text-2xl font-bold">{problem.title}</h1>
            </div>

            <div className="flex items-center gap-3 mb-4 flex-wrap">
                <Badge className={getDifficultyColor(problem.difficulty)}>
                    {problem.difficulty}
                </Badge>

                {(problem.tags ?? []).map((tagItem) => (
                    <Badge
                        key={tagItem.tag.id}
                        variant="outline"
                        className="text-xs"
                    >
                        {tagItem.tag.name}
                    </Badge>
                ))}
            </div>
        </div>
    );
};