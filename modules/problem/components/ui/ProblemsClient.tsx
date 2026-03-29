"use client";

import { useMemo, useState } from "react";
import { useProblmStore } from "@/modules/problem/stores/problem-store";
import FilterBar, { FilterState } from "../FilterBar";
import ProblemsTable from "../ProblemsTable";
import PaginationControls from "../PaginationControls";

const DEFAULT_FILTERS: FilterState = {
    searchQuery: "",
    difficulty: [],
    topics: [],
};

export default function ProblemsClient() {
    const problems = useProblmStore((state) => state.problems ?? []);

    const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(25);

    const filteredProblems = useMemo(() => {
        const search = filters.searchQuery.trim().toLowerCase();

        return problems?.filter((problem) => {
            const matchesSearch =
                !search ||
                problem.title.toLowerCase().includes(search) ||
                problem.tags.some((tag) =>
                    tag.toLowerCase().includes(search),
                );

            const matchesDifficulty =
                filters.difficulty.length === 0 ||
                filters.difficulty.includes(problem.difficulty);

            const matchesTopics =
                filters.topics.length === 0 ||
                filters.topics.some((filterTopic) =>
                    problem.tags.includes(filterTopic),
                );

            return matchesSearch && matchesDifficulty && matchesTopics;
        });
    }, [problems, filters]);

    const totalPages = Math.ceil(filteredProblems?.length / itemsPerPage);

    const paginatedProblems = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredProblems?.slice(startIndex, endIndex);
    }, [filteredProblems, currentPage, itemsPerPage]);

    const handleFilterChange = (newFilters: FilterState) => {
        setFilters(newFilters);
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleItemsPerPageChange = (newItemsPerPage: number) => {
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1);
    };

    return (
        <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-4">Problem Set</h1>
                    <p className="text-foreground/70">
                        Practice your coding skills with our curated collection
                        of problems
                    </p>
                </div>

                <FilterBar onFilterChange={handleFilterChange} />

                <ProblemsTable problems={paginatedProblems} />

                {filteredProblems?.length > 0 && (
                    <PaginationControls
                        currentPage={currentPage}
                        totalPages={totalPages}
                        itemsPerPage={itemsPerPage}
                        totalItems={filteredProblems?.length}
                        onPageChange={handlePageChange}
                        onItemsPerPageChange={handleItemsPerPageChange}
                    />
                )}
            </div>
        </div>
    );
};