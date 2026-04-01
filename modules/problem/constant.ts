import { Language } from "@/types";

export const languages = [
    "Javascript",
    "Python",
    "Java",
    "Cpp",
];

export const getDifficultyColor = (difficulty: string) => {
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

export function getPlaceholder(language: Language): string {
    const placeholders: Record<Language, string> = {
        Javascript:
            "function twoSum(nums, target) {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        if (map.has(complement)) return [map.get(complement), i];\n        map.set(nums[i], i);\n    }\n}",
        Java: "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        Map<Integer, Integer> map = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int complement = target - nums[i];\n            if (map.containsKey(complement)) return new int[]{map.get(complement), i};\n            map.put(nums[i], i);\n        }\n        return new int[]{};\n    }\n}",
        Cpp: "class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        unordered_map<int,int> map;\n        for (int i = 0; i < nums.size(); i++) {\n            int complement = target - nums[i];\n            if (map.count(complement)) return {map[complement], i};\n            map[nums[i]] = i;\n        }\n        return {};\n    }\n};",
        Python: "class Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        seen = {}\n        for i, num in enumerate(nums):\n            complement = target - num\n            if complement in seen:\n                return [seen[complement], i]\n            seen[num] = i",
    };
    return placeholders[language];
}