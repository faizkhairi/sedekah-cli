import type { Command } from "commander";
import { listInstitutions } from "../lib/api.js";
import { formatTable, formatPageInfo } from "../lib/formatter.js";
import { normaliseState, normaliseCategory, VALID_STATES, VALID_CATEGORIES } from "../types.js";

export function registerSearch(program: Command): void {
  program
    .command("search [query]")
    .description("Search institutions by name, state, or category")
    .option("-s, --state <state>", "filter by Malaysian state (case-insensitive)")
    .option(
      "-c, --category <category>",
      `filter by category (${VALID_CATEGORIES.join(", ")})`,
    )
    .option("-l, --limit <n>", "results per page (default 10, max 50)", "10")
    .option("-p, --page <n>", "page number (default 1)", "1")
    .option("--json", "output raw JSON")
    .action(async (query: string | undefined, opts: Record<string, string | boolean | undefined>) => {
      const limit = Math.min(50, Math.max(1, parseInt(String(opts["limit"] ?? "10"), 10)));
      const page = Math.max(1, parseInt(String(opts["page"] ?? "1"), 10));

      // Validate + normalise state
      let state: string | undefined;
      if (opts["state"]) {
        const normalised = normaliseState(String(opts["state"]));
        if (normalised === null) {
          console.error(
            `Error: unknown state "${opts["state"]}". Valid states:\n  ${VALID_STATES.join("\n  ")}`,
          );
          process.exit(1);
        }
        state = normalised;
      }

      // Validate + normalise category
      let category: string | undefined;
      if (opts["category"]) {
        const normalised = normaliseCategory(String(opts["category"]));
        if (normalised === null) {
          console.error(
            `Error: unknown category "${opts["category"]}". Valid categories: ${VALID_CATEGORIES.join(", ")}`,
          );
          process.exit(1);
        }
        category = normalised;
      }

      try {
        const result = await listInstitutions({
          search: query,
          state,
          category,
          limit,
          page,
        });

        const institutions = result.institutions ?? [];

        if (opts["json"]) {
          console.log(JSON.stringify(result, null, 2));
          return;
        }

        process.stdout.write(formatTable(institutions));
        process.stdout.write(
          formatPageInfo(result.pagination.page, result.pagination.limit, result.pagination.total),
        );
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error(`Error: ${msg}`);
        process.exit(1);
      }
    });
}
