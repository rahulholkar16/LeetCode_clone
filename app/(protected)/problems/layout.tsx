import ProblemsLayer from '@/modules/problem/components/problems-layer';
import { ChildrenProps } from '@/types';

const ProblemLayout = ({ children }: ChildrenProps) => {
  return (
    <ProblemsLayer>{children}</ProblemsLayer>
  )
}

export default ProblemLayout;