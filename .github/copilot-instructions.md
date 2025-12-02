# Field Guide - AI Instructions

This repository houses examples and field tests for [SUPA](https://supa.works).

## 🏗 Architecture & Structure

- **Monorepo-style Examples**: The `examples/` directory contains standalone projects (e.g., `bun-openai`).
- **Independence**: Each example folder typically manages its own dependencies (`package.json`) and configuration (`tsconfig.json`, `.env`).
- **Runtime**: Every example can have its own runtime. It could be Node, Bun or even Python.

## 🛠 Development Workflow

- **Environment**:
  - Copy `.env.example` to `.env`.
  - Set `SUPA_API_TOKEN` (required for all SUPA interactions).

## 🔌 SUPA Integration Patterns

The core pattern is using the standard OpenAI SDK but directing it to SUPA's endpoints.

### Client Initialization

Always override the `baseURL` to point to SUPA.

```typescript
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.SUPA_API_TOKEN,
  baseURL: "https://api.supa.works/openai", // Critical: Point to SUPA
});
```

### Model Selection

Use SUPA-supported model identifiers.

- Examples seen: `qwen3:0.6b`.

## 📝 Conventions

- **Easy to understand** The code should be easy to understand. Don't use heavy abstraction or other advanced patterns. Keep it simple.
- **Documentation** Always create extensive READMEs and use inline comments. The main goal is for other developers to be able to pick up the examples and start working with them.
