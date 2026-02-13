"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

interface StockTableProps {
  data: any[];
}

export function StockTable({ data }: StockTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead>Item Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Total Stock</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead>Last Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No stock data found.
              </TableCell>
            </TableRow>
          ) : (
            data.map((item) => <StockTableRow key={item.id} item={item} />)
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function StockTableRow({ item }: { item: any }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible asChild open={isOpen} onOpenChange={setIsOpen}>
      <>
        <TableRow className="cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
          <TableCell>
            {item.stocks.length > 0 && (
              <CollapsibleTrigger asChild>
                <button className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent">
                  {isOpen ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
              </CollapsibleTrigger>
            )}
          </TableCell>
          <TableCell>
            <div className="flex flex-col">
              <span className="font-medium">{item.name}</span>
              <span className="text-xs text-muted-foreground">{item.code}</span>
            </div>
          </TableCell>
          <TableCell>{item.category}</TableCell>
          <TableCell>
            <Badge variant={item.totalStock > 0 ? "default" : "destructive"}>
              {item.totalStock}
            </Badge>
          </TableCell>
          <TableCell>{item.unit}</TableCell>
          <TableCell className="text-muted-foreground text-xs">
            {format(new Date(item.lastUpdated), "dd MMM yyyy HH:mm")}
          </TableCell>
        </TableRow>
        <CollapsibleContent asChild>
          <TableRow className="bg-muted/30">
            <TableCell colSpan={6} className="p-0">
              <div className="px-14 py-4">
                <h4 className="text-sm font-semibold mb-2">
                  Stock Breakdown per Warehouse
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {item.stocks.map((stock: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center p-2 rounded-sm border bg-background"
                    >
                      <span className="text-sm font-medium">
                        {stock.warehouseName}
                      </span>
                      <Badge variant="outline">
                        {stock.quantity} {item.unit}
                      </Badge>
                    </div>
                  ))}
                  {item.stocks.length === 0 && (
                    <p className="text-sm text-muted-foreground italic">
                      No stock entries found for this item.
                    </p>
                  )}
                </div>
              </div>
            </TableCell>
          </TableRow>
        </CollapsibleContent>
      </>
    </Collapsible>
  );
}
