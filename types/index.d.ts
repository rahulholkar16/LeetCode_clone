import { ReactNode } from "react";

// =========================
// SHARED
// =========================
export interface ChildrenProps {
    children: ReactNode;
}

export type ActionResponse<T> = {
    success: boolean;
    data?: T;
    message?: string;
};

// =========================
// AUTH
// =========================
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

// =========================
// JUDGE0
// =========================
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

// =========================
// PROBLEM DOMAIN
// =========================
export type Difficulty = "EASY" | "MEDIUM" | "HARD";

export type Example = {
    input: string;
    output: string;
    explanation?: string;
};

export type TestCase = {
    input: string;
    output: string;
    isHidden: boolean;
};

export type CodeSnippet = {
    language: string;
    code: string;
};

export type Problem = {
    title: string;
    description: string;
    difficulty: Difficulty;
    tags: string[];
    examples: Example[];
    constraints: string;
    testCases: TestCase[];
    codeSnippets: Record<string, string>;
    referenceSolution: Record<string, string>;
};

// =========================
// INTERNAL UI TYPES
// =========================
export interface InternalExample extends Example {
    id: string;
}

export interface InternalTestCase extends TestCase {
    id: string;
    explanation?: string;
}

export interface InternalCodeSnippet extends CodeSnippet {
    id: string;
}

// =========================
// COMPONENT PROPS
// =========================
export interface BasicInformationProps {
    title: string;
    difficulty: Difficulty;
    tags: string[];
    tagInput: string;
    onTitleChange: (value: string) => void;
    onDifficultyChange: (value: Difficulty) => void;
    onTagInputChange: (value: string) => void;
    onAddTag: () => void;
    onRemoveTag: (tag: string) => void;
    onTagKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export interface ProblemDescriptionProps {
    description: string;
    constraints: string;
    onDescriptionChange: (value: string) => void;
    onConstraintsChange: (value: string) => void;
}

export interface ExamplesSectionProps {
    examples: InternalExample[];
    onAddExample: () => void;
    onRemoveExample: (id: string) => void;
    onUpdateExample: (
        id: string,
        field: keyof Example,
        value: string
    ) => void;
}

export interface TestCasesSectionProps {
    testCases: InternalTestCase[];
    onAddTestCase: () => void;
    onRemoveTestCase: (id: string) => void;
    onUpdateTestCase: (
        id: string,
        field: keyof TestCase | "explanation",
        value: string | boolean
    ) => void;
}

export interface CodeSnippetsSectionProps {
    codeSnippets: InternalCodeSnippet[];
    languages: string[];
    onAddCodeSnippet: () => void;
    onRemoveCodeSnippet: (id: string) => void;
    onUpdateCodeSnippet: (
        id: string,
        field: keyof CodeSnippet,
        value: string
    ) => void;
}

export interface ReferenceSolutionSectionProps {
    referenceSolution: string;
    onReferenceSolutionChange: (value: string) => void;
}

interface ProblmStore {
    problems: Problem[] | null;
    setProblems: (problems: Problem[]) => void;
    setProblem: (problem: Problem) => void;
}