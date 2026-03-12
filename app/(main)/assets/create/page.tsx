"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Plus, Package, Boxes, ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Main } from "@/components/main";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

import { FixedAssetFormFields } from "../components/fixed-asset-form-fields";
import { SupplyAssetFormFields } from "../components/supply-asset-form-fields";
import { AssetForm, assetFormSchema } from "@/schema/asset-schema";
import { ItemForm, itemFormSchema } from "@/schema/item-schema";
import { useCreateAsset } from "@/hooks/use-asset";
import { useCreateItem } from "@/hooks/use-item";

type AssetType = "fixed" | "supply";

export default function CreateAssetPage() {
  const router = useRouter();
  const [assetType, setAssetType] = useState<AssetType>("fixed");

  const createAssetMutation = useCreateAsset();
  const createItemMutation = useCreateItem();

  const fixedForm = useForm<AssetForm>({
    resolver: zodResolver(assetFormSchema),
    defaultValues: {
      assetName: "",
      categoryId: "",
      brand: "",
      model: "",
      department_id: "",
      status: "AVAILABLE",
      kondisi: "GOOD",
    },
  });

  const supplyForm = useForm<ItemForm>({
    resolver: zodResolver(itemFormSchema),
    defaultValues: {
      code: "",
      name: "",
      unit: "PCS",
      categoryId: "",
      minStock: 0,
      description: "",
    },
  });

  const onFixedSubmit = async (values: AssetForm) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (value instanceof Date) {
          formData.append(key, value.toISOString());
        } else {
          formData.append(key, String(value));
        }
      }
    });

    await createAssetMutation.mutateAsync({ formData });
    router.push("/assets");
  };

  const onSupplySubmit = async (values: ItemForm) => {
    const formData = new FormData();
    formData.append("code", values.code);
    formData.append("name", values.name);
    formData.append("unit", values.unit);
    formData.append("minStock", values.minStock.toString());
    if (values.categoryId) formData.append("categoryId", values.categoryId);
    if (values.description) formData.append("description", values.description);

    await createItemMutation.mutateAsync(formData);
    router.push("/inventory/items");
  };

  const isPending =
    createAssetMutation.isPending || createItemMutation.isPending;

  return (
    <Main fluid>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/assets">
            <Button variant="outline" size="icon" className="rounded-full">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Tambah Data Baru
            </h2>
            <p className="text-muted-foreground">
              Pilih apakah Anda ingin memasukkan Unit Aset Fisik baru atau
              Mendaftarkan Katalog Barang.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-8">
        {/* TYPE SELECTOR */}
        <Card className="border-2 border-primary/10 shadow-md overflow-hidden">
          <CardHeader className="bg-muted/30 pb-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle>Pilih Jenis Data</CardTitle>
                <CardDescription>
                  Apa yang ingin Anda masukkan ke dalam sistem saat ini?
                </CardDescription>
              </div>
              <Select
                value={assetType}
                onValueChange={(val: AssetType) => setAssetType(val)}
              >
                <SelectTrigger className="w-[300px] h-11">
                  <SelectValue placeholder="Pilih jenis input..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">
                    <div className="flex flex-col py-1">
                      <div className="flex items-center gap-2 font-medium">
                        <Boxes className="h-4 w-4" />
                        <span>Input Unit Aset Fisik</span>
                      </div>
                      <span className="text-xs text-muted-foreground ml-6 mt-1">
                        Masukkan barang bernilai (Laptop, Mobil) yang memiliki
                        Nomor Seri.
                      </span>
                    </div>
                  </SelectItem>
                  <SelectItem value="supply">
                    <div className="flex flex-col py-1">
                      <div className="flex items-center gap-2 font-medium">
                        <Package className="h-4 w-4" />
                        <span>Buat Master Barang / Katalog</span>
                      </div>
                      <span className="text-xs text-muted-foreground ml-6 mt-1">
                        Daftarkan jenis/merk barang baru (Bisa untuk Aset maupun
                        ATK).
                      </span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
        </Card>

        {/* FORM SECTION */}
        <Card className="shadow-lg border-none">
          <CardContent className="pt-8">
            {assetType === "fixed" ? (
              <Form {...fixedForm}>
                <form
                  onSubmit={fixedForm.handleSubmit(onFixedSubmit)}
                  className="space-y-8"
                >
                  <FixedAssetFormFields form={fixedForm} />
                  <Separator />
                  <div className="flex justify-end gap-3">
                    <Link href="/assets">
                      <Button variant="outline" type="button">
                        Cancel
                      </Button>
                    </Link>
                    <Button type="submit" disabled={isPending} className="px-8">
                      {isPending ? "Menyimpan..." : "Simpan Unit Aset"}
                    </Button>
                  </div>
                </form>
              </Form>
            ) : (
              <Form {...supplyForm}>
                <form
                  onSubmit={supplyForm.handleSubmit(onSupplySubmit)}
                  className="space-y-8"
                >
                  <SupplyAssetFormFields form={supplyForm} />
                  <Separator />
                  <div className="flex justify-end gap-3">
                    <Link href="/assets">
                      <Button variant="outline" type="button">
                        Cancel
                      </Button>
                    </Link>
                    <Button type="submit" disabled={isPending} className="px-8">
                      {isPending ? "Menyimpan..." : "Simpan Master Barang"}
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </div>
    </Main>
  );
}
