
/**
 * Utility to get the best possible client IP address from request headers.
 * Checks multiple standard proxy headers and handles local loopback addresses.
 */
export function getClientIp(headerList: Headers): string {
  const xForwardedFor = headerList.get("x-forwarded-for");
  
  if (xForwardedFor) {
    // x-forwarded-for can be a comma-separated list of IPs. 
    // The first one is the original client IP.
    const ips = xForwardedFor.split(",").map(ip => ip.trim());
    if (ips[0]) return formatIp(ips[0]);
  }

  const xRealIp = headerList.get("x-real-ip");
  if (xRealIp) return formatIp(xRealIp);

  const cfConnectingIp = headerList.get("cf-connecting-ip");
  if (cfConnectingIp) return formatIp(cfConnectingIp);

  return "unknown";
}

/**
 * Formats the IP address, converting IPv6 loopback to IPv4 for consistency
 */
function formatIp(ip: string): string {
  if (ip === "::1") return "127.0.0.1";
  // Remove IPv6 prefix from mapped IPv4 addresses (e.g., ::ffff:127.0.0.1)
  if (ip.startsWith("::ffff:")) return ip.substring(7);
  return ip;
}
