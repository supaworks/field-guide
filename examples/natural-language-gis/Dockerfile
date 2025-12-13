FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy source
COPY . .

# Generate SvelteKit files
RUN bun run prepare

# Build the application
ENV DATABASE_URL="postgres://dummy:dummy@localhost:5432/dummy"
ENV SUPA_API_TOKEN="dummy"
RUN bun run build

# Expose the port
EXPOSE 3000

# Start the application
CMD ["bun", "run", "build/index.js"]
