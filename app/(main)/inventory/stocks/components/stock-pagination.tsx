"use client";

import { cn, getPageNumbers } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

interface StockPaginationProps {
  pageCount: number;
  currentPage: number;
  pageSize: number;
  total: number;
}

export function StockPagination({
  pageCount,
  currentPage,
  pageSize,
}: StockPaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const totalPages = pageCount;
  const pageNumbers = getPageNumbers(currentPage, totalPages);

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const createLimitURL = (limit: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("limit", limit);
    params.set("page", "1");
    return `${pathname}?${params.toString()}`;
  };

  const handleNavigate = (url: string) => {
    startTransition(() => {
      router.push(url);
    });
  };

  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex items-center gap-2">
        <p className="hidden text-xs font-medium sm:block text-muted-foreground whitespace-nowrap">
          Rows per page
        </p>
        <Select
          value={`${pageSize}`}
          onValueChange={(value) => handleNavigate(createLimitURL(value))}
        >
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent side="top">
            {[10, 20, 30, 40, 50].map((size) => (
              <SelectItem key={size} value={`${size}`}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex w-[140px] items-center justify-center text-sm font-medium text-muted-foreground">
          Page {currentPage} of {totalPages}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          className="size-8 p-0"
          onClick={() => handleNavigate(createPageURL(1))}
          disabled={currentPage <= 1 || isPending}
        >
          <ChevronsLeftIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="size-8 p-0"
          onClick={() => handleNavigate(createPageURL(currentPage - 1))}
          disabled={currentPage <= 1 || isPending}
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>

        {pageNumbers.map((page, i) =>
          page === "..." ? (
            <span
              key={`ellipsis-${i}`}
              className="px-1 text-sm text-muted-foreground"
            >
              ...
            </span>
          ) : (
            <Button
              key={page}
              variant={page === currentPage ? "default" : "outline"}
              className="h-8 min-w-8 px-2"
              onClick={() => handleNavigate(createPageURL(page))}
              disabled={isPending}
            >
              {page}
            </Button>
          ),
        )}

        <Button
          variant="outline"
          className="size-8 p-0"
          onClick={() => handleNavigate(createPageURL(currentPage + 1))}
          disabled={currentPage >= totalPages || isPending}
        >
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="size-8 p-0"
          onClick={() => handleNavigate(createPageURL(totalPages))}
          disabled={currentPage >= totalPages || isPending}
        >
          <ChevronsRightIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
