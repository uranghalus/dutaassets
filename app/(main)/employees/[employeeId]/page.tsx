import { getEmployeeById } from "@/action/employees-action";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import {
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  MapPin,
  Building2,
  Calendar,
  UserCheck,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Main } from "@/components/main";
import { DialogProvider } from "@/context/dialog-provider";
import EmployeeDialogs from "../components/employees-dialogs";
import { EmployeeDetailsActions } from "./employee-details-actions";
import { EmployeeWithDivisi } from "@/types/employee";

export default async function EmployeeDetailsPage({
  params,
}: {
  params: Promise<{ employeeId: string }>;
}) {
  const { employeeId } = await params;
  const employee = await getEmployeeById(employeeId);

  if (!employee) {
    notFound();
  }

  const initials = employee.nama
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <DialogProvider>
      <Main fluid>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/employees">
                <Button variant="outline" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h2 className="text-2xl font-bold tracking-tight">
                  {employee.nama}
                </h2>
                <p className="text-muted-foreground flex items-center gap-2">
                  <span className="font-mono text-sm">{employee.nik}</span>
                  <span>•</span>
                  <span className="text-sm">{employee.jabatan}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <EmployeeDetailsActions
                employee={employee as EmployeeWithDivisi}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Sidebar / Summary Card */}
            <Card className="md:col-span-1 h-fit">
              <CardContent className="pt-6 flex flex-col items-center text-center">
                <Avatar className="h-32 w-32 mb-4">
                  <AvatarImage src={employee.foto || ""} alt={employee.nama} />
                  <AvatarFallback className="text-2xl">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-lg">{employee.nama}</h3>
                <p className="text-sm text-muted-foreground">
                  {employee.jabatan}
                </p>

                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  <Badge
                    variant={
                      employee.status_karyawan === "tetap"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {employee.status_karyawan}
                  </Badge>
                  <Badge variant="outline">
                    {employee.divisi_fk.nama_divisi}
                  </Badge>
                </div>

                <Separator className="my-6" />

                <div className="w-full space-y-4 text-left">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {employee.userId && employee.user
                        ? employee.user.email
                        : "No linked account"}
                    </span>
                  </div>
                  {employee.telp && (
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{employee.telp}</span>
                    </div>
                  )}
                  {employee.alamat && (
                    <div className="flex items-start gap-3 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <span>{employee.alamat}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Main Content */}
            <div className="md:col-span-3">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="assets">
                    Assets ({employee.assets.length})
                  </TabsTrigger>
                  <TabsTrigger value="loans">
                    Asset Loans ({employee.assetLoans.length})
                  </TabsTrigger>
                </TabsList>

                {/* OVERVIEW TAB */}
                <TabsContent value="overview" className="space-y-6 mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">
                          Full Name
                        </h4>
                        <p>{employee.nama}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">
                          Alias / Nickname
                        </h4>
                        <p>{employee.nama_alias || "-"}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">
                          NIK
                        </h4>
                        <p>{employee.nik}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">
                          KTP / ID Number
                        </h4>
                        <p>{employee.no_ktp}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">
                          Place of Birth
                        </h4>
                        <p>{employee.tempat_lahir || "-"}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">
                          Date of Birth
                        </h4>
                        <p>
                          {employee.tgl_lahir
                            ? format(new Date(employee.tgl_lahir), "PPP")
                            : "-"}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Employment Details</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">
                          Department
                        </h4>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {employee.divisi_fk.department.nama_department}
                          </span>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">
                          Division
                        </h4>
                        <p>{employee.divisi_fk.nama_divisi}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">
                          Join Date
                        </h4>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {employee.tgl_masuk
                              ? format(new Date(employee.tgl_masuk), "PPP")
                              : "-"}
                          </span>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">
                          Call Sign
                        </h4>
                        <p>{employee.call_sign || "-"}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>System Account</CardTitle>
                      <CardDescription>
                        Linked user account for system access
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {employee.user ? (
                        <div className="flex items-center justify-between bg-muted/50 p-3 rounded-md">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={employee.user.image || ""} />
                              <AvatarFallback>
                                <UserCheck className="h-5 w-5" />
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">
                                {employee.user.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {employee.user.email}
                              </p>
                            </div>
                          </div>
                          <Badge variant="outline" className="gap-1">
                            <Shield className="h-3 w-3" />
                            {employee.user.role || "User"}
                          </Badge>
                        </div>
                      ) : (
                        <div className="text-center py-4 bg-muted/20 rounded-md border border-dashed">
                          <p className="text-muted-foreground text-sm">
                            No user account linked to this employee.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* ASSETS TAB */}
                <TabsContent value="assets" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Assigned Assets</CardTitle>
                      <CardDescription>
                        Assets currently in possession of {employee.nama}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {employee.assets.length > 0 ? (
                        <div className="rounded-md border">
                          <table className="w-full text-sm">
                            <thead className="bg-muted/50">
                              <tr className="border-b">
                                <th className="h-10 px-4 text-left font-medium">
                                  Asset Code
                                </th>
                                <th className="h-10 px-4 text-left font-medium">
                                  Name
                                </th>
                                <th className="h-10 px-4 text-left font-medium">
                                  Category
                                </th>
                                <th className="h-10 px-4 text-left font-medium">
                                  Condition
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {employee.assets.map((asset) => (
                                <tr
                                  key={asset.id_barang}
                                  className="border-b last:border-0 hover:bg-muted/50"
                                >
                                  <td className="p-4 font-mono">
                                    {asset.kode_asset}
                                  </td>
                                  <td className="p-4">{asset.nama_asset}</td>
                                  <td className="p-4">
                                    {asset.kategori_asset}
                                  </td>
                                  <td className="p-4">{asset.kondisi}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="text-center py-10 text-muted-foreground">
                          No assets assigned.
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* LOANS TAB */}
                <TabsContent value="loans" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Loan History</CardTitle>
                      <CardDescription>History of asset loans</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {employee.assetLoans.length > 0 ? (
                        <div className="rounded-md border">
                          <table className="w-full text-sm">
                            <thead className="bg-muted/50">
                              <tr className="border-b">
                                <th className="h-10 px-4 text-left font-medium">
                                  Date
                                </th>
                                <th className="h-10 px-4 text-left font-medium">
                                  Asset
                                </th>
                                <th className="h-10 px-4 text-left font-medium">
                                  Status
                                </th>
                                <th className="h-10 px-4 text-left font-medium">
                                  Return Date
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {employee.assetLoans.map((loan) => (
                                <tr
                                  key={loan.id}
                                  className="border-b last:border-0 hover:bg-muted/50"
                                >
                                  <td className="p-4">
                                    {format(new Date(loan.loanDate), "PP")}
                                  </td>
                                  <td className="p-4">
                                    <div className="flex flex-col">
                                      <span className="font-medium">
                                        {loan.asset.nama_asset}
                                      </span>
                                      <span className="text-xs text-muted-foreground font-mono">
                                        {loan.asset.kode_asset}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="p-4">
                                    <Badge
                                      variant={
                                        loan.status === "ACTIVE"
                                          ? "default"
                                          : "secondary"
                                      }
                                    >
                                      {loan.status}
                                    </Badge>
                                  </td>
                                  <td className="p-4">
                                    {loan.returnDate
                                      ? format(new Date(loan.returnDate), "PP")
                                      : "-"}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="text-center py-10 text-muted-foreground">
                          No loan history found.
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </Main>
      <EmployeeDialogs />
    </DialogProvider>
  );
}
