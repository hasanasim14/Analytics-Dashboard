import { useState } from "react";
import { Settings } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export const SetupDialog = () => {
  const [maxCost, setMaxCost] = useState("0.00");
  const [maxMessages, setMaxMessages] = useState("0");

  const handleSave = () => {
    console.log("Max Chat Cost:", parseFloat(maxCost));
    console.log("Max Messages:", parseInt(maxMessages, 10));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="bg-white">
          <Settings className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[55%] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Setup Page</DialogTitle>
          <DialogDescription>View & Edit Values</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="api-key">API Key</Label>
            <Input
              id="api-key"
              type="password"
              value="sk-***************abc123"
              readOnly
              className="cursor-not-allowed"
            />
          </div>

          <div>
            <Label htmlFor="max-cost">Maximum Chat Cost</Label>
            <Input
              id="max-cost"
              type="number"
              step="0.01"
              placeholder="e.g. 5.00"
              value={maxCost}
              onChange={(e) => setMaxCost(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="max-messages">Maximum Messages</Label>
            <Input
              id="max-messages"
              type="number"
              step="1"
              placeholder="e.g. 100"
              value={maxMessages}
              onChange={(e) => setMaxMessages(e.target.value)}
            />
          </div>

          <div className="pt-4">
            <Button onClick={handleSave}>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
