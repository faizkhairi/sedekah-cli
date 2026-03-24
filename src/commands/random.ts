import type { Command } from "commander";
import { randomInstitution } from "../lib/api.js";
import { formatDetail } from "../lib/formatter.js";

export function registerRandom(program: Command): void {
  program
    .command("random")
    .description("Display a random Malaysian institution")
    .option("--json", "output raw JSON")
    .action(async (opts: { json?: boolean }) => {
      try {
        const inst = await randomInstitution();

        if (opts.json) {
          console.log(JSON.stringify(inst, null, 2));
          return;
        }

        process.stdout.write(formatDetail(inst));
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error(`Error: ${msg}`);
        process.exit(1);
      }
    });
}
