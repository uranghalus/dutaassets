"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const ForgotPasswordSchema = z.object({
  email: z.string().email("Email tidak valid"),
});

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<z.infer<typeof ForgotPasswordSchema>>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof ForgotPasswordSchema>) {
    setIsLoading(true);
    const { email } = values;

    const { data, error } = await authClient.requestPasswordReset({
      email,
      redirectTo: "/reset-password",
    });

    if (error) {
      toast.error(error.message || "Gagal mengirim email reset password");
    } else {
      setIsSubmitted(true);
      toast.success("Email reset password telah dikirim");
    }
    setIsLoading(false);
  }

  return (
    <>
      <div className="flex flex-col space-y-2 text-start sm:px-4 px-4">
        <h2 className="text-lg font-semibold tracking-tight">Lupa Password</h2>
        <p className="text-muted-foreground text-sm">
          {isSubmitted
            ? "Kami telah mengirimkan instruksi reset password ke email Anda."
            : "Masukkan email Anda untuk menerima link reset password."}
        </p>
      </div>

      {!isSubmitted ? (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 px-4"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="name@example.com"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Kirim Link Reset
            </Button>
          </form>
        </Form>
      ) : (
        <div className="px-4">
          <Button variant="outline" className="w-full" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Login
            </Link>
          </Button>
        </div>
      )}

      {!isSubmitted && (
        <div className="flex justify-center text-sm px-4">
          <Link
            href="/"
            className="text-muted-foreground hover:text-primary underline underline-offset-4"
          >
            Kembali ke Login
          </Link>
        </div>
      )}
    </>
  );
}
