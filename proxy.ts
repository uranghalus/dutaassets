import { NextResponse, type NextRequest } from "next/server";

export default function proxy(req: NextRequest) {
  const url = req.nextUrl;
  const pathname = url.pathname;
  const searchParams = url.searchParams.toString().toLowerCase();

  // 1. Blokir Akses ke File/Path Sensitif (Reconnaissance / Directory Traversal)
  // Hacker sering menggunakan bot otomatis untuk mencari celah wp-admin atau file .env
  const blockedPaths = [
    ".env",
    ".git",
    "wp-admin",
    "wp-login.php",
    "phpmyadmin",
    ".config",
  ];
  if (blockedPaths.some((path) => pathname.includes(path))) {
    return new NextResponse(
      JSON.stringify({
        error: "Forbidden: Akses rute mencurigakan terdeteksi.",
      }),
      { status: 403, headers: { "Content-Type": "application/json" } },
    );
  }

  // 2. Blokir Pola Serangan XSS (Cross-Site Scripting) di URL Parameter
  const xssPatterns = [
    "<script",
    "%3Cscript",
    "javascript:",
    "onerror=",
    "onload=",
    "eval(",
  ];
  if (xssPatterns.some((pattern) => searchParams.includes(pattern))) {
    return new NextResponse(
      JSON.stringify({ error: "Forbidden: Payload XSS terdeteksi." }),
      { status: 403, headers: { "Content-Type": "application/json" } },
    );
  }

  // 3. Blokir Pola LFI (Local File Inclusion / Path Traversal) sederhana
  if (
    pathname.includes("../") ||
    searchParams.includes("../") ||
    searchParams.includes("..%2f")
  ) {
    return new NextResponse(
      JSON.stringify({
        error: "Forbidden: Payload Path Traversal terdeteksi.",
      }),
      { status: 403, headers: { "Content-Type": "application/json" } },
    );
  }

  // 4. Rate Limiting Simulasi (Catatan: Untuk Production gunakan Redis / Upstash Rate Limiter)
  // Contoh pengecekan user-agent kosongan (biasanya CURL bot atau script nakal)
  const userAgent = req.headers.get("user-agent") || "";
  if (
    !userAgent ||
    userAgent.toLowerCase().includes("curl") ||
    userAgent.toLowerCase().includes("postman")
  ) {
    // Sebagai contoh kita biarkan Postman/Curl jalan dulu, tapi di strict mode, script tanpa UA valid bisa diblokir
    // console.log("Warning: Bot Activity Detected");
  }

  // 5. Perlindungan Route API Internal Next.js (/api/...)
  // Mencegah akses langsung API dari URL Bar Browser atau serangan CSRF sederhana
  if (pathname.startsWith("/api/")) {
    const referer = req.headers.get("referer");
    const origin = req.headers.get("origin");
    const accept = req.headers.get("accept") || "";

    // Pastikan request API mengharapkan response JSON (bot scanner kadang expect text/html)
    if (!accept.includes("application/json") && !accept.includes("*/*")) {
      return new NextResponse(
        JSON.stringify({
          error:
            "Forbidden: Endpoint API hanya menerima request berformat JSON.",
        }),
        { status: 406, headers: { "Content-Type": "application/json" } },
      );
    }

    // (Opsional) CSRF Protection Dasar: memastikan Origin / Referer berasal dari domain sendiri
    // Catatan: Jika Anda menggunakan Postman/Mobile App, aturan ini mungkin perlu disesuaikan (misal ditambah whitelist API Key).
    const isSameOrigin =
      (origin && origin.includes(url.host)) ||
      (referer && referer.includes(url.host));

    if (!isSameOrigin && process.env.NODE_ENV === "production") {
      // console.warn("API request ditolak karena Origin/Referer tidak valid:", { origin, referer });
      // return new NextResponse(
      //   JSON.stringify({ error: "Forbidden: Permintaan API tidak sah (CSRF Protection)." }),
      //   { status: 403, headers: { "Content-Type": "application/json" } }
      // );
    }
  }

  // Jika semua pengecekan aman, teruskan request ke halaman/API internal Next.js
  const response = NextResponse.next();

  // Tambahkan custom security header dari sisi Proxy
  response.headers.set("X-Application-Proxy", "Protected");

  return response;
}

// Konfigurasi Matcher: Tentukan rute mana saja yang akan melewati proxy.ts ini
export const config = {
  matcher: [
    // Terapkan perlindungan ini ke SEMUA path, KECUALI aset statis & gambar Next.js
    // agar gambar lambang dan CSS/JS bawaan tidak melambat
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:css|js|png|jpg|jpeg|gif|webp|svg|ico)$).*)",
  ],
};
