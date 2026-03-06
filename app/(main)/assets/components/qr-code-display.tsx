"use client";

import { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

interface QRCodeDisplayProps {
  value: string;
  assetName: string;
  assetCode: string;
}

export function QRCodeDisplay({
  value,
  assetName,
  assetCode,
}: QRCodeDisplayProps) {
  const qrRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContent = qrRef.current;
    if (!printContent) return;

    const winPrint = window.open(
      "",
      "",
      "left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0",
    );
    if (!winPrint) return;

    winPrint.document.write(`
      <html>
        <head>
          <title>Print Asset Label</title>
          <style>
            body { 
              font-family: system-ui, -apple-system, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
            }
            .label-container {
              border: 2px solid #000;
              padding: 24px;
              text-align: center;
              width: fit-content;
            }
            .title {
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 8px;
            }
            .code {
              font-family: monospace;
              font-size: 14px;
              margin-bottom: 16px;
              color: #555;
            }
            .qr-wrapper svg {
              width: 150px;
              height: 150px;
            }
          </style>
        </head>
        <body>
          <div class="label-container">
            <div class="title">${assetName}</div>
            <div class="code">${assetCode}</div>
            <div class="qr-wrapper">
              ${printContent.innerHTML}
            </div>
          </div>
        </body>
      </html>
    `);

    winPrint.document.close();
    winPrint.focus();
    // Use setTimeout to allow external resources (if any) to load before printing
    setTimeout(() => {
      winPrint.print();
      winPrint.close();
    }, 250);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 border rounded-lg bg-card mt-4">
      <div className="font-semibold text-sm">Asset QR Code</div>
      <div ref={qrRef} className="bg-white p-2 rounded-md">
        <QRCodeSVG value={value} size={120} />
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={handlePrint}
        className="w-full"
      >
        <Printer className="mr-2 h-4 w-4" />
        Print Label
      </Button>
    </div>
  );
}
