"use client";

import { useDialog } from "@/context/dialog-provider";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  qrValue: string;
  assetName: string;
};

export function EquipmentQrDialog({
  open,
  onOpenChange,
  qrValue,
  assetName,
}: Props) {
  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Print QR Code - ${assetName}</title>
          <style>
            body { 
              font-family: sans-serif; 
              display: flex; 
              flex-direction: column; 
              align-items: center; 
              justify-content: center;
              height: 100vh;
              margin: 0;
            }
            .container {
              text-align: center;
              padding: 2rem;
              border: 1px solid #ccc;
              border-radius: 8px;
            }
            h2 { margin-bottom: 0.5rem; }
            p { margin-top: 0; color: #666; font-size: 0.9rem; }
            svg { 
                margin-top: 1rem; 
                max-width: 100%;
                height: auto;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>${assetName}</h2>
            <p>${qrValue}</p>
            <div id="qr-code"></div>
          </div>
          <script>
            // We use JS to clone the SVG to avoid huge inline HTML strings
            window.onload = function() {
              const svgContent = opener.document.getElementById('equipment-qr-svg');
              if (svgContent) {
                document.getElementById('qr-code').appendChild(svgContent.cloneNode(true));
                setTimeout(() => {
                  window.print();
                  window.close();
                }, 500);
              }
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm sm:max-w-md text-center">
        <DialogHeader>
          <DialogTitle className="text-center">Equipment QR Code</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center p-6 space-y-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            {qrValue ? (
              <QRCodeSVG
                id="equipment-qr-svg"
                value={qrValue}
                size={200}
                level="H"
                includeMargin={true}
              />
            ) : (
              <div className="h-[200px] w-[200px] flex items-center justify-center bg-gray-50 text-gray-400">
                No QR Data
              </div>
            )}
          </div>
          <div className="text-center">
            <h3 className="font-semibold text-lg">{assetName}</h3>
            <p className="font-mono text-sm text-muted-foreground mt-1">
              {qrValue || "No QR Data"}
            </p>
          </div>
        </div>

        <DialogFooter className="sm:justify-center">
          <Button onClick={handlePrint} disabled={!qrValue}>
            <Printer className="mr-2 h-4 w-4" /> Print QR Code
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
