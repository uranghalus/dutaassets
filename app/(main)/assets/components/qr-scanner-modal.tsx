"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Scanner } from "@yudiel/react-qr-scanner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScanLine } from "lucide-react";
import { toast } from "sonner";

export function QrScannerModal() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleScan = (result: any) => {
    if (result && result.length > 0) {
      const scannedText = result[0].rawValue;
      try {
        const url = new URL(scannedText);
        // Ensure it's pointing to an asset
        if (url.pathname.includes("/assets/")) {
          // Play a simple success sound or show feedback
          toast.success("Asset found! Redirecting...");
          setOpen(false);
          router.push(url.pathname);
        } else {
          toast.error("Invalid QR code. Please scan a valid Asset label.");
        }
      } catch (e) {
        // If it's not a URL, it might just be the asset ID directly.
        if (scannedText.length > 10) {
          toast.success("Asset code found! Redirecting...");
          setOpen(false);
          router.push(`/assets/${scannedText}`);
        } else {
          toast.error("Invalid QR code format.");
        }
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <ScanLine className="h-4 w-4" />
          Scan QR Code
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Scan Asset QR</DialogTitle>
          <DialogDescription>
            Hold your camera over the QR code to quickly look up an asset.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center items-center py-4 relative group rounded-md overflow-hidden bg-black aspect-square">
          {open && (
            <Scanner
              onScan={handleScan}
              formats={["qr_code"]}
              styles={{
                container: { width: "100%", height: "100%" },
                video: { objectFit: "cover" },
              }}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
