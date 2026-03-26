import { z } from "zod";

export const problemSchema = z.object({
    title: z.string().min(3, {message: "Title must be at least 3 characters."}),
    description: z.string().min(10, { message: "Description must be at least 10 characters." }),
    difficulty: z.enum(["EASY", "MEDIUM", "HARD"], { message: "Invalid difficulty" }),
    tags: z.array(z.string()).min(1, { message: "At least 1 tag is required." }),
    constraints: z.string().min(1, "Constraints are required."),
    hints: z.string().optional(),
    editorial: z.string().optional(),
    testCases: z.array(
        z.object({
            input: z.string().min(1, { message: "Input is required." }),
            output: z.string().min(1, { message: "Output is required." }),
        })
    ).min(1, "At least 1 test case is required."),
    examples: z.object({
        input: z.string().min(1, "Input is required."),
        output: z.string().min(1, { message: "Output is required." }),
        explanation: z.string().optional()
    }),
    codeSnippets: z.object({
        JAVASCRIPT: z.string().min(1, { message: "JavaScript code snippet is required." }),
        PYTHON: z.string().min(1, { message: "Python code snippet is required." }),
        JAVA: z.string().min(1, { message: "Java code snippet is required." }),
    }),
    referenceSolutions: z.object({
        JAVASCRIPT: z.string().min(1, { message: "JavaScript solution is required." }),
        PYTHON: z.string().min(1, { message: "Python solution is required." }),
        JAVA: z.string().min(1, { message: "Java solution is required." }),
    }),
});