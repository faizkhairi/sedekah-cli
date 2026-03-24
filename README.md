# sedekah-cli

A terminal CLI for browsing Malaysian mosque and surau QR codes via [sedekah.je](https://sedekah.je).

## Installation

```bash
npm install -g sedekah-cli
```

Or run directly without installing:

```bash
npx sedekah-cli search --state Selangor
```

## Commands

### `sedekah search [query]`

Search institutions by name, state, or category.

```bash
sedekah search masjid
sedekah search --state Selangor
sedekah search --category surau --state "W.P. Kuala Lumpur"
sedekah search --limit 20 --page 2
sedekah search --json  # machine-readable output
```

Options:

| Flag | Description | Default |
|------|-------------|---------|
| `-s, --state <state>` | Filter by Malaysian state (case-insensitive) | - |
| `-c, --category <category>` | Filter by category | - |
| `-l, --limit <n>` | Results per page (max 50) | 10 |
| `-p, --page <n>` | Page number | 1 |
| `--json` | Output raw JSON | - |

**Valid categories:** `masjid`, `surau`, `tahfiz`, `kebajikan`, `lain-lain`

**Valid states:** Johor, Kedah, Kelantan, Melaka, Negeri Sembilan, Pahang, Perak, Perlis, Pulau Pinang, Sabah, Sarawak, Selangor, Terengganu, W.P. Kuala Lumpur, W.P. Labuan, W.P. Putrajaya

### `sedekah random`

Display a random Malaysian institution.

```bash
sedekah random
sedekah random --json
```

### `sedekah qr <name>`

Render the DuitNow QR code of an institution directly in your terminal.

```bash
sedekah qr "Masjid Negara"
sedekah qr "surau al-falah"
```

## Development

```bash
git clone https://github.com/faizkhairi/sedekah-cli
cd sedekah-cli
npm install
npm run dev -- search --state Selangor
npm run build
```

## License

MIT
