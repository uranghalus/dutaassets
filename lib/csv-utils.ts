/**
 * Simple CSV Utility for JSON-to-CSV and CSV-to-JSON conversion.
 * Designed to be lightweight and handle basic data structures.
 */

export function jsonToCsv(data: any[], headers: { label: string; key: string }[]): string {
  if (!data || data.length === 0) return "";

  const headerRow = headers.map((h) => `"${h.label}"`).join(",");
  const bodyRows = data.map((row) => {
    return headers
      .map((h) => {
        const val = h.key.split(".").reduce((obj, k) => obj?.[k], row);
        const stringVal = val === null || val === undefined ? "" : String(val);
        // Escape quotes and wrap in quotes
        return `"${stringVal.replace(/"/g, '""')}"`;
      })
      .join(",");
  });

  return [headerRow, ...bodyRows].join("\n");
}

export function csvToJson(csv: string): any[] {
  const lines = csv.split(/\r?\n/).filter((line) => line.trim() !== "");
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map((h) => h.replace(/^"|"$/g, "").trim());
  const data = lines.slice(1).map((line) => {
    // Basic CSV split, doesn't handle nested commas in quotes perfectly but good for simple cases
    // For production, we'd use a regex or a library
    const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map((v) => 
      v.replace(/^"|"$/g, "").replace(/""/g, '"').trim()
    );
    
    const obj: any = {};
    headers.forEach((h, i) => {
      obj[h] = values[i] || "";
    });
    return obj;
  });

  return data;
}

/**
 * Trigger browser download of a CSV file
 */
export function downloadCsv(csvContent: string, fileName: string) {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
