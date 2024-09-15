"use client";

import { Smile } from "lucide-react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { useTheme } from "next-themes";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

interface EmojiPickerProps {
  onChange: (value: string) => void; // Callback function to handle selected emoji
}

export const EmojiPicker = ({ onChange }: EmojiPickerProps) => {
  const { resolvedTheme } = useTheme();

  return (
    <Popover>
      <PopoverTrigger>
        <Smile
          className="text-zinc-500 dark:text-zinc-400
         hover:text-zinc-600 dark:hover:text-zinc-300 transition"
        />
      </PopoverTrigger>
      <PopoverContent
        side="right"
        sideOffset={40}
        className="bg-transparent border-none shadow-none drop-shadow-none mb-16"
      >
        <Picker
          theme={resolvedTheme} // Set the picker theme based on the current theme (light or dark)
          data={data} // Emoji data set used by the picker (provided by @emoji-mart)
          onEmojiSelect={(emoji: any) => onChange(emoji.native)} // Callback when an emoji is selected
        />
      </PopoverContent>
    </Popover>
  );
};

// Summary:
// onEmojiSelect={(emoji: any) => onChange(emoji.native)}: This is an event handler that gets called when an emoji is selected.
// It passes the selected emoji's native property (the actual emoji character) to the onChange callback function provided through the EmojiPickerProps.
