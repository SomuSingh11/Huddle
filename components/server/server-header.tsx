"use client";
// import { Server } from "@prisma/client";
// Prisma's generated types for models like Server, Member, and Profile do not automatically include complex relationships (like nested objects or joins with other models).

// If you want to include related data, such as members and their associated profiles along with the Server, you need a custom type to represent that structure.
// This is particularly useful when you're fetching data that involves relationships between multiple models (like a Server with its Members and their associated Profiles).

import { ServerWithMembersWithProfiles } from "@/types";
import { MemberRole } from "@prisma/client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  ChevronDown,
  Settings,
  Users,
  UserPlus,
  PlusCircle,
  Trash2,
  LogOut,
} from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { useModal } from "@/hooks/use-modal-store";

interface ServerHeaderProps {
  server: ServerWithMembersWithProfiles;
  role?: MemberRole;
}

export const ServerHeader = ({ server, role }: ServerHeaderProps) => {
  const { onOpen } = useModal();

  // Determine if the user is an Admin or Moderator based on their role
  const isAdmin = role === MemberRole.ADMIN;
  const isModerator = isAdmin || role === MemberRole.MODERATOR;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="focus:outline-none">
        <button
          className="w-full text-md font-semibold px-3 flex items-center h-12
         border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10
          dark:hover:bg-zinc-700/50 transition"
        >
          {server.name}
          <ChevronDown className="h-5 w-5 ml-auto" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]">
        {/* If the user is a Moderator or Admin, show the "Invite People" option */}
        {isModerator && (
          <DropdownMenuItem
            onClick={() => onOpen("invite", { server })} // Open the "invite" modal with the server data when this menu item is clicked.
            className="text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer"
          >
            Invite People
            <UserPlus className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}

        {/* Server Settings option, available only for Admins */}
        {isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen("editServer", { server })}
            className="px-3 py-2 text-sm cursor-pointer"
          >
            Server Settings
            <Settings className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}

        {/* Manage Members option, available only for Admins */}
        {isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen("members", { server })}
            className="px-3 py-2 text-sm cursor-pointer"
          >
            Manage Members
            <Users className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}

        {/* Moderator and Admin can create channels */}
        {isModerator && (
          <DropdownMenuItem
            onClick={() => onOpen("createChannel", { server })}
            className="px-3 py-2 text-sm cursor-pointer"
          >
            Create Channel
            <PlusCircle className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isModerator && <Separator />}

        {/* Admin-only option to delete the server */}
        {isAdmin && (
          <DropdownMenuItem className="text-rose-500 px-3 py-2 text-sm cursor-pointer">
            Delete Server
            <Trash2 className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}

        {/* If the user is not an Admin, they can leave the server */}
        {!isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen("leaveServer", { server })}
            className="text-rose-500 px-3 py-2 text-sm cursor-pointer"
          >
            Leave Server
            <LogOut className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
