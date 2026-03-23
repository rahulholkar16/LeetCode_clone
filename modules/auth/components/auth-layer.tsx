import { AuthLayerProp } from '@/types';
import { useSession } from '../hooks/useSession'

const AuthLayer = ({ children }: AuthLayerProp) => {
    useSession();
    return (
        <>{children}</>
    )
}

export default AuthLayer