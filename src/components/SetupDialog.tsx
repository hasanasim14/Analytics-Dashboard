import { useState } from "react";
import { Settings } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export const SetupDialog = () => {
  const [maxCost, setMaxCost] = useState("0.00");
  const [maxMessages, setMaxMessages] = useState("0");

  const apiKey = "sk-abc123xyz456def789ghi012jkl345";

  const maskApiKey = (key: string) => {
    if (!key) return "";
    const visibleChars = 4;
    if (key.length <= visibleChars * 2) {
      return key;
    }
    const start = key.substring(0, visibleChars);
    const end = key.substring(key.length - visibleChars);
    return `${start}${"*".repeat(8)}${end}`;
  };

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
      <DialogContent className="sm:max-w-[45%] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl uppercase font-mono tracking-widest">
            Setup Page
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="api-key" className="font-mono mb-2">
              API Key:
            </Label>
            <Input
              id="api-key"
              type="text"
              value={maskApiKey(apiKey)}
              readOnly
              className="cursor-not-allowed font-mono"
            />
          </div>

          <div>
            <Label htmlFor="max-cost" className="font-mono mb-2">
              Maximum Chat Cost:
            </Label>
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
            <Label htmlFor="max-messages" className="font-mono mb-2">
              Maximum Messages:
            </Label>
            <Input
              id="max-messages"
              type="number"
              step="1"
              placeholder="e.g. 100"
              value={maxMessages}
              onChange={(e) => setMaxMessages(e.target.value)}
            />
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={handleSave}>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
