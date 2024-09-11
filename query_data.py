import argparse
import os
import pysqlite3
import sys
sys.modules["sqlite3"] = sys.modules.pop("pysqlite3")
from langchain_chroma import Chroma
from langchain.prompts import ChatPromptTemplate
from langchain_community.llms.ollama import Ollama
from langchain.retrievers import ContextualCompressionRetriever
from langchain.retrievers.document_compressors import FlashrankRerank, CrossEncoderReranker
from langchain_community.cross_encoders import HuggingFaceCrossEncoder
import streamlit as st
from langchain_huggingface import HuggingFaceEndpoint
from langchain_core.prompts import PromptTemplate

from dotenv import load_dotenv
import time

from get_embedding_function import get_embedding_function

CHROMA_PATH = "chroma"
load_dotenv()


# Obtained from https://llama.meta.com/docs/model-cards-and-prompt-formats/meta-llama-3/
PROMPT_TEMPLATE = """
<|begin_of_text|><|start_header_id|>system<|end_header_id|>
You are a helpful AI assistant. Attend to the user's question after consulting the given context. If there are no relevant information in the context, feel free to ignore it. Here is the context:\n
{context}
<|eot_id|>
<|start_header_id|>user<|end_header_id|>
{question}<|eot_id|>
<|start_header_id|>assistant<|end_header_id|>
"""


def main(query_text:str):
    # Create CLI.
    """parser = argparse.ArgumentParser()
    parser.add_argument("query_text", type=str, help="The query text.")
    args = parser.parse_args()
    query_text = args.query_text"""
    return query_rag(query_text)


def query_rag(query_text: str):
    # Prepare the DB.
    embedding_function = get_embedding_function()
    db = Chroma(persist_directory=CHROMA_PATH, embedding_function=embedding_function)

    # Search the DB.
    s = time.time()
    # results = db.similarity_search_with_score(query_text, k=5)
    # Reranking
    retriever = db.as_retriever(search_kwargs={"k": 30})

    reranker_model = HuggingFaceCrossEncoder(model_name="cross-encoder/nli-deberta-v3-xsmall")
    compressor = CrossEncoderReranker(model=reranker_model, top_n=10)
    compression_retriever = ContextualCompressionRetriever(
        base_compressor=compressor, base_retriever=retriever
    )
    results = compression_retriever.invoke(query_text)

    print(f"Time taken for similarity search and rereanking is {time.time() - s}s")
    context_text = "  \n  \n---  \n  \n".join([doc.page_content for doc in results])
    # prompt = PROMPT_TEMPLATE.format(context=context_text, question=query_text)
    prompt = PromptTemplate.from_template(PROMPT_TEMPLATE)

    # model = Ollama(model="llama3.1:8b-instruct-q4_0")
    repo_id = "meta-llama/Meta-Llama-3-8B-Instruct"

    llm = HuggingFaceEndpoint(
        repo_id=repo_id,
        temperature=0.5,
        huggingfacehub_api_token=st.secrets["HF_TOKEN"]
    )
    model = prompt | llm
    s = time.time()
    response_text = model.invoke({'context': context_text, 'question': query_text})
    print(f"Time taken by LLM is {time.time() - s}s")

    sources = [doc.metadata.get("id", None) for doc in results]
    for idx, s in enumerate(sources):
        sources[idx] = '|'.join(s.split('|')[:-1])
    sources.sort()
    sources = '  \n'.join(sources)
    formatted_response = f"{response_text} \n\n ============================================== \n\n Some relevant materials are: \n\n {sources}"
    print(formatted_response)
    return formatted_response


if __name__ == "__main__":
    main()
