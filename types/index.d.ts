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
    expected_output?: string;
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

export type Tag = {
    tag: {
        id: string;
        name: string;
    };
};

export type Difficulty = "EASY" | "MEDIUM" | "HARD";

export type Language = "Javascript" | "Java" | "Cpp" |  "Python";

export interface Example {
    id: string;
    input: string;
    output: string;
    explanation: string;
    problemId?: string;
}

export interface TestCase {
    id: string;
    input: string;
    output: string;
    isHidden: boolean;
    problemId?: string;
}

export interface CodeSnippet {
    id: string;      
    language: Language;  
    code: string;
    problemId?: string;      
}

export interface ReferenceSolution {
    id: string;
    language: Language;
    code: string;
    problemId?: string;
}

export interface CreateProblem {
    title: string;
    difficulty: Difficulty;
    tags: Array<string>;
    description: string;
    constraints: string;
    examples: Omit<Example, "id" | "problemId">[]; 
    testCases: Omit<TestCase, "id" | "problemId">[];
    codeSnippets: Record<string, string>;
    referenceSolutions: Record<string, string>;
}

export interface ProblemUIStore {
    title: string;
    difficulty: Difficulty;
    tags: Array<string> | [];
    description: string;
    constraints: string;
    examples: Example[];
    testCases: TestCase[];
    codeSnippets: CodeSnippet[];
    referenceSolutions: ReferenceSolution[];
    submissions: ResSubmission[];

    setSubmissions: (submission: ResSubmission[]) => void;

    setTitle: (title: string) => vostringid;
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

    addCodeSnippet: () => void;
    removeCodeSnippet: (id: string) => void;
    updateCodeSnippet: (id: string, field: keyof Omit<CodeSnippet, "id">, value: string | Language) => void;

    addReferenceSolution: () => void;
    removeReferenceSolution: (id: string) => void;
    updateReferenceSolution: (id: string, field: keyof Omit<ReferenceSolution, "id">, value: string | Language) => void;
}

export interface Problem {
    id: string;
    title: string;
    description: string;
    difficulty: Difficulty;
    constraints: string;
    hints: string | null;
    editorial: string | null;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    tags: Tag[];
    examples?: Example[];
    testCases?: TestCase[];
    snippets?: CodeSnippet[];
    solutions?: ReferenceSolution[];
}

export interface ProblmStore {
    problems: Problem[];
    selectedProblem: Problem | null;

    setProblems: (problems: Problem[]) => void;
    setProblem: (problem: Problem) => void;
    getProblemById: (id: string) => Problem | undefined;
    setSelectedProblem: (problem: Problem | null) => void;
    addProblem: (problem: Problem) => void;
}

export interface ExecuteResponse {
    success: boolean;
    message?: string;
    submission?: ResSubmission & {
        testCaseResult: ExecutionResult[];
    };
}

export interface ExecutionResult {
    id: string;
    submmisionId: string;

    testCase: number;
    passed: boolean;

    stdout: string | null;
    expected: string | null;

    status: string;

    stderr: string | null;
    compileOutput: string | null;

    memory: string | null;
    time: string | null;
}

export interface ResSubmission {
    id: string;
    userId: string;
    problemId: string;
    sourceCode: string;
    language: 'JAVASCRIPT' | 'PYTHON' | 'JAVA' | 'CPP';
    stdin: string;
    stdout: string | null;
    stderr: string | null;
    compileOutput: string | null;
    status: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Runtime Error' | 'Compile Error';
    memory: string[];
    time: string[];
    createdAt: string;
    updatedAt: string;
}
