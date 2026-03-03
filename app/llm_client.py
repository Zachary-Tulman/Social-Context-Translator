from langchain_anthropic import ChatAnthropic
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from dotenv import load_dotenv
import os

load_dotenv()

llm = ChatAnthropic(model_name="claude-sonnet-4-6", timeout=60, stop=[])

def chat(message: str, conversation_history: list) -> str:
    conversation_history.append(HumanMessage(content=message))

    messages = [SystemMessage(content=os.getenv("SYSTEM_PROMPT"))] + conversation_history

    response = llm.invoke(messages)

    conversation_history.append(AIMessage(content=response.content))

    if not isinstance(response.content, str):
        return ""
    return response.content