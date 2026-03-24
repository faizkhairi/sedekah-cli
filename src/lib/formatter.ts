import type { Institution } from "../types.js";

/** Truncate a string to maxLen, appending ellipsis if needed. */
function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen - 1) + "…";
}

/** Pad a string to exactly width using spaces. */
function pad(str: string, width: number): string {
  return str.padEnd(width, " ");
}

/** Bold ANSI escape. */
const BOLD = "\x1b[1m";
const RESET = "\x1b[0m";
const DIM = "\x1b[2m";
const CYAN = "\x1b[36m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";

function bold(s: string): string {
  return `${BOLD}${s}${RESET}`;
}

function dim(s: string): string {
  return `${DIM}${s}${RESET}`;
}

function cyan(s: string): string {
  return `${CYAN}${s}${RESET}`;
}

function green(s: string): string {
  return `${GREEN}${s}${RESET}`;
}

function yellow(s: string): string {
  return `${YELLOW}${s}${RESET}`;
}

/** Determine the usable terminal width (capped to sane max). */
function termWidth(): number {
  return Math.min(process.stdout.columns ?? 120, 140);
}

/** Format a single institution for the detail view (random / info). */
export function formatDetail(inst: Institution): string {
  const lines: string[] = [];

  lines.push("");
  lines.push(bold(`  ${inst.name}`));
  lines.push("");
  lines.push(`  ${dim("Category :")} ${cyan(inst.category)}`);
  lines.push(`  ${dim("State    :")} ${inst.state}`);
  lines.push(`  ${dim("City     :")} ${inst.city}`);

  if (inst.supportedPayment && inst.supportedPayment.length > 0) {
    lines.push(
      `  ${dim("Payments :")} ${green(inst.supportedPayment.join(", "))}`,
    );
  }

  const preview = inst.qrContent
    ? truncate(inst.qrContent, 72)
    : dim("(none)");
  lines.push(`  ${dim("QR URL   :")} ${yellow(preview)}`);
  lines.push("");

  return lines.join("\n");
}

/** Format a list of institutions as a table. */
export function formatTable(institutions: Institution[]): string {
  if (institutions.length === 0) {
    return dim("  No results found.\n");
  }

  const width = termWidth();

  // Column width budget: #(3) | Name | Category(12) | State | City(12) | Payments
  const fixedCols = 3 + 3 + 12 + 3 + 16 + 3 + 14 + 3 + 20; // separators included
  const nameWidth = Math.max(20, width - fixedCols);

  const COL_NUM = 3;
  const COL_NAME = nameWidth;
  const COL_CAT = 12;
  const COL_STATE = 16;
  const COL_CITY = 14;
  const COL_PAY = 20;

  const sep = dim(" | ");

  function row(
    num: string,
    name: string,
    cat: string,
    state: string,
    city: string,
    pay: string,
    header = false,
  ): string {
    const fn = header ? bold : (s: string) => s;
    return [
      fn(pad(num, COL_NUM)),
      fn(pad(truncate(name, COL_NAME), COL_NAME)),
      fn(pad(truncate(cat, COL_CAT), COL_CAT)),
      fn(pad(truncate(state, COL_STATE), COL_STATE)),
      fn(pad(truncate(city, COL_CITY), COL_CITY)),
      fn(pad(truncate(pay, COL_PAY), COL_PAY)),
    ].join(sep);
  }

  const header = row("#", "Name", "Category", "State", "City", "Payments", true);
  const divider = dim("─".repeat(Math.min(width, COL_NUM + COL_NAME + COL_CAT + COL_STATE + COL_CITY + COL_PAY + 5 * 3)));

  const rows = institutions.map((inst, i) => {
    const payments =
      inst.supportedPayment?.length > 0
        ? inst.supportedPayment.join(", ")
        : "-";
    return row(
      String(i + 1),
      inst.name,
      inst.category,
      inst.state,
      inst.city,
      payments,
    );
  });

  return ["", header, divider, ...rows, ""].join("\n");
}

/** Print page info footer. */
export function formatPageInfo(
  page: number,
  limit: number,
  total: number,
): string {
  return dim(`  Page ${page} · ${total} total result${total === 1 ? "" : "s"} (limit ${limit})\n`);
}
