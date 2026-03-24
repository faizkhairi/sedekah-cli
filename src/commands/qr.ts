import type { Command } from "commander";
import qrcode from "qrcode-terminal";
import { listInstitutions } from "../lib/api.js";
import { formatDetail } from "../lib/formatter.js";

export function registerQr(program: Command): void {
  program
    .command("qr <name>")
    .description("Render the QR code of an institution in the terminal")
    .action(async (name: string) => {
      try {
        const result = await listInstitutions({ search: name, limit: 1, page: 1 });
        const institutions = result.institutions ?? [];

        if (institutions.length === 0) {
          console.error(`No institution found matching "${name}".`);
          process.exit(1);
        }

        const inst = institutions[0]!;

        if (!inst.qrContent) {
          console.error(
            `Institution "${inst.name}" has no QR content available.`,
          );
          process.exit(1);
        }

        // Print institution details first
        process.stdout.write(formatDetail(inst));

        // Render QR code in terminal
        qrcode.generate(inst.qrContent, { small: true }, (qr) => {
          console.log(qr);
        });
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error(`Error: ${msg}`);
        process.exit(1);
      }
    });
}
