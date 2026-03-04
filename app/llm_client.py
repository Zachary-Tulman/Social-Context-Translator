from langchain_anthropic import ChatAnthropic
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from dotenv import load_dotenv
import os

load_dotenv()

llm = ChatAnthropic(model_name="claude-sonnet-4-6", timeout=60, stop=[])
embed = HuggingFaceEmbeddings()
db = Chroma(persist_directory="vectorstore/", embedding_function=embed).as_retriever()

def __get_system_prompt(message: str) -> str:
    system_prompt = str(os.getenv("SYSTEM_PROMPT"))
    chunks = db.invoke(message)
    for chunk in chunks:
        system_prompt += "\n"
        system_prompt += chunk.page_content
    
    return system_prompt

def chat(message: str, conversation_history: list) -> str:
    conversation_history.append(HumanMessage(content=message))

    system_prompt = __get_system_prompt(message)

    messages = [SystemMessage(system_prompt)] + conversation_history

    response = llm.invoke(messages)

    conversation_history.append(AIMessage(content=response.content))

    if not isinstance(response.content, str):
        return ""
    return response.content