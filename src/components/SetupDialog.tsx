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

export const SetupDialog = () => {
  const [maxCost, setMaxCost] = useState("0.00");
  const [maxMessages, setMaxMessages] = useState("0");
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [setupPageDialog, setSetupPageDialog] = useState(false);
  // const [error, setError] = useState<string | null>(null);
  // const [setupData, setSetupData] = useState<any>(null);
  const [originalMaxCost, setOriginalMaxCost] = useState("0.00");
  const [originalMaxMessages, setOriginalMaxMessages] = useState("0");

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
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/setups`, {
        method: "POST",
        headers: {
          Authorization: apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ maxChat: maxCost, maxVal: maxMessages }),
      });

      toast.success("Values Saved Successfully!");
      setSetupPageDialog(false);
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
      // setError(null);

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

        setMaxCost(fetchedMaxCost);
        setMaxMessages(fetchedMaxMessages);
        setOriginalMaxCost(fetchedMaxCost);
        setOriginalMaxMessages(fetchedMaxMessages);
        // setSetupData(data);

        // If the API returns setup data, populate the form
        if (data.maxCost !== undefined) {
          setMaxCost(data.maxCost.toString());
        }
        if (data.maxMessages !== undefined) {
          setMaxMessages(data.maxMessages.toString());
        }
      } catch (error) {
        console.error("Fetch error:", error);
        // setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiKey]); // Add apiKey as dependency

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

        <div className="space-y-4">
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

          <div className="flex justify-end gap-2 w-full">
            {/* <DialogClose> */}
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            {/* </DialogClose> */}
            <Button onClick={handleSave} disabled={loading}>
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
