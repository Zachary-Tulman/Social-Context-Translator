from langchain_anthropic import ChatAnthropic
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from sentence_transformers import CrossEncoder
from dotenv import load_dotenv
import os

load_dotenv()

llm = ChatAnthropic(model_name="claude-sonnet-4-6", timeout=60, stop=[])
embed = HuggingFaceEmbeddings()
cross_encoder = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")
db = Chroma(persist_directory="vectorstore/",
            embedding_function=embed).as_retriever(search_kwargs={"k": 15})

def __get_system_prompt(message: str) -> str:
    system_prompt = os.getenv("SYSTEM_PROMPT", default="")
    if system_prompt == "":
        raise ValueError("WARNING: No system prompt detected! \
                         This program cannot run with no instructions. \
                         Is your .env set up properly?")
    
    chunks = db.invoke(message)

    scores = cross_encoder.predict([(message, chunk.page_content) for chunk in chunks])

    # Create a list of (score, chunk)
    #   Sort that list by score DESC
    reranked_chunks = sorted(zip(scores.tolist(), chunks),
                             key=lambda x: x[0], reverse=True)

    for i in range(min(5, len(reranked_chunks))):
        system_prompt += '\n'
        system_prompt += reranked_chunks[i][1].page_content
    
    return system_prompt

def chat(message: str, conversation_history: list) -> str:
    conversation_history.append(HumanMessage(content=message))
    # RAG
    system_prompt = __get_system_prompt(message)
    messages = [SystemMessage(system_prompt)] + conversation_history

    response = llm.invoke(messages)
    conversation_history.append(AIMessage(content=response.content))

    if not isinstance(response.content, str):
        # TODO: when does this happen? what consequences does returning an empty string ignore?
        return ""
    return response.content
