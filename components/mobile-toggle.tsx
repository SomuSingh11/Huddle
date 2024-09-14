import { Menu } from "lucide-react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { NavigationSidebar } from "@/components/navigation/navigation-sidebar";
import { ServerSidebar } from "@/components/server/server-sidebar";

export const MobileToggle = ({ serverId }: { serverId: string }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size={"icon"} className="md:hidden">
          <Menu />
        </Button>
      </SheetTrigger>

      {/* Content of the sheet that slides in from the left */}
      <SheetContent side={"left"} className="p-0 flex gap-0">
        {/* Container for the navigation sidebar with a fixed width */}
        <div className="w-[72px]">
          <NavigationSidebar />
        </div>

        {/* Server-specific sidebar */}
        <ServerSidebar serverId={serverId} />
      </SheetContent>
    </Sheet>
  );
};
