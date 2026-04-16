
import { CreateProblem } from "@/types";
import { problemSchema } from "../validators/problem.validator";

export const createProblem = async (data: CreateProblem) => {    
    const validated = problemSchema.safeParse(data);

    if (!validated.success) {
        return {
            success: false,
            message: validated.error.issues.map((e) => e.message).join(", "),
        };
    }
    
    try {
        const result = await fetch("/api/create-problem", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(validated.data),
        });

        const response = await result.json(); 
        if (!result.ok) {
            return {
                success: false,
                message: response.message || "Something went wrong.",
            };
        }

        return {
            success: true,
            data: result,
            message: "Problem create successfully.",
        };
    } catch (error) {
        console.error("ERROR:: ", error);
        return {
            success: false,
            message: "Something went wrong. Try again!",
        };
    }
};