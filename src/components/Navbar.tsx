import React from "react";
import { Button } from "./ui/button";
import { CircleUser, Headset, LogOut, Cpu } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const Navbar = () => {
  const router = useRouter();

  const handleLogout = () => {
    sessionStorage.removeItem("LoggedIn");
    toast.success("Logged out successfully");
    setTimeout(() => {
      router.push("/login");
    }, 1000);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#212121] border-b border-gray-900 shadow-md">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3 cursor-pointer transition-transform hover:scale-105">
          <h1 className="text-white text-2xl font-bold tracking-wide font-mono">
            Aiva
          </h1>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button className="h-10 w-10 rounded-full p-0 hover:bg-gray-700">
              <CircleUser className="h-5 w-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-56 p-1 rounded-lg border bg-[#0a0a0a] text-white border-[#414141]"
            align="end"
            sideOffset={8}
          >
            <div className="grid gap-0.5">
              <Button
                variant="ghost"
                size="sm"
                className="justify-start gap-2 px-3 py-2 h-8 text-sm font-normal hover:bg-[#1f1f1f] hover:text-white"
              >
                <Cpu className="h-3.5 w-3.5 text-[#a0a0a0]" />
                <span>AI Systems</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="justify-start gap-2 px-3 py-2 h-8 text-sm font-normal hover:bg-[#1f1f1f] hover:text-white"
              >
                <Headset className="h-3.5 w-3.5 text-[#a0a0a0]" />
                <span>Support</span>
              </Button>
              <div className="border-t my-1 border-[#2e2e2e]"></div>
              <Button
                variant="ghost"
                size="sm"
                className="justify-start gap-2 px-3 py-2 h-8 text-sm font-normal text-red-500 hover:bg-[#2a0e0e] hover:text-red-400"
                onClick={handleLogout}
              >
                <LogOut className="h-3.5 w-3.5 text-red-500" />
                <span>Logout</span>
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
};

export default Navbar;
