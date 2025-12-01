import OpenAI from "openai";

// Initialize the OpenAI client with SUPA endpoint
const client = new OpenAI({
  apiKey: process.env.SUPA_API_TOKEN,
  baseURL: "https://app.supa.works/api",
});

async function askFunnyQuestion() {
  console.log("🤖 Asking the AI a funny question...\n");

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content:
          "Why do programmers prefer dark mode? Give me a funny and creative answer!",
      },
    ],
  });

  console.log("📝 AI Response:");
  console.log(response.choices[0]?.message?.content);
}

// Run the main function
askFunnyQuestion().catch(console.error);