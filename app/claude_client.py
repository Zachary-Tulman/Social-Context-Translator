import anthropic
from dotenv import load_dotenv

load_dotenv()

client = anthropic.Anthropic()

def chat(message: str, conversation_history: list) -> str:
    conversation_history.append({"role": "user", "content": message})

    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        system="You are a social context translator. You help users understand the unspoken social dynamics behind interactions they experienced.",
        messages=conversation_history
    )

    assistant_message = ""
    response_block = response.content[0]
    if(isinstance(response_block, anthropic.types.TextBlock)):
        assistant_message = response_block.text

    conversation_history.append({"role": "assistant", "content": assistant_message})

    return assistant_message