"use client";

import { useEffect, useState } from "react";
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
import { toast } from "sonner";
import { Checkbox } from "./ui/checkbox";

export const SetupDialog = () => {
  const [maxCost, setMaxCost] = useState("0.00");
  const [maxMessages, setMaxMessages] = useState("0");
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [setupPageDialog, setSetupPageDialog] = useState(false);
  const [originalMaxCost, setOriginalMaxCost] = useState("0.00");
  const [originalMaxMessages, setOriginalMaxMessages] = useState("0");

  // Add state for checkboxes
  const [enableMaxCost, setEnableMaxCost] = useState(true);
  const [enableMaxMessages, setEnableMaxMessages] = useState(true);

  useEffect(() => {
    const key = sessionStorage.getItem("Key");
    setApiKey(key || "");
  }, []);

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

  const handleSave = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/setups`, {
        method: "POST",
        headers: {
          Authorization: apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          maxChat: enableMaxMessages ? maxMessages : "None",
          maxVal: enableMaxCost ? maxCost : "None",
        }),
      });
      if (res.ok) {
        toast.success("Values Saved Successfully!");
        setSetupPageDialog(false);
      }

      if (!res.ok) {
        toast.error("Failed to save values");
      }
    } catch (error) {
      console.error("The error is ", error);
      toast.error("Failed to save values");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!apiKey) {
        return;
      }

      setLoading(true);
      try {
        const response = await fetch("https://smartview.ai-iscp.com/setups", {
          method: "GET",
          headers: {
            Authorization: apiKey,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error response:", errorText);
          throw new Error(
            `HTTP error! status: ${response.status} - ${errorText}`
          );
        }

        const data = await response.json();
        const fetchedMaxCost = data?.data?.maxVal || "0.00";
        const fetchedMaxMessages = data?.data?.maxChat || "0";

        // Check if values are "None" and set checkbox states accordingly
        setEnableMaxCost(fetchedMaxCost !== "None");
        setEnableMaxMessages(fetchedMaxMessages !== "None");

        // Set the input values, but only if they're not "None"
        setMaxCost(fetchedMaxCost !== "None" ? fetchedMaxCost : "0.00");
        setMaxMessages(
          fetchedMaxMessages !== "None" ? fetchedMaxMessages : "0"
        );

        setOriginalMaxCost(fetchedMaxCost !== "None" ? fetchedMaxCost : "0.00");
        setOriginalMaxMessages(
          fetchedMaxMessages !== "None" ? fetchedMaxMessages : "0"
        );

        setLoading(false);
      } catch (error) {
        console.error("Fetch error:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [apiKey]);

  const handleCancel = () => {
    setSetupPageDialog(false);
    // Restore original values instead of resetting to zero
    setMaxCost(originalMaxCost);
    setMaxMessages(originalMaxMessages);
  };

  return (
    <Dialog open={setupPageDialog}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="bg-white"
          onClick={() => setSetupPageDialog(true)}
        >
          <Settings className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[45%] max-h-[90vh] overflow-y-auto [&>button]:hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl uppercase font-mono tracking-widest">
            Setup Page
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <Label htmlFor="api-key" className="font-mono mb-2">
              API Key:
            </Label>
            <Input
              tabIndex={-1}
              id="api-key"
              type="text"
              value={maskApiKey(apiKey)}
              readOnly
              className="cursor-not-allowed font-mono"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="enable-max-cost"
                checked={enableMaxCost}
                onCheckedChange={(checked) =>
                  setEnableMaxCost(checked === true)
                }
              />
              <Label htmlFor="enable-max-cost" className="font-mono">
                Enable Maximum Chat Cost
              </Label>
            </div>

            <div className="ml-6">
              <Label htmlFor="max-cost" className="font-mono mb-2 block">
                Maximum Chat Cost:
              </Label>
              <Input
                id="max-cost"
                type="number"
                step="0.01"
                placeholder="e.g. 5.00"
                value={maxCost}
                onChange={(e) => setMaxCost(e.target.value)}
                disabled={!enableMaxCost}
                className={
                  !enableMaxCost ? "opacity-50 cursor-not-allowed" : ""
                }
              />
            </div>
          </div>

          <hr className="border-gray-200" />

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="enable-max-messages"
                checked={enableMaxMessages}
                onCheckedChange={(checked) =>
                  setEnableMaxMessages(checked === true)
                }
              />
              <Label htmlFor="enable-max-messages" className="font-mono">
                Enable Maximum Messages
              </Label>
            </div>

            <div className="ml-6">
              <Label htmlFor="max-messages" className="font-mono mb-2 block">
                Maximum Messages:
              </Label>
              <Input
                id="max-messages"
                type="number"
                step="1"
                placeholder="e.g. 100"
                value={maxMessages}
                onChange={(e) => setMaxMessages(e.target.value)}
                disabled={!enableMaxMessages}
                className={
                  !enableMaxMessages ? "opacity-50 cursor-not-allowed" : ""
                }
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 w-full pt-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
