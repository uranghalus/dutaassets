"use server";

import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { assetLoanFormSchema } from "@/schema/asset-loan-schema";

export async function getAssetLoans({
  page = 1,
  pageSize = 10,
  search = "",
}: {
  page?: number;
  pageSize?: number;
  search?: string;
}) {
  const session = await getServerSession();
  if (!session) throw new Error("Unauthorized");

  const organizationId = session.session.activeOrganizationId;
  if (!organizationId) throw new Error("No active organization");

  const skip = (page - 1) * pageSize;
  const take = pageSize;

  const where: any = {
    organizationId,
    OR: search
      ? [
          {
            asset: {
              OR: [
                { nama_asset: { contains: search } },
                { kode_asset: { contains: search } },
              ],
            },
          },
          {
            employee: {
              nama: { contains: search },
            },
          },
        ]
      : undefined,
  };

  const [data, total] = await Promise.all([
    prisma.assetLoan.findMany({
      where,
      include: {
        asset: true,
        employee: true,
      },
      skip,
      take,
      orderBy: { createdAt: "desc" },
    }),
    prisma.assetLoan.count({ where }),
  ]);

  return {
    data,
    pageCount: Math.ceil(total / pageSize),
    total,
  };
}

export async function createAssetLoan(formData: FormData) {
  const session = await getServerSession();
  if (!session) throw new Error("Unauthorized");

  const organizationId = session.session.activeOrganizationId;
  if (!organizationId) throw new Error("No active organization");

  const rawData = Object.fromEntries(formData.entries());
  const validatedFields = assetLoanFormSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      error: "Validation failed",
      details: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { assetId, employeeId, loanDate, returnDate, notes } = validatedFields.data;

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Check if asset is available
      const asset = await tx.asset.findUnique({
        where: { id_barang: assetId, organization_id: organizationId },
      });

      if (!asset) throw new Error("Asset not found");
      if (asset.status !== "AVAILABLE") throw new Error("Asset is not available for loan");

      // 2. Create Loan Record
      const loan = await tx.assetLoan.create({
        data: {
          organizationId,
          assetId,
          employeeId,
          loanDate,
          returnDate: returnDate || null,
          notes,
          status: "ACTIVE",
        },
      });

      // 3. Update Asset Status and assign it to the employee
      await tx.asset.update({
        where: { id_barang: assetId },
        data: {
          status: "IN_USE",
          karyawan_id: employeeId,
        },
      });

      return loan;
    });

    revalidatePath("/asset-loans");
    revalidatePath("/assets");
    return { success: true, data: result };
  } catch (error: any) {
    console.error("Failed to create asset loan:", error);
    return { error: error.message || "Failed to create asset loan" };
  }
}

export async function returnAssetLoan(id: string, notes?: string) {
  const session = await getServerSession();
  if (!session) throw new Error("Unauthorized");

  const organizationId = session.session.activeOrganizationId;
  if (!organizationId) throw new Error("No active organization");

  try {
    await prisma.$transaction(async (tx) => {
      const loan = await tx.assetLoan.findUnique({
        where: { id, organizationId },
      });

      if (!loan) throw new Error("Loan record not found");
      if (loan.status === "RETURNED") throw new Error("Asset already returned");

      // 1. Update Loan Record
      await tx.assetLoan.update({
        where: { id },
        data: {
          status: "RETURNED",
          actualReturnDate: new Date(),
          notes: notes || loan.notes,
        },
      });

      // 2. Update Asset Status and unassign from employee
      await tx.asset.update({
        where: { id_barang: loan.assetId },
        data: {
          status: "AVAILABLE",
          karyawan_id: null,
        },
      });
    });

    revalidatePath("/asset-loans");
    revalidatePath("/assets");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to return asset loan:", error);
    return { error: error.message || "Failed to return asset loan" };
  }
}

export async function deleteAssetLoan(id: string) {
  const session = await getServerSession();
  if (!session) throw new Error("Unauthorized");

  const organizationId = session.session.activeOrganizationId;
  if (!organizationId) throw new Error("No active organization");

  try {
    await prisma.$transaction(async (tx) => {
      const loan = await tx.assetLoan.findUnique({
        where: { id, organizationId },
      });

      if (!loan) throw new Error("Loan record not found");

      // If deleting an ACTIVE loan, reset the asset status
      if (loan.status === "ACTIVE") {
        await tx.asset.update({
          where: { id_barang: loan.assetId },
          data: {
            status: "AVAILABLE",
            karyawan_id: null,
          },
        });
      }

      await tx.assetLoan.delete({
        where: { id },
      });
    });

    revalidatePath("/asset-loans");
    revalidatePath("/assets");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete asset loan:", error);
    return { error: error.message || "Failed to delete asset loan" };
  }
}
