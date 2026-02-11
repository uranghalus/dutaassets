"use client";

import { Button } from "@/components/ui/button";
import { useDialog } from "@/context/dialog-provider";
import { EmployeeWithDivisi } from "@/types/employee";
import { Edit } from "lucide-react";

interface EmployeeDetailsActionsProps {
  employee: EmployeeWithDivisi;
}

export function EmployeeDetailsActions({
  employee,
}: EmployeeDetailsActionsProps) {
  const { setOpen, setCurrentRow } = useDialog();

  return (
    <Button
      variant="outline"
      onClick={() => {
        setCurrentRow(employee);
        setOpen("edit");
      }}
    >
      <Edit className="mr-2 h-4 w-4" />
      Edit Employee
    </Button>
  );
}
