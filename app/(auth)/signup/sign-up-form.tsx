"use client";
import { PasswordInput } from "@/components/password-input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { SignupSchema, SignupValues } from "@/schema/auth-schema";
import { signupWithNIKAction, validateNIKAction } from "@/action/auth-action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2, ArrowRight, CheckCircle2 } from "lucide-react";

export default function SignUpForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [employeeData, setEmployeeData] = useState<{
    id_karyawan: string;
    nama: string;
  } | null>(null);
  const router = useRouter();

  const form = useForm<SignupValues>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      nik: "",
      name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleNextStep = async () => {
    const nik = form.getValues("nik");
    if (!nik) {
      form.setError("nik", { message: "Silakan masukkan NIK Anda" });
      return;
    }

    setIsLoading(true);
    try {
      const res = await validateNIKAction(nik);
      if (res.status === "success" && res.data) {
        setEmployeeData(res.data);
        form.setValue("name", res.data.nama);
        setStep(2);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat validasi NIK");
    } finally {
      setIsLoading(false);
    }
  };

  async function onSubmit(values: SignupValues) {
    setIsLoading(true);
    try {
      const res = await signupWithNIKAction(values);
      if (res.status === "success") {
        toast.success(res.message);
        router.push("/");
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat registrasi");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-4">
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <FormField
                control={form.control}
                name="nik"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NIK (Nomor Induk Karyawan)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Masukkan NIK Anda"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription>
                      Gunakan NIK yang terdaftar di sistem HR.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                className="w-full"
                onClick={handleNextStep}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <ArrowRight className="mr-2 h-4 w-4" />
                )}
                Verifikasi NIK
              </Button>
            </div>
          )}

          {step === 2 && employeeData && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="bg-muted/50 p-4 rounded-lg flex items-start gap-3 mb-4 border border-primary/20">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium">NIK Terverifikasi</p>
                  <p className="text-xs text-muted-foreground">
                    Karyawan:{" "}
                    <span className="font-semibold text-foreground">
                      {employeeData.nama}
                    </span>
                  </p>
                </div>
              </div>

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Pilih username"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="name@example.com"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <PasswordInput
                          placeholder="********"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Konfirmasi Password</FormLabel>
                      <FormControl>
                        <PasswordInput
                          placeholder="********"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setStep(1)}
                  disabled={isLoading}
                >
                  Kembali
                </Button>
                <Button type="submit" className="flex-[2]" disabled={isLoading}>
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Daftar Sekarang
                </Button>
              </div>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}
