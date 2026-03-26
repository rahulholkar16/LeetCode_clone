"use client";

import { ChildrenProps } from '@/types';
import { useSession } from '../hooks/useSession'

const AuthLayer = ({ children }: ChildrenProps) => {
    useSession();
    return (
        <>{children}</>
    )
}

export default AuthLayer;