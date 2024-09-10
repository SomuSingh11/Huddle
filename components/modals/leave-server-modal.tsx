"use client";

import axios from "axios";

import { Check, Copy, RefreshCcw } from "lucide-react";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useModal } from "@/hooks/use-modal-store";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useOrigin } from "@/hooks/use-origin";

export const LeaveServerModal = () => {
  const { onOpen, isOpen, onClose, type, data } = useModal(); //Whenever invitation Modal is called in "server-header.tsx", server data is passed and hence is extracted
  const origin = useOrigin(); // Get the current origin URL

  const isModalOpen = isOpen && type === "leaveServer";
  const { server } = data;

  const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  // onNew function generates a new invite link by making an API request, updates the modal with the new invite code.
  const onNew = async () => {
    try {
      setIsLoading(true);
      const response = await axios.patch(
        `/api/servers/${server?.id}/invite-code` // API request to generate a new invite code
      );
      onOpen("invite", { server: response.data }); // Open modal with new invite data
    } catch (error) {
      console.log("onNew Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // The onOpenChange prop is a callback function that gets triggered whenever there is a change in the open state of the dialog (i.e., when the modal is opened or closed).
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Invite Friends
          </DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <Label className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
            {" "}
            Server invite link
          </Label>
          <div className="flex items-center mt-2 gap-x-2">
            <Input
              disabled={isLoading}
              className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
              value={inviteUrl}
            />
            <Button disabled={isLoading} size="icon" onClick={onCopy}>
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <Button
            disabled={isLoading}
            variant="link"
            size="sm"
            className="text-xs text-zinc-500 mt-4"
            onClick={onNew} // Generate a new invite link
          >
            Generate a new link
            <RefreshCcw className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
