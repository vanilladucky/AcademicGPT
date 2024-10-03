from pymongo import MongoClient
from langchain_community.vectorstores import MongoDBAtlasVectorSearch
from langchain_community.document_loaders import PyPDFLoader
import os
from dotenv import load_dotenv
import certifi
from langchain_community.document_loaders import PyPDFLoader
from langchain_experimental.text_splitter import SemanticChunker
from get_embedding_function import get_embedding_function

load_dotenv()

connection_string = os.getenv("CONNECTION_STRING")
database_name = os.getenv("DATABASE_NAME")
collection_name = os.getenv("VECTORDB_NAME")
DATA_PATH = "data"

client = MongoClient(connection_string, tlsCAFile=certifi.where())
collection = client[database_name][collection_name]

def calculate_chunk_ids(chunks):

    # Page Source : Page Number : Chunk Index

    last_page_id = None
    current_chunk_index = 0

    for chunk in chunks:
        source = chunk.metadata.get("source")
        page = chunk.metadata.get("page")
        source = source.split('/')[1:][0]
        current_page_id = f"{source} | Page number: {page}"

        # If the page ID is the same as the last one, increment the index.
        if current_page_id == last_page_id:
            current_chunk_index += 1
        else:
            current_chunk_index = 0

        # Calculate the chunk ID.
        chunk_id = f"{current_page_id} | Chunk Index: {current_chunk_index}"
        last_page_id = current_page_id

        # Add it to the page meta-data.
        chunk.metadata["id"] = chunk_id

    return chunks

def main():
    pdf_folder_path = DATA_PATH
    documents = []
    print("--Loading--")
    for file in os.listdir(pdf_folder_path):
        if file.endswith('.pdf'):
            pdf_path = os.path.join(pdf_folder_path, file)
            loader = PyPDFLoader(pdf_path)
            documents.extend(loader.load())
    text_splitter =  SemanticChunker(get_embedding_function())
    print("--Splitting--")
    chunked_documents = text_splitter.split_documents(documents)
    chunks_with_ids = calculate_chunk_ids(chunked_documents)
    print(f"--Adding new documents: {len(chunked_documents)}--")
    vectordb = MongoDBAtlasVectorSearch.from_documents(
        documents=chunks_with_ids,
        embedding=get_embedding_function(),
        collection=collection
    )
    # vectordb.persist()
    print("--Done!--")
    return vectordb

if __name__ == "__main__":
    main()