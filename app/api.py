from app.llm_client import chat
from fastapi import FastAPI
from pydantic import BaseModel
from langchain_core.messages import HumanMessage, AIMessage

api = FastAPI()

class ChatRequest(BaseModel):
    message: str
    conversation_history: list

@api.post("/chat")
def chat_endpoint(request: ChatRequest):
    return {"response": chat(
        message=request.message, 
        conversation_history=__json_history_to_langchain(history=request.conversation_history)
    )}

def __json_history_to_langchain(history: list) -> list:
    langchain_history = []

    for message in history:
        if message["role"] == "human":
            langchain_history.append(HumanMessage(content=message["content"]))
        elif message["role"] == "ai":
            langchain_history.append(AIMessage(content=message["content"]))

    return langchain_history