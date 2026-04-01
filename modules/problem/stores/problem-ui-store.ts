import { CodeSnippet, Difficulty, Example, ProblemUIStore, TestCase } from "@/types";
import { create } from "zustand";

const createEmptyExample = (): Example => ({
    id: crypto.randomUUID(),
    input: "",
    output: "",
    explanation: "",
});

const createEmptyTestCase = (): TestCase => ({
    id: crypto.randomUUID(),
    input: "",
    output: "",
    isHidden: false
});

const createEmptyCodeSnippet = (): CodeSnippet => ({
    id: crypto.randomUUID(),
    language: "Javascript",
    code: "",
});

export const useUiProblmStore = create<ProblemUIStore>((set) => ({
    title: "",
    difficulty: Difficulty.MEDIUM,
    tags: [],
    description: "",
    constraints: "",
    examples: [createEmptyExample()],
    testCases: [createEmptyTestCase()],
    codeSnippets: [createEmptyCodeSnippet()],

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

    addTestCase: () => set((state) => ({
        testCases: [...state.testCases, createEmptyTestCase()],
    })),
    updateTestCase: (id, field, value) => set((state) => ({
        testCases: state.testCases.map((testCase) => testCase.id === id ? {...testCase, [field]: value} : testCase)
    })),
    removeTestCase: (id) => set((state) => ({
        testCases: state.testCases.length  > 1 ? state.testCases.filter((testCase) => testCase.id !== id) : state.testCases
    })),

    addCodeSnippet: () => set((state) => ({
        codeSnippets: [...state.codeSnippets, createEmptyCodeSnippet()]
    })),
    removeCodeSnippet: (id) => set((state) => ({
        codeSnippets: state.codeSnippets.length > 1 ? state.codeSnippets.filter((codeSnippet) => codeSnippet.id !== id) : state.codeSnippets
    })),
    updateCodeSnippet: (id, field, value) => set((state) => ({
        codeSnippets: state.codeSnippets.map((codeSnippet) => codeSnippet.id === id ? {...codeSnippet, [field]: value} : codeSnippet)
    })),

}));