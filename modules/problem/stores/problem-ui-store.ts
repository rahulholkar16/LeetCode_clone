import { Difficulty, Example, ProblemUIStore } from "@/types";
import { create } from "zustand";

const createEmptyExample = (): Example => ({
    id: crypto.randomUUID(),
    input: "",
    output: "",
    explanation: "",
});

export const useUiProblmStore = create<ProblemUIStore>((set) => ({
    title: "",
    difficulty: Difficulty.MEDIUM,
    tags: [],
    description: "",
    constraints: "",
    examples: [createEmptyExample()],

    setTitle: (title) => set({ title }),

    setTag: (tag) => set((state) => ({
        tags: (state.tags as Array<string>).includes(tag) ? state.tags : [...state.tags, tag],
    })),

    setDifficulty: (difficulty) => set({
        difficulty,
    }),

    removeTag: (tag) => set((state) => ({
        tags: state.tags.filter((t) => t !== tag),
    })),

    setDescription: (description) => set({ description }),
    setConstraints: (constraints) => set({ constraints }),

    addExample: () => set((state) => ({
        examples: [...state.examples, createEmptyExample()],
    })),

    removeExample: (id) => set((state) => ({
        examples:
            state.examples.length > 1
                ? state.examples.filter((example) => example.id !== id)
                : state.examples,
    })),

    updateExample: (id, field, value) => set((state) => ({
        examples: state.examples.map((example) =>
            example.id === id ? { ...example, [field]: value } : example
        ),
    })),
}));