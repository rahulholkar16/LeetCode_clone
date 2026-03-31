import { Difficulty, ProblemUIStore } from "@/types";
import { create } from "zustand";

export const useUiProblmStore = create<ProblemUIStore>((set) => ({
    title: "",
    difficulty: Difficulty.MEDIUM,
    tags: [],
    description: "",

    setTitle: (title) => set({ title }),
    setTag: (tag) => set((state) => ({
        tags: (state.tags as string[]).includes(tag) ? state.tags : [...state.tags, tag],
    })),
    setDifficulty: (difficulty) => set({
        difficulty
    }),
    removeTag: (tag) => set((state) => ({
        tags: state.tags.filter((t) => t !== tag),
    })),

    setDescription: (description) => set({ description }),
}));
