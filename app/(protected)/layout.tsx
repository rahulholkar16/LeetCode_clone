import { ProtectedLayer } from "@/modules/auth/components/protected-layer";
import { ChildrenProps } from "@/types";

const ProtectedLayout = ({ children }: ChildrenProps) => {
    return <ProtectedLayer>{children}</ProtectedLayer>;
};

export default ProtectedLayout;