import { ProblemDetailView } from "@/modules/problem/components/ui/ProblemDetailView";

interface ProblemDetailPageProps {
    params: Promise<{ id: string }>;
}

export default async function ProblemDetailPage({
    params,
}: ProblemDetailPageProps) {
    const { id } = await params;
    return <ProblemDetailView id={id} />;
};