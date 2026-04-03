import { ProtectedLayer } from "@/modules/auth/components/protected-layer";
import Navbar from "@/modules/home/components/Navbar";
import { ChildrenProps } from "@/types";

const ProtectedLayout = ({ children }: ChildrenProps) => {
    return (
        <ProtectedLayer>
            <Navbar />
            {children}
        </ProtectedLayer>
    );
};

export default ProtectedLayout;
