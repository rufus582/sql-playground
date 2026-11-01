<p align="center">
  <img alt="header" src="https://shieldcn.dev/header/dots.svg?title=SQL+Playground&amp;subtitle=Import+JSON%2C+CSV+or+Parquet+files+and+query+them+with+SQL%2C+right+in+your+browser%21%0A&amp;logo=https%3A%2F%2Fraw.githubusercontent.com%2Frufus582%2Fsql-playground%2Frefs%2Fheads%2Fmaster%2Fpublic%2Flogo.svg&amp;size=wide&amp;mode=dark" />
</p>

<p align="center">
  <a href="https://sql.rufus582.dev/"><img alt="Check it out" src="https://shieldcn.dev/badge/Check_it_out-f0b100.svg?logo=lu%3AExternalLink" /></a>
  <a href="https://github.com/rufus582/sql-playground"><img alt="stars" src="https://shieldcn.dev/github/rufus582/sql-playground/stars.svg?variant=secondary" /></a>
</p>

## Overview

SQL Playground lets you load data files into an in-browser database and query them with SQL. It started as the SQL Playground tool in [Dev-Utils.](https://github.com/rufus582/dev-utils) and now lives on as its own app.

The databases run entirely in your browser via WebAssembly, so your data never leaves your machine.

- **Two database engines**: switch between [DuckDB](https://duckdb.org/) and [SQLite](https://sqlite.org/) from the toolbar
- **Import tables** from JSON or Parquet files
- **Run all or run selected**: execute the whole script or only the highlighted query
- **Show tables** to see what's loaded in the current database
- **Tabbed results**: each query's output appears in its own result tab

## Tech Stack

[![Tanstack Start](https://shieldcn.dev/badge/Tanstack%20Start.svg?variant=branded&font=fira-code&logo=tanstack)](https://tanstack.com/start/latest)
[![React](https://shieldcn.dev/badge/React.svg?variant=branded&font=fira-code&logo=react)](https://react.dev/)
[![Tailwind CSS](https://shieldcn.dev/badge/Tailwind%20CSS.svg?variant=branded&font=fira-code&logo=tailwindcss)](https://tailwindcss.com/)
[![DuckDB](https://shieldcn.dev/badge/DuckDB.svg?variant=branded&font=fira-code&logo=duckdb)](https://duckdb.org/docs/api/wasm/overview)
[![SQLite](https://shieldcn.dev/badge/SQLite.svg?variant=branded&font=fira-code&logo=sqlite)](https://sql.js.org/)
[![Cloudflare Workers](https://shieldcn.dev/badge/Cloudflare%20Workers.svg?variant=branded&font=fira-code&logo=cloudflare)](https://workers.cloudflare.com/)
[![Vite](https://shieldcn.dev/badge/Vite.svg?variant=branded&font=fira-code&logo=vite)](https://vite.dev/)

## Getting Started

To get a local copy of this project running, follow the steps below.

### Prerequisites

You need to have [![Bun](https://shieldcn.dev/badge/Bun.svg?variant=branded&size=xs&logo=bun)](https://bun.sh) installed. For macOS with [![Homebrew](https://shieldcn.dev/badge/Homebrew.svg?variant=branded&size=xs&logo=homebrew)](https://brew.sh/), run the command below:

```sh
brew install oven-sh/bun/bun
```

For other platforms and more details, see the [official installation guide](https://bun.sh/docs/installation).

### Installation

1. Clone the repo

   ```sh
   git clone https://github.com/rufus582/sql-playground.git
   ```

2. Install dependencies (this also copies the SQLite WASM files into `public/`)

   ```sh
   bun install
   ```

3. Run the dev server

   ```sh
   bun run dev
   ```

4. Visit http://localhost:3000 in your browser to use the app

## Contributing

I am not currently accepting direct contributions.

If you'd like to help:

- Open an issue for bugs or feature requests.
- If you already have a proposed solution, include it in the issue.
- If the proposal looks like a good fit, I may ask you to submit a pull request.
- We'll take it from there.

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

## Contact

[![Email](https://shieldcn.dev/badge/hi@rufus582.dev.svg?variant=secondary&logo=lu%3AMail)](mailto:hi@rufus582.dev)
[![X](https://shieldcn.dev/badge/rufus582.svg?variant=branded&logo=x)](https://x.com/rufus582)
[![LinkedIn](https://shieldcn.dev/badge/rufus582-0A66C2.svg?logo=ri%3ABsLinkedin)](https://linkedin.com/in/rufus582)
[![Website](https://shieldcn.dev/badge/rufus582.dev.svg?variant=branded&theme=emerald&logo=lu%3AGlobe)](https://rufus582.dev)
