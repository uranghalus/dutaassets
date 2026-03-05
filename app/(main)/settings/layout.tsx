import { Main } from "@/components/main";
import { Separator } from "@/components/ui/separator";
import { UserCog, Wrench, Sliders, Palette, FileInput } from "lucide-react";
import React, { ReactNode } from "react";
import { SidebarNav } from "./components/sidebarnav";
import { useTranslations } from "next-intl";

interface Props {
  children: ReactNode;
}

export default function SettingLayout({ children }: Props) {
  const t = useTranslations("settings");

  const sidebarNavItems = [
    {
      title: t("profile"),
      href: "/settings/profile",
      icon: <UserCog size={18} />,
    },
    {
      title: t("account"),
      href: "/settings/account",
      icon: <Wrench size={18} />,
    },
    {
      title: t("appearance"),
      href: "/settings/appearance",
      icon: <Palette size={18} />,
    },
    {
      title: t("preferences"),
      href: "/settings/preferences",
      icon: <Sliders size={18} />,
    },
    {
      title: t("importExport"),
      href: "/settings/import-export",
      icon: <FileInput size={18} />,
    },
  ];

  return (
    <Main fixed>
      <div className="space-y-0.5">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          {t("title")}
        </h1>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>

      <Separator className="my-4 lg:my-6" />

      <div className="flex flex-1 flex-col space-y-2 overflow-auto md:space-y-2 lg:flex-row lg:space-y-0 lg:space-x-12">
        <aside className="top-0 lg:sticky lg:w-1/5">
          <SidebarNav items={sidebarNavItems} />
        </aside>

        {/* ===== Content replaces <Outlet /> ===== */}
        <div className="flex w-full overflow-y-auto p-1">{children}</div>
      </div>
    </Main>
  );
}
