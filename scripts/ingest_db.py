from langchain_community.document_loaders import DirectoryLoader, TextLoader
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from langchain_text_splitters import RecursiveCharacterTextSplitter

imported_data = DirectoryLoader("data/", loader_cls=TextLoader, loader_kwargs={"encoding": "utf-8"}).load()
embed_model = HuggingFaceEmbeddings()

text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
chunks = text_splitter.split_documents(imported_data)

Chroma.from_documents(documents=chunks, embedding=embed_model, persist_directory="vectorstore/")