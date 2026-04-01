import { ReactNode } from "react";

/**
 * Common Types 
*/
export interface ChildrenProps {
    children: ReactNode;
}

export type ActionResponse<T> = {
    success: boolean;
    data?: T;
    message?: string;
};

/**
 * AUTH Types 
*/
export type Role = "USER" | "ADMIN";

export interface User {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    emailVerified: boolean;
    name: string;
    image?: string | null;
    role: Role;
}

export interface SignInUserData {
    email: string;
    password: string;
}

export interface SignUpUserData extends SignInUserData {
    name: string;
}

export type AuthState = {
    user: User | null;
    isAuthenticated: boolean;
    setUser: (user: User | null) => void;
    logout: () => void;
};

export interface AvatarDropdownProp {
    user: User | null;
}

/**
 * JUDGE0 Types
*/
export interface Submission {
    source_code: string;
    language_id: number;
    stdin: string;
    expected_output: string;
}

export type SubmitBatchResponse = {
    token: string;
}[];

export interface Judge0Status {
    id: number;
    description: string;
}

export interface Judge0Result {
    token: string;
    stdout: string | null;
    stderr: string | null;
    compile_output: string | null;
    message: string | null;
    status: Judge0Status;
    time?: string;
    memory?: number;
}

export interface PollBatchResponse {
    submissions: Judge0Result[];
}

/**
 * Problem Types 
*/

enum Difficulty {
    EASY,
    MEDIUM,
    HARD
}

interface Example {
    id: string;
    input: string;
    output: string;
    explanation: string;
}

interface TestCase {
    id: string;
    input: string;
    output: string;
    isHidden: boolean;
}

interface CreateProblem {
    title: string;
    diffculty: Difficulty;
    tags: Array<string>;
    description: string;
    constraints: string;
    examples: Example[];
    testCase: TestCase[];
}

interface ProblemUIStore {
    title: string;
    difficulty: Difficulty;
    tags: Array<string> | [];
    description: string;
    constraints: string;
    examples: Example[];
    testCases: TestCase[];

    setTitle: (title: string) => void;
    setTag: (tag: string) => void;
    setDifficulty: (difficulty: Difficulty) => void;
    removeTag: (tag: string) => void;

    setDescription: (description: string) => void;
    setConstraints: (constraints: string) => void;

    addExample: () => void;
    removeExample: (id: string) => void;
    updateExample: (
        id: string,
        field: keyof Omit<Example, "id">,
        value: string
    ) => void;

    addTestCase: () => void;
    updateTestCase: (id: string, field: keyof Omit<TestCase, "id">, value: string | boolean) => void;
    removeTestCase: (id: string) =>  void;
}