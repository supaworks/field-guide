# 💬 Streamlit + SUPA Chat

A beginner-friendly example showing how to build a simple chat application using [Streamlit](https://streamlit.io) and [SUPA](https://supa.works) as your AI backend.

## 📖 What is this?

This project demonstrates how to:

- Build a **chat interface** using Streamlit's chat components
- Use the **OpenAI SDK** to communicate with AI models
- Connect to **SUPA** instead of OpenAI's servers
- Handle **streaming responses** for a real-time chat experience

## 🧠 Understanding the Basics

### What is Streamlit?

[Streamlit](https://streamlit.io) is a Python library that makes it easy to create web applications for data science and AI projects. With just a few lines of Python, you can create interactive UIs without knowing HTML, CSS, or JavaScript!

### What is the OpenAI SDK?

The OpenAI SDK is a library that makes it easy to communicate with AI models. Think of it like a translator that helps your code "talk" to AI services.

### What is SUPA?

SUPA is a platform that gives you access to various AI models through a single API. Instead of signing up for multiple AI services, you just use SUPA!

## 🛠️ Setup Instructions

### Step 1: Install Python

Make sure you have Python 3.8 or higher installed. Check your version:

```bash
python --version
```

### Step 2: Create a Virtual Environment (Recommended)

```bash
# Create a virtual environment
python -m venv venv

# Activate it (Linux/Mac)
source venv/bin/activate

# Activate it (Windows)
venv\Scripts\activate
```

### Step 3: Install Dependencies

```bash
pip install -r requirements.txt
```

### Step 4: Set Up Your API Token

1. **Get your SUPA API token**: Sign up at [https://app.supa.works/signup](https://app.supa.works/signup)

2. **Create a Streamlit secrets file**:

```bash
mkdir -p .streamlit
echo 'SUPA_API_TOKEN = "your-supa-api-token-here"' > .streamlit/secrets.toml
```

3. **Edit the secrets file** and replace `your-supa-api-token-here` with your actual token.

### Step 5: Run the App

```bash
streamlit run app.py
```

Your browser should automatically open to `http://localhost:8501` with the chat interface! 🎉

## 🔑 Important Concepts

### Session State

Streamlit apps re-run from top to bottom on every user interaction. To persist the chat history across interactions, we use `st.session_state`:

```python
if "messages" not in st.session_state:
    st.session_state.messages = []
```

### Chat Components

Streamlit provides special components for building chat interfaces:

- `st.chat_message()` - Creates a chat message container with an avatar
- `st.chat_input()` - Creates a text input that looks like a chat prompt

### Streaming Responses

Instead of waiting for the entire response, we stream it word-by-word for a better user experience:

```python
stream = client.chat.completions.create(
    model="qwen3:0.6b",
    messages=[...],
    stream=True,
)
response = st.write_stream(chunk.choices[0].delta.content for chunk in stream)
```

### The `base_url` Setting

When we create the OpenAI client, we set `base_url="https://api.supa.works/openai"`. This tells the SDK to send requests to SUPA instead of OpenAI's servers. SUPA's API is compatible with OpenAI's format, so everything works seamlessly!

### Messages Array

The AI conversation works like a chat:

- `role: "system"` - Instructions for how the AI should behave
- `role: "user"` - Messages from the human (you!)
- `role: "assistant"` - Messages from the AI

## 🆘 Troubleshooting

### "Invalid API Key" Error

Make sure your `.streamlit/secrets.toml` file exists and contains your actual SUPA API token.

### "Module not found" Error

Run `pip install -r requirements.txt` to install all dependencies.

### Blank responses

Check that your API token is valid and that you have credits in your SUPA account.

### Port already in use

If port 8501 is already in use, you can specify a different port:

```bash
streamlit run app.py --server.port 8502
```

## 📚 Learn More

- [SUPA Documentation](https://docs.supa.works)
- [Streamlit Documentation](https://docs.streamlit.io)
- [OpenAI SDK Documentation](https://platform.openai.com/docs)

---

Happy coding! 🎉 If you have questions, feel free to open an issue in this repository.
