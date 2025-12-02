import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.SUPA_API_TOKEN,
  baseURL: "https://api.supa.works/openai",
});

const response = await client.chat.completions.create({
  model: "qwen3:0.6b",
  messages: [
    { role: "user", content: "My name is Alex" },
    {
      role: "assistant",
      content: "Nice to meet you, Alex! How can I help you today?",
    },
    { role: "user", content: "What's my name?" },
  ],
});

// The AI will remember your name from the conversation!
console.log(response.choices[0]?.message?.content);
