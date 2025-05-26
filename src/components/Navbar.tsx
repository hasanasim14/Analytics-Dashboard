import React from "react";
import { Button } from "./ui/button";
import { CircleUser, Headset, LogOut, Cpu } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

const Navbar = () => {
  return (
    <div className="w-full h-13 sticky top-0 z-50 bg-[rgba(32,32,32,0.95)] backdrop-blur-sm">
      <div className="container mx-auto px-4 h-full">
        <div className="flex justify-end items-center h-full">
          <Popover>
            <PopoverTrigger asChild>
              <Button className="h-10 w-10 rounded-full p-0 hover:bg-gray-700">
                <CircleUser className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-56 p-1 rounded-lg shadow-lg border bg-popover"
              align="end"
              sideOffset={8}
            >
              <div className="grid gap-0.5">
                <Button
                  variant="ghost"
                  size="sm"
                  className="justify-start gap-2 px-3 py-2 h-8 text-sm font-normal hover:bg-accent"
                >
                  <Cpu className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>AI Systems</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="justify-start gap-2 px-3 py-2 h-8 text-sm font-normal hover:bg-accent"
                >
                  <Headset className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Support</span>
                </Button>
                <div className="border-t my-1"></div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="justify-start gap-2 px-3 py-2 h-8 text-sm font-normal text-red-500 hover:bg-red-50/50 hover:text-red-600"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Logout</span>
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
