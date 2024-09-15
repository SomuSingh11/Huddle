import { Hash } from "lucide-react";

import { MobileToggle } from "@/components/mobile-toggle";
import { UserAvatar } from "../user-avatar";
import { SocketIndicator } from "@/components/socket-indicator";

interface ChatHeaderProps {
  serverId: string;
  name: string;
  type: "channel" | "coversation";
  imageUrl?: string;
}

export const ChatHeader = ({
  serverId,
  name,
  type,
  imageUrl,
}: ChatHeaderProps) => {
  return (
    <div className="text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2">
      {/* Toggle Component for mobile view */}
      <MobileToggle serverId={serverId} />

      {/* Display a hash icon if the type is "channel" */}
      {type === "channel" && (
        <Hash className="w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-2" />
      )}

      {type === "coversation" && (
        <UserAvatar src={imageUrl} className="h-8 w-8 md:h-8 md:w-8 mr-2" />
      )}

      {/* Display the name of the channel or conversation */}
      <p className="font-semibold text-md text-black dark:text-white">{name}</p>

      <div className="ml-auto flex items-center">
        <SocketIndicator />
      </div>
    </div>
  );
};
