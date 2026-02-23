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
            kode_asset: "",
            nama_asset: "",
            categoryId: "",
            department_id: "",
            status: "AVAILABLE",
            harga: 0,
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

    const isPending = createAssetMutation.isPending || createItemMutation.isPending;

    return (
        <Main fluid className="max-w-5xl mx-auto py-8">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/assets">
                        <Button variant="outline" size="icon" className="rounded-full">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Create New Asset</h2>
                        <p className="text-muted-foreground">
                            Register a new fixed asset or supply item into the system.
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
                                <CardTitle>Asset Classification</CardTitle>
                                <CardDescription>
                                    Choose the type of asset you want to register
                                </CardDescription>
                            </div>
                            <Select
                                value={assetType}
                                onValueChange={(val: AssetType) => setAssetType(val)}
                            >
                                <SelectTrigger className="w-[200px] h-11">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="fixed">
                                        <div className="flex items-center gap-2">
                                            <Boxes className="h-4 w-4" />
                                            <span>Fixed Asset</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="supply">
                                        <div className="flex items-center gap-2">
                                            <Package className="h-4 w-4" />
                                            <span>Supply Asset</span>
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
                                            {isPending ? "Creating..." : "Create Fixed Asset"}
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
                                            {isPending ? "Creating..." : "Create Supply Asset"}
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
