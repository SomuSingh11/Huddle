"use client";

import { Plus } from "lucide-react";
// ActionTooltip is a REACT reusable UI component that wraps around a
// child element (children) and displays a tooltip when the user interacts with the element.
import { ActionTooltip } from "@/components/action-tooltip";
import { useModal } from "@/hooks/use-modal-store";

export const NavigationAction = () => {
  const { onOpen } = useModal();
  return (
    <div>
      <ActionTooltip side="right" align="center" label="Add a server">
        <button className="group flex items-center" onClick={() => onOpen("createServer")}>
          <div
            className="flex mx-3 h-[48px] w-[48px] 
      rounded-[24px] bg-background group-hover:rounded-[16px] 
      transition-all overflow-hidden items-center justify-center
       dark:bg-neutral-700 group-hover:bg-emerald-500"
          >
            <Plus
              className="group-hover:text-white transition text-emerald-500"
              size={25}
            />
          </div>
        </button>
      </ActionTooltip>
    </div>
  );
};
