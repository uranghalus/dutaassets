import { Main } from "@/components/main";
import { getPendingDisposals } from "@/action/disposal-action";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Pending Asset Disposals",
};

export default async function PendingDisposalsPage() {
  const disposals = await getPendingDisposals();

  return (
    <Main fluid>
      <div className="mb-6 flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Asset Disposals</h2>
          <p className="text-muted-foreground">
            Review and approve pending asset retirement requests.
          </p>
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asset</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Return Value</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {disposals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No pending disposals.
                </TableCell>
              </TableRow>
            ) : (
              disposals.map((disposal) => (
                <TableRow key={disposal.id}>
                  <TableCell>
                    <div className="font-medium">
                      {disposal.asset.nama_asset}
                    </div>
                    <div className="text-sm text-muted-foreground font-mono">
                      {disposal.asset.kode_asset}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{disposal.disposalMethod}</Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(disposal.disposalDate), "PPP")}
                  </TableCell>
                  <TableCell
                    className="max-w-[200px] truncate"
                    title={disposal.reason || ""}
                  >
                    {disposal.reason || "-"}
                  </TableCell>
                  <TableCell>
                    {disposal.disposalValue
                      ? new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        }).format(Number(disposal.disposalValue))
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50"
                    >
                      Pending Approval
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Main>
  );
}
