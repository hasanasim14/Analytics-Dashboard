import React from "react";
import { Button } from "./ui/button";
import { CircleUser, CornerRightDown, Headset, LogOut } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

const Navbar = () => {
  return (
    <div className="w-full h-13 bg-black sticky top-0 z-50">
      <div className="container mx-auto px-4 h-full">
        <div className="flex justify-end items-center h-full">
          <Popover>
            <PopoverTrigger asChild>
              <Button className="h-10 w-10 rounded-full p-0 hover:bg-gray-700">
                <CircleUser className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-2" align="end" sideOffset={8}>
              <div className="grid gap-1">
                <Button
                  variant="ghost"
                  className="justify-start gap-2 text-red-500 hover:bg-red-50 hover:text-red-500"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start gap-2 hover:bg-gray-100"
                >
                  <Headset className="h-4 w-4" />
                  <span>Support</span>
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start gap-2 hover:bg-gray-100"
                >
                  <CornerRightDown className="h-4 w-4" />
                  <span>AI Systems</span>
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
