import { getAssetById } from "@/action/asset-action";
import { Main } from "@/components/main";
import { AssetDialogProvider } from "../components/asset-dialog-provider";
import { AssetDialog } from "../components/asset-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import {
  ArrowLeft,
  Building2,
  Calendar,
  Tag,
  Hash,
  Info,
  Package,
  User,
  MapPin,
  ClipboardList,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AssetDetailsActions } from "./asset-details-actions";
import { AssetActivityLogTable } from "../components/asset-activity-log-table";

export default async function AssetDetailsPage({
  params,
}: {
  params: Promise<{ assetId: string }>;
}) {
  const { assetId } = await params;
  const asset = await getAssetById(assetId);

  if (!asset) {
    notFound();
  }

  return (
    <AssetDialogProvider>
      <Main fluid>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/assets">
                <Button variant="outline" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h2 className="text-2xl font-bold tracking-tight">
                  {asset.nama_asset}
                </h2>
                <p className="text-muted-foreground flex items-center gap-2">
                  <span className="font-mono text-sm">{asset.kode_asset}</span>
                  <span>•</span>
                  <span className="text-sm">
                    {asset.assetCategory?.name || "No Category"}
                  </span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <AssetDetailsActions asset={asset as any} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Sidebar / Summary Card */}
            <Card className="md:col-span-1 h-fit">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-center p-8 bg-muted rounded-lg mb-4">
                  <Package className="h-16 w-16 text-muted-foreground" />
                </div>
                <div className="flex flex-col items-center text-center">
                  <Badge
                    className="mb-2"
                    variant={
                      asset.status === "AVAILABLE"
                        ? "default"
                        : ["IN_USE", "LOANED"].includes(asset.status)
                          ? "secondary"
                          : ["MAINTENANCE", "UNDER_MAINTENANCE"].includes(
                                asset.status,
                              )
                            ? "outline" // Using outline as fallback for warning if not in theme
                            : "destructive"
                    }
                  >
                    {asset.status.replace(/_/g, " ")}
                  </Badge>
                  <h3 className="font-semibold text-lg">{asset.nama_asset}</h3>
                  <p className="text-sm text-muted-foreground font-mono">
                    {asset.kode_asset}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Separator />
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                        Department
                      </span>
                      <span>{asset.department_fk.nama_department}</span>
                    </div>
                  </div>
                  {(asset.assetLocation || asset.lokasi) && (
                    <div className="flex items-center gap-3 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                          Location
                        </span>
                        <span>
                          {asset.assetLocation?.name || asset.lokasi}
                          {asset.assetLocation && asset.lokasi && (
                            <span className="text-xs text-muted-foreground ml-1">
                              ({asset.lokasi})
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                        Assigned To
                      </span>
                      <span>{asset.karyawan_fk?.nama || "Unassigned"}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Main Content */}
            <div className="md:col-span-3">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="specs">Specifications</TabsTrigger>
                  <TabsTrigger value="procurement">Procurement</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>

                {/* OVERVIEW TAB */}
                <TabsContent value="overview" className="space-y-6 mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Info className="h-5 w-5" />
                        Asset Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium text-muted-foreground">
                          Asset Name
                        </h4>
                        <p className="text-base">{asset.nama_asset}</p>
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium text-muted-foreground">
                          Asset Code
                        </h4>
                        <p className="text-base font-mono">
                          {asset.kode_asset}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium text-muted-foreground">
                          Category
                        </h4>
                        <p className="text-base">
                          {asset.assetCategory?.name || "-"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium text-muted-foreground">
                          Condition
                        </h4>
                        <p className="text-base">{asset.kondisi || "-"}</p>
                      </div>
                      <div className="md:col-span-2 space-y-1">
                        <h4 className="text-sm font-medium text-muted-foreground">
                          Description
                        </h4>
                        <p className="text-base whitespace-pre-wrap">
                          {asset.deskripsi || "No description provided."}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <ClipboardList className="h-5 w-5" />
                        Current Assignment
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium text-muted-foreground">
                          Department
                        </h4>
                        <p className="text-base">
                          {asset.department_fk.nama_department}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium text-muted-foreground">
                          Division
                        </h4>
                        <p className="text-base">
                          {asset.divisi_fk?.nama_divisi || "-"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium text-muted-foreground">
                          Assigned To
                        </h4>
                        <p className="text-base">
                          {asset.karyawan_fk?.nama || "Available"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium text-muted-foreground">
                          Location
                        </h4>
                        <p className="text-base">
                          {asset.assetLocation?.name || asset.lokasi || "-"}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* SPECIFICATIONS TAB */}
                <TabsContent value="specs" className="space-y-6 mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Tag className="h-5 w-5" />
                        Technical Specifications
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium text-muted-foreground">
                          Brand
                        </h4>
                        <p className="text-base">{asset.brand || "-"}</p>
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium text-muted-foreground">
                          Model
                        </h4>
                        <p className="text-base">{asset.model || "-"}</p>
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium text-muted-foreground">
                          Serial Number
                        </h4>
                        <p className="text-base font-mono">
                          {asset.serial_number || "-"}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* PROCUREMENT TAB */}
                <TabsContent value="procurement" className="space-y-6 mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Procurement & Warranty
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium text-muted-foreground">
                          Purchase Date
                        </h4>
                        <p className="text-base">
                          {asset.tgl_pembelian
                            ? format(new Date(asset.tgl_pembelian), "PPP")
                            : "-"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium text-muted-foreground">
                          Purchase Price
                        </h4>
                        <p className="text-base">
                          {asset.harga
                            ? new Intl.NumberFormat("id-ID", {
                                style: "currency",
                                currency: "IDR",
                              }).format(Number(asset.harga))
                            : "-"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium text-muted-foreground">
                          Vendor
                        </h4>
                        <p className="text-base">{asset.vendor || "-"}</p>
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium text-muted-foreground">
                          Warranty Expiry
                        </h4>
                        <p className="text-base">
                          {asset.garansi_exp
                            ? format(new Date(asset.garansi_exp), "PPP")
                            : "-"}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* HISTORY TAB */}
                <TabsContent value="history" className="space-y-6 mt-4">
                  <AssetActivityLogTable assetId={assetId} />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
        <AssetDialog />
      </Main>
    </AssetDialogProvider>
  );
}
