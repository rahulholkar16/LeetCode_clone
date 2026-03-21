"use client"
import { Button } from './ui/button';
import { useAuthStore } from '@/modules/auth/store/auth-store';
import { signOutUser } from '@/modules/auth/api/auth.api';
import { useSession } from '@/modules/auth/hooks/useSession';

const HOME = () => {
    useSession();
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