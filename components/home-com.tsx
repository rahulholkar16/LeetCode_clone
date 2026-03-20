"use client"
import { authClient } from '@/lib/auth-client';
import { useState } from 'react';
import { Button } from './ui/button';
import { useSession } from '@/modules/auth/hooks/useSession';
import { useAuthStore } from '@/modules/auth/store/auth-store';
import { signOutUser } from '@/modules/auth/api/auth.api';

const HOME = () => {
    const user = useAuthStore(s => s.user);

    const logoutHandel = async () => {
        await signOutUser();
    };

  return (
    <div>WELCOME {user?.name}
    <Button onClick={logoutHandel}>Logout</Button>
    </div>
  )
}

export default HOME;