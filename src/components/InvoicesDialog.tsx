"use client";

import { useEffect, useState } from "react";
import { Receipt, Download, Calendar } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

type InvoiceItem = {
  label: string;
  value: string;
  year: string;
};

type InvoicesData = {
  [year: string]: InvoiceItem[];
};

export const InvoicesDialog = () => {
  const [invoicesData, setInvoicesData] = useState<InvoicesData>({});
  const [setupPageDialog, setSetupPageDialog] = useState(false);
  const [downloadingItem, setDownloadingItem] = useState<string | null>(null);

  // fetch invoices data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/Invoices`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await res.json();
        console.log("the data is ", data);
        setInvoicesData(data?.data || {});
      } catch (error) {
        console.error("error fetching the invoices data = ", error);
      }
    };
    fetchData();
  }, []);

  // for downloading the invoices
  const handleDownload = async (value: string) => {
    setDownloadingItem(value);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/InvoiceDownload/${value}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!res.ok) throw new Error("Download failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `AIVA_Invoice_${value}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading invoice:", err);
    } finally {
      setDownloadingItem(null);
    }
  };

  return (
    <Dialog open={setupPageDialog} onOpenChange={setSetupPageDialog}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="bg-white text-uppercase font-mono hover:bg-gray-50 transition-colors"
          onClick={() => setSetupPageDialog(true)}
        >
          <Receipt className="w-5 h-5 mr-2" />
          Invoices
        </Button>
      </DialogTrigger>
      <DialogDescription className="sr-only">
        View and download your invoices
      </DialogDescription>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col [&>button]:hidden">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div>
              <DialogTitle className="text-2xl font-bold font-mono uppercase tracking-widest">
                Invoices
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1 font-mono">
                Download and manage your invoices
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-8 py-4 font-mono">
          {Object.keys(invoicesData).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No invoices found
              </h3>
              <p className="text-sm text-gray-500 max-w-sm">
                Your invoices will appear here once they become available.
              </p>
            </div>
          ) : (
            Object.keys(invoicesData)
              .sort((a, b) => Number.parseInt(b) - Number.parseInt(a)) // Sort years in descending order
              .map((year) => (
                <div key={year} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <h2 className="text-xl font-bold text-gray-900">{year}</h2>
                    <div className="ml-auto">
                      {invoicesData[year].length}{" "}
                      {invoicesData[year].length === 1 ? "invoice" : "invoices"}
                    </div>
                  </div>

                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="font-semibold">
                            Invoice Period
                          </TableHead>
                          <TableHead className="font-semibold">Year</TableHead>
                          <TableHead className="text-right font-semibold">
                            Action
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {invoicesData[year].map((item, idx) => (
                          <TableRow key={idx} className="hover:bg-gray-50/50">
                            <TableCell className="font-medium">
                              {item.label}
                            </TableCell>
                            <TableCell>{item.year}</TableCell>
                            <TableCell className="text-right">
                              <Button
                                size="sm"
                                onClick={() => handleDownload(item.value)}
                                disabled={downloadingItem === item.value}
                              >
                                <Download className="w-4 h-4 mr-2" />
                                {downloadingItem === item.value
                                  ? "Downloading..."
                                  : "Download"}
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
