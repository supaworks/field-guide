# 🚀 Bun + OpenAI SDK + SUPA

A beginner-friendly example showing how to use the OpenAI SDK with [SUPA](https://supa.works) as your AI backend.

## 📖 What is this?

This project demonstrates how to:

- Use the **OpenAI SDK** (the official library from OpenAI) to talk to AI models
- Connect to **SUPA** instead of OpenAI's servers
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

More examples:

```bash
bun run examples/conversation.ts
bun run examples/streaming.ts
bun run examples/system-messages.ts
```

## 🔑 Important Concepts

### Environment Variables

We store the API token in a `.env` file instead of putting it directly in the code. This is important because:

1. **Security**: You don't want to accidentally share your secret token when sharing code
2. **Flexibility**: You can use different tokens for development and production
3. **Best Practice**: It's the industry-standard way to handle sensitive configuration

### The `baseURL` Setting

When we create the OpenAI client, we set `baseURL: "https://api.supa.works/openai"`. This tells the SDK to send requests to SUPA instead of OpenAI's servers. SUPA's API is compatible with OpenAI's format, so everything works seamlessly!

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

- [SUPA Documentation](https://docs.supa.works)
- [OpenAI SDK Documentation](https://platform.openai.com/docs)
- [Bun Documentation](https://bun.sh/docs)

---

Happy coding! 🎉 If you have questions, feel free to open an issue in this repository.
