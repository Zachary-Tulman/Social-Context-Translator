# Social Context Translator

The Social Context Translator is a chat-based web app designed to guide users through social situations they experienced and clarify them, providing social context and suggestions for the future.

### How it works
SCT uses LangChain with a RAG pipeline to provide responses tailored to each user's situation:
1) The user writes their social situation and any other important context about the situation and sends it to SCT.
2) The user's message is used to retrieve relevant chunks from a ChromaDB vector database containing individual social situation explanations.
3) The retrieved chunks are reranked via cross-encoder for improved chunk relevance.
4) The top 5 chunks are taken and added to the system prompt.
5) The user's message is sent along with the RAG system prompt, and a response is received.

## Features
- Clean and modern UI with responsive features
- Chat history export and import for continuity between sessions

### Tech Stack
Python, LangChain, HuggingFace/Sentence Transformers, ChromaDB, React/TypeScript, FastAPI, Anthropic API

<br>

## Setup Instructions
1. In root directory, activate a `venv`
2. Run `pip install -r requirements.txt`
3. Ensure `.env` is set up properly (look up python-dotenv if unsure)
4. (optional) Add data to the `data/` directory with the format specified in `data/README.md`
5. Run `python scripts/ingest_db.py`.
6. Start the backend with `uvicorn app.api:app --reload`
7. In the `frontend/` directory, start the frontend with `npm run start`
8. Connect to `localhost:4173` for a preview
