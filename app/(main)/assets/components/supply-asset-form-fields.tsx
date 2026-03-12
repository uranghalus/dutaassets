"use client";

import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ItemForm } from "@/schema/item-schema";
import { useAllItemCategories } from "@/hooks/use-item-category";

interface SupplyAssetFormFieldsProps {
  form: UseFormReturn<ItemForm>;
}

export function SupplyAssetFormFields({ form }: SupplyAssetFormFieldsProps) {
  const { data: categories } = useAllItemCategories();

  return (
    <div className="space-y-6">
      <div className="bg-primary/5 rounded-md p-4 text-sm text-primary mb-6 border border-primary/20">
        <b>Membuat Master Barang (Katalog)</b>
        <br />
        Langkah ini mendaftarkan barang baru ke dalam katalog sistem. Jika Anda
        membuat item bertipe Consumable (Contoh: Kertas HVS), nantinya Anda
        langsung mengatur stoknya. Jika bertipe Asset (Contoh: Mesin Bor X),
        nantinya Anda bisa menambahkan nomor seri unit satu per satu yang
        menginduk ke master ini.
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* CODE */}
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kode Barang *</FormLabel>
              <FormControl>
                <Input placeholder="Item-001" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* NAME */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Barang / Merk *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Contoh: Kertas HVS A4 / Laptop Asus ROG"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* CATEGORY */}
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kategori *</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Kategori Barang" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories?.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* UNIT */}
        <FormField
          control={form.control}
          name="unit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Satuan (Pcs, Unit, Rim, dll) *</FormLabel>
              <FormControl>
                <Input placeholder="PCS, LUSIN, BOX..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* MIN STOCK */}
      <FormField
        control={form.control}
        name="minStock"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Peringatan Batas Stok Minimum</FormLabel>
            <FormControl>
              <Input
                type="number"
                min={0}
                {...field}
                onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* DESCRIPTION */}
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Catatan / Spesifikasi Lengkap</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Tuliskan detail spesifikasi, warna, atau catatan ekstra..."
                className="resize-none min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
