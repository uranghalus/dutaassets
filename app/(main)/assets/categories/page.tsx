import React from "react";
import { Main } from "@/components/main";
import { DialogProvider } from "@/context/dialog-provider";

import { Metadata } from "next";

import CategoryDialogs from "./components/category-dialog";
import CategoryPrimaryButtons from "./components/category-primary-buttons";
import { CategoryTable } from "./components/category-table";

export const metadata: Metadata = {
  title: "Asset Categories",
  description: "Manage asset categories",
};

export default function CategoryPage() {
  return (
    <DialogProvider>
      <Main fluid className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Asset Categories
            </h2>
            <p className="text-muted-foreground">
              Manage categories for your assets.
            </p>
          </div>
          <CategoryPrimaryButtons />
        </div>
        <CategoryTable />
      </Main>
      <CategoryDialogs />
    </DialogProvider>
  );
}
