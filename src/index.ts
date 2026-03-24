#!/usr/bin/env node
import { program } from "commander";
import { registerSearch } from "./commands/search.js";
import { registerRandom } from "./commands/random.js";
import { registerQr } from "./commands/qr.js";

program
  .name("sedekah")
  .description("Browse Malaysian mosque and surau QR codes via sedekah.je")
  .version("0.1.0");

registerSearch(program);
registerRandom(program);
registerQr(program);

program.parse(process.argv);
