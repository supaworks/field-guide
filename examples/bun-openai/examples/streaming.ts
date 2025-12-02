import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.SUPA_API_TOKEN,
  baseURL: "https://api.supa.works/openai",
});

const stream = await client.chat.completions.create({
  model: "qwen3:0.6b",
  messages: [{ role: "user", content: "Write a short poem about coding" }],
  stream: true,
});

// Print each chunk as it arrives
for await (const chunk of stream) {
  const content = chunk.choices[0]?.delta?.content || "";
  process.stdout.write(content);
}
