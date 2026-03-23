import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuSeparator,
    DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { AvatarDropdownProp } from "@/types";

export function AvatarDropdown({ user }: AvatarDropdownProp) {
    const { signOut } = useAuth();
    async function handleLogOut () {
        await signOut();
    };
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild className="flex items-center justify-center">
                <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar>
                        {user?.image && (
                            <AvatarImage
                                src={user.image}
                                alt={user.name || "User"}
                            />
                        )}

                        <AvatarFallback className="bg-linear-to-br from-yellow-400 to-orange-500 text-black font-bold">
                            {user?.name?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-40">
                <DropdownMenuGroup>
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Billing</DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                    <DropdownMenuItem className="text-red-500 focus:text-red-500" onClick={handleLogOut}>
                        Log out
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
