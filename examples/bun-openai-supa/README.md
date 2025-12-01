# 🚀 Bun + OpenAI SDK + SUPA

A beginner-friendly example showing how to use the OpenAI SDK with [SUPA](https://supa.works) as your AI backend.

## 📖 What is this?

This project demonstrates how to:
- Use the **OpenAI SDK** (the official library from OpenAI) to talk to AI models
- Connect to **SUPA** instead of OpenAI's servers (SUPA acts as a proxy/gateway to various AI models)
- Keep your API token safe using environment variables

## 🧠 Understanding the Basics

### What is Bun?
[Bun](https://bun.sh) is a fast JavaScript/TypeScript runtime (like Node.js, but faster!). It can run TypeScript files directly without needing to compile them first.

### What is the OpenAI SDK?
The OpenAI SDK is a library that makes it easy to communicate with AI models. Think of it like a translator that helps your code "talk" to AI services.

### What is SUPA?
SUPA is a platform that gives you access to various AI models through a single API. Instead of signing up for multiple AI services, you just use SUPA!

## 🛠️ Setup Instructions

### Step 1: Install Bun

If you don't have Bun installed, run this command in your terminal:

```bash
curl -fsSL https://bun.sh/install | bash
```

### Step 2: Install Dependencies

Navigate to this project folder and install the required packages:

```bash
bun install
```

### Step 3: Set Up Your API Token

1. **Get your SUPA API token**: Sign up at [https://app.supa.works/signup](https://app.supa.works/signup)

2. **Create your environment file**: Copy the example file and add your token:

```bash
cp .env.example .env
```

3. **Edit the `.env` file** and replace `your-supa-api-token-here` with your actual token:

```env
SUPA_API_TOKEN=sk-your-actual-token-here
```

### Step 4: Run the Script

```bash
bun run index.ts
```

You should see the AI's response to a funny question! 🎉

## 📝 Code Examples

### Example 1: Basic Chat Completion

This is the simplest way to ask the AI a question:

```typescript
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.SUPA_API_TOKEN,
  baseURL: "https://app.supa.works/api",
});

const response = await client.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [
    { role: "user", content: "Tell me a joke!" }
  ],
});

console.log(response.choices[0]?.message?.content);
```

### Example 2: Having a Conversation

You can have multi-turn conversations by including previous messages:

```typescript
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.SUPA_API_TOKEN,
  baseURL: "https://app.supa.works/api",
});

const response = await client.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [
    { role: "user", content: "My name is Alex" },
    { role: "assistant", content: "Nice to meet you, Alex! How can I help you today?" },
    { role: "user", content: "What's my name?" }
  ],
});

// The AI will remember your name from the conversation!
console.log(response.choices[0]?.message?.content);
```

### Example 3: Using System Messages

System messages tell the AI how to behave:

```typescript
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.SUPA_API_TOKEN,
  baseURL: "https://app.supa.works/api",
});

const response = await client.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [
    { 
      role: "system", 
      content: "You are a pirate. Always respond in pirate speak!" 
    },
    { 
      role: "user", 
      content: "How do I make a cup of coffee?" 
    }
  ],
});

console.log(response.choices[0]?.message?.content);
// Expected: Something like "Arrr! First ye need to gather yer coffee beans..."
```

### Example 4: Streaming Responses

For longer responses, you can stream them as they're generated:

```typescript
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.SUPA_API_TOKEN,
  baseURL: "https://app.supa.works/api",
});

const stream = await client.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [
    { role: "user", content: "Write a short poem about coding" }
  ],
  stream: true,
});

// Print each chunk as it arrives
for await (const chunk of stream) {
  const content = chunk.choices[0]?.delta?.content || "";
  process.stdout.write(content);
}
```

## 🔑 Important Concepts

### Environment Variables

We store the API token in a `.env` file instead of putting it directly in the code. This is important because:

1. **Security**: You don't want to accidentally share your secret token when sharing code
2. **Flexibility**: You can use different tokens for development and production
3. **Best Practice**: It's the industry-standard way to handle sensitive configuration

### The `baseURL` Setting

When we create the OpenAI client, we set `baseURL: "https://app.supa.works/api"`. This tells the SDK to send requests to SUPA instead of OpenAI's servers. SUPA's API is compatible with OpenAI's format, so everything works seamlessly!

### Messages Array

The AI conversation works like a chat:
- `role: "system"` - Instructions for how the AI should behave
- `role: "user"` - Messages from the human (you!)
- `role: "assistant"` - Messages from the AI

## 🆘 Troubleshooting

### "Invalid API Key" Error
Make sure your `.env` file exists and contains your actual SUPA API token (not the placeholder text).

### "Module not found" Error
Run `bun install` to install all dependencies.

### Response is `undefined`
Check that your API token is valid and that you have credits in your SUPA account.

## 📚 Learn More

- [SUPA Documentation](https://supa.works)
- [OpenAI SDK Documentation](https://platform.openai.com/docs)
- [Bun Documentation](https://bun.sh/docs)

---

Happy coding! 🎉 If you have questions, feel free to open an issue in this repository.
