FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Install system dependencies for downloading and unzipping
RUN apt-get update && apt-get install -y curl unzip

# Download and unzip data
RUN mkdir -p data && \
    curl -L -o data/dataset.zip https://geodaten.leipzig.de/open_data/organisationseinheit/Amt_fuer_Geoinformation_und_Bodenordnung/Stadtgrundkarte/Shapefile/DSGK2025mH_SHP25833_7837_NON_TILED.zip && \
    unzip data/dataset.zip -d data && \
    rm data/dataset.zip

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
