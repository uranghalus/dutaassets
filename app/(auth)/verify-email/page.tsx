"use client";

import { useEffect, useState, Suspense } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function VerifyEmailInner() {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("Memverifikasi email Anda...");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  useEffect(() => {
    async function verify() {
      if (!token) {
        setStatus("error");
        setMessage("Token verifikasi tidak ditemukan.");
        return;
      }

      const { error } = await authClient.verifyEmail({
        query: {
          token,
        },
      });

      if (error) {
        setStatus("error");
        setMessage(error.message || "Gagal memverifikasi email.");
        toast.error(error.message || "Gagal memverifikasi email.");
      } else {
        setStatus("success");
        setMessage("Email Anda berhasil diverifikasi!");
        toast.success("Email Anda berhasil diverifikasi!");
      }
    }

    verify();
  }, [token]);

  // suppress unused warning
  void router;

  return (
    <>
      <div className="flex flex-col items-center justify-center space-y-4 px-4 py-8 text-center">
        {status === "loading" && (
          <>
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <h2 className="text-xl font-semibold">Memverifikasi...</h2>
            <p className="text-muted-foreground">{message}</p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle2 className="h-12 w-12 text-green-500" />
            <h2 className="text-xl font-semibold text-green-600">Berhasil!</h2>
            <p className="text-muted-foreground">{message}</p>
            <Button className="w-full max-w-xs mt-4" asChild>
              <Link href="/">Kembali ke Login</Link>
            </Button>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="h-12 w-12 text-destructive" />
            <h2 className="text-xl font-semibold text-destructive">
              Oops, Gagal!
            </h2>
            <p className="text-muted-foreground">{message}</p>
            <Button variant="outline" className="w-full max-w-xs mt-4" asChild>
              <Link href="/">Kembali ke Login</Link>
            </Button>
          </>
        )}
      </div>
    </>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailInner />
    </Suspense>
  );
}
