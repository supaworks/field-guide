import streamlit as st
from openai import OpenAI

# Page configuration
st.set_page_config(page_title="SUPA Chat", page_icon="💬")
st.title("💬 SUPA Chat")

# Check if API token is configured
if "SUPA_API_TOKEN" not in st.secrets:
    st.error("⚠️ SUPA API token not configured. Please add it to `.streamlit/secrets.toml`")
    st.stop()

# Initialize the OpenAI client with SUPA endpoint
client = OpenAI(
    api_key=st.secrets["SUPA_API_TOKEN"],
    base_url="https://api.supa.works/openai",
)

# Initialize chat history in session state
if "messages" not in st.session_state:
    st.session_state.messages = []

# Display chat messages from history
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

# Accept user input
if prompt := st.chat_input("What would you like to talk about?"):
    # Add user message to chat history
    st.session_state.messages.append({"role": "user", "content": prompt})

    # Display user message in chat message container
    with st.chat_message("user"):
        st.markdown(prompt)

    # Display assistant response in chat message container
    with st.chat_message("assistant"):
        # Create streaming response from SUPA
        stream = client.chat.completions.create(
            model="qwen3:0.6b",
            messages=[
                {"role": m["role"], "content": m["content"]}
                for m in st.session_state.messages
            ],
            stream=True,
        )
        # Stream the response
        response = st.write_stream(
            chunk.choices[0].delta.content
            for chunk in stream
            if chunk.choices[0].delta.content
        )

    # Add assistant response to chat history
    st.session_state.messages.append({"role": "assistant", "content": response})
