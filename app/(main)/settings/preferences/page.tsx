"use client";

import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bell,
  Globe,
  Calendar,
  Clock,
  Mail,
  Smartphone,
  MonitorCheck,
  Languages,
  Check,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  usePreferences,
  type Language,
  type DateFormat,
  type TimeFormat,
  type NotificationSettings,
} from "@/context/preferences-provider";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/50">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div>
        <p className="text-sm font-semibold leading-none">{title}</p>
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

// ─── Toggle Row ───────────────────────────────────────────────────────────────
function ToggleRow({
  icon: Icon,
  label,
  description,
  id,
  checked,
  onCheckedChange,
  badge,
}: {
  icon?: React.ElementType;
  label: string;
  description?: string;
  id: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  badge?: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3 transition-colors hover:bg-muted/30">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted/50">
            <Icon className="h-4 w-4 text-muted-foreground" />
          </div>
        )}
        <div>
          <div className="flex items-center gap-2">
            <Label htmlFor={id} className="text-sm font-medium cursor-pointer">
              {label}
            </Label>
            {badge && (
              <Badge variant="secondary" className="text-xs py-0">
                {badge}
              </Badge>
            )}
          </div>
          {description && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {description}
            </p>
          )}
        </div>
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

// ─── Language Options ─────────────────────────────────────────────────────────
const languageOptions: { value: Language; label: string; flag: string }[] = [
  { value: "id", label: "Bahasa Indonesia", flag: "🇮🇩" },
  { value: "en", label: "English (US)", flag: "🇺🇸" },
  { value: "en-gb", label: "English (UK)", flag: "🇬🇧" },
];

const dateFormatOptions: {
  value: DateFormat;
  label: string;
  example: string;
}[] = [
  { value: "dd/MM/yyyy", label: "DD/MM/YYYY", example: "04/03/2026" },
  { value: "MM/dd/yyyy", label: "MM/DD/YYYY", example: "03/04/2026" },
  { value: "yyyy-MM-dd", label: "YYYY-MM-DD", example: "2026-03-04" },
  { value: "d MMMM yyyy", label: "D MMMM YYYY", example: "4 Maret 2026" },
];

const timeFormatOptions: {
  value: TimeFormat;
  label: string;
  example: string;
}[] = [
  { value: "24h", label: "24 Jam", example: "21:30" },
  { value: "12h", label: "12 Jam (AM/PM)", example: "9:30 PM" },
];

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function PreferencesPage() {
  const t = useTranslations("preferences");
  const router = useRouter();

  const {
    language,
    setLanguage,
    dateFormat,
    setDateFormat,
    timeFormat,
    setTimeFormat,
    notifications,
    setNotification,
    resetPreferences,
  } = usePreferences();

  // When language changes: persist to cookie, then do a full router.refresh()
  // so the server re-reads the cookie and sends new messages to NextIntlClientProvider
  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    // Small delay to ensure cookie is set before refresh
    setTimeout(() => router.refresh(), 50);
  };

  const handleReset = () => {
    resetPreferences();
    setTimeout(() => router.refresh(), 50);
  };

  return (
    <div className="flex flex-col gap-8 flex-1 w-full max-w-2xl px-2 pb-12">
      {/* ── Page Header ─────────────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold">{t("title")}</h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            {t("description")}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          className="gap-2 shrink-0"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          {t("reset")}
        </Button>
      </div>

      <Separator />

      {/* ── Bahasa & Regional ───────────────────────────────────────── */}
      <section className="space-y-4">
        <SectionHeader
          icon={Globe}
          title={t("language.title")}
          description={t("language.description")}
        />

        <div className="space-y-3">
          {/* Language picker */}
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
            <Languages className="h-3.5 w-3.5" />
            {t("language.interface")}
          </Label>
          <div className="flex flex-col gap-2">
            {languageOptions.map((opt) => {
              const isActive = language === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => handleLanguageChange(opt.value)}
                  className={cn(
                    "flex items-center justify-between rounded-xl border-2 px-4 py-2.5 text-left transition-all hover:bg-accent/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                    isActive
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-border/80",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{opt.flag}</span>
                    <span className="text-sm font-medium">{opt.label}</span>
                  </div>
                  {isActive && (
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary shrink-0">
                      <Check className="h-3 w-3 text-primary-foreground" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Date Format */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {t("language.dateFormat")}
            </Label>
            <Select
              value={dateFormat}
              onValueChange={(v) => setDateFormat(v as DateFormat)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {dateFormatOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    <span className="font-medium">{opt.label}</span>
                    <span className="ml-2 text-muted-foreground text-xs">
                      ({opt.example})
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Time Format */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {t("language.timeFormat")}
            </Label>
            <Select
              value={timeFormat}
              onValueChange={(v) => setTimeFormat(v as TimeFormat)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timeFormatOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    <span className="font-medium">{opt.label}</span>
                    <span className="ml-2 text-muted-foreground text-xs">
                      ({opt.example})
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      <Separator />

      {/* ── Notifikasi In-App ────────────────────────────────────────── */}
      <section className="space-y-4">
        <SectionHeader
          icon={Bell}
          title={t("notifications.inApp.title")}
          description={t("notifications.inApp.description")}
        />
        <div className="flex flex-col gap-2">
          <ToggleRow
            id="assetUpdate"
            icon={MonitorCheck}
            label={t("notifications.inApp.assetUpdate")}
            description={t("notifications.inApp.assetUpdateDesc")}
            checked={notifications.assetUpdate}
            onCheckedChange={(v) => setNotification("assetUpdate", v)}
          />
          <ToggleRow
            id="maintenance"
            icon={MonitorCheck}
            label={t("notifications.inApp.maintenance")}
            description={t("notifications.inApp.maintenanceDesc")}
            checked={notifications.maintenance}
            onCheckedChange={(v) => setNotification("maintenance", v)}
          />
          <ToggleRow
            id="loan"
            icon={MonitorCheck}
            label={t("notifications.inApp.loan")}
            description={t("notifications.inApp.loanDesc")}
            checked={notifications.loan}
            onCheckedChange={(v) => setNotification("loan", v)}
          />
          <ToggleRow
            id="transfer"
            icon={MonitorCheck}
            label={t("notifications.inApp.transfer")}
            description={t("notifications.inApp.transferDesc")}
            checked={notifications.transfer}
            onCheckedChange={(v) => setNotification("transfer", v)}
          />
          <ToggleRow
            id="system"
            icon={MonitorCheck}
            label={t("notifications.inApp.system")}
            description={t("notifications.inApp.systemDesc")}
            badge={t("notifications.inApp.recommended")}
            checked={notifications.system}
            onCheckedChange={(v) => setNotification("system", v)}
          />
        </div>
      </section>

      <Separator />

      {/* ── Notifikasi Email ─────────────────────────────────────────── */}
      <section className="space-y-4">
        <SectionHeader
          icon={Mail}
          title={t("notifications.email.title")}
          description={t("notifications.email.description")}
        />
        <div className="flex flex-col gap-2">
          <ToggleRow
            id="emailSummary"
            icon={Mail}
            label={t("notifications.email.summary")}
            description={t("notifications.email.summaryDesc")}
            checked={notifications.emailSummary}
            onCheckedChange={(v) => setNotification("emailSummary", v)}
          />
          <ToggleRow
            id="emailAlert"
            icon={Mail}
            label={t("notifications.email.alert")}
            description={t("notifications.email.alertDesc")}
            badge={t("notifications.email.important")}
            checked={notifications.emailAlert}
            onCheckedChange={(v) => setNotification("emailAlert", v)}
          />
          <ToggleRow
            id="emailReport"
            icon={Mail}
            label={t("notifications.email.report")}
            description={t("notifications.email.reportDesc")}
            checked={notifications.emailReport}
            onCheckedChange={(v) => setNotification("emailReport", v)}
          />
        </div>
      </section>

      <Separator />

      {/* ── Notifikasi Push ──────────────────────────────────────────── */}
      <section className="space-y-4">
        <SectionHeader
          icon={Smartphone}
          title={t("notifications.push.title")}
          description={t("notifications.push.description")}
        />
        <div className="flex flex-col gap-2">
          <ToggleRow
            id="pushEnabled"
            icon={Smartphone}
            label={t("notifications.push.browser")}
            description={t("notifications.push.browserDesc")}
            badge={
              notifications.pushEnabled
                ? t("common.active", { ns: "common" })
                : undefined
            }
            checked={notifications.pushEnabled}
            onCheckedChange={(v) => setNotification("pushEnabled", v)}
          />
        </div>
        {!notifications.pushEnabled && (
          <p className="text-xs text-muted-foreground px-1">
            {t("notifications.push.hint")}
          </p>
        )}
      </section>
    </div>
  );
}
