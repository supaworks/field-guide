import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.SUPA_API_TOKEN,
  baseURL: "https://api.supa.works/openai",
});

const response = await client.chat.completions.create({
  model: "qwen3:0.6b",
  messages: [
    {
      role: "system",
      content: "You are a pirate. Always respond in pirate speak!",
    },
    {
      role: "user",
      content: "How do I make a cup of coffee?",
    },
  ],
});

console.log(response.choices[0]?.message?.content);
// Expected: Something like "Arrr! First ye need to gather yer coffee beans..."
