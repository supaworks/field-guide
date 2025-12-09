# Natural Language GIS

A SvelteKit application that allows users to query a PostGIS database using natural language. It uses an LLM (via SUPA) to translate natural language questions into SQL queries.

## Prerequisites

- [Docker](https://www.docker.com/) (for the PostGIS database)
- [Bun](https://bun.sh/) (JavaScript runtime)

## Getting Started

### 1. Environment Setup

Copy the example environment file and configure your API token:

```bash
cp .env.example .env
```

Open `.env` and set your `SUPA_API_TOKEN`.

### 2. Start the Database

Start the PostGIS database using Docker Compose:

```bash
docker compose up -d
```

### 3. Install Dependencies

```bash
bun install
```

### 4. Seed the Database

Import the shapefiles from the `data/` directory into the database:

```bash
bun run scripts/seed.ts
```

### 5. Generate Schema Context

Scan the database to generate the schema context for the AI:

```bash
bun run scripts/generate_context.ts
```

### 6. Run the Application

Start the development server:

```bash
bun run dev
```

Open your browser and navigate to `http://localhost:5173`.

## Development with Dev Containers

This project includes a Dev Container configuration. If you have the "Dev Containers" extension installed in VS Code, you can simply open this folder (`examples/natural-language-gis`) and click "Reopen in Container". This will automatically set up the environment, database, and tools for you.
