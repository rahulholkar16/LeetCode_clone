import { ProtectedLayer } from "@/modules/auth/components/protected-layer";
import { ProtectedLayoutProp } from "@/types";

const ProtectedLayout = ({ children }: ProtectedLayoutProp) => {
    return <ProtectedLayer>{children}</ProtectedLayer>;
};

export default ProtectedLayout;