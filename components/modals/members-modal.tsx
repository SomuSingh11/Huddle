"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useModal } from "@/hooks/use-modal-store";
import { ServerWithMembersWithProfiles } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";

export const MembersModal = () => {
  const { onOpen, isOpen, onClose, type, data } = useModal(); //Whenever invitation Modal is called in "server-header.tsx", server data is passed and hence is extracted

  const isModalOpen = isOpen && type === "members"; // TypeScript type assertion: It tells TypeScript to treat data as an object that contains a server property of type ServerWithMembersWithProfiles.
  const { server } = data as { server: ServerWithMembersWithProfiles };

  return (
    // The onOpenChange prop is a callback function that gets triggered whenever there is a change in the open state of the dialog (i.e., when the modal is opened or closed).
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Manage Members
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            {server?.members?.length} Members
          </DialogDescription>
        </DialogHeader>
        <div className="p-6">Hello Members</div>
      </DialogContent>
    </Dialog>
  );
};
