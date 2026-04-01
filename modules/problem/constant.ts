export const languages = [
    "Javascript",
    "Python",
    "Java",
    "Cpp",
];

export const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
        case "Easy":
            return "bg-green-500/10 text-green-500 border-green-500/20";
        case "Medium":
            return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
        case "Hard":
            return "bg-red-500/10 text-red-500 border-red-500/20";
        default:
            return "";
    }
};