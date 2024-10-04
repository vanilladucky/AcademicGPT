from fastapi import FastAPI, HTTPException
from datetime import datetime
from fastapi import HTTPException
from bson import ObjectId
import asyncio
from typing import List, Dict, Optional
from fastapi.middleware.cors import CORSMiddleware
from get_embedding_function import get_embedding_function
from dotenv import load_dotenv
import time
from langchain_core.prompts import PromptTemplate
from langchain_huggingface import HuggingFaceEndpoint
from langchain.retrievers.document_compressors import CrossEncoderReranker
from langchain_community.cross_encoders import HuggingFaceCrossEncoder
from langchain.retrievers import ContextualCompressionRetriever
from langchain_mongodb import MongoDBAtlasVectorSearch
from pymongo import MongoClient
import os
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer
from datetime import datetime
import certifi
from pydantic import BaseModel
import motor.motor_asyncio
from contextlib import asynccontextmanager
from datetime import datetime, timedelta
import jwt
import re
import random
import smtplib

# define a lifespan method for fastapi
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Start the database connection
    await startup_db_client(app)
    yield
    # Close the database connection
    await shutdown_db_client(app)

# method for start the MongoDb Connection
async def startup_db_client(app):
    app.mongodb_client = motor.motor_asyncio.AsyncIOMotorClient(connection_string, tlsCAFile=certifi.where())
    app.mongodb = app.mongodb_client.get_database(database_name)[collection_name]
    app.user = app.mongodb_client.get_database(database_name)[user_db_name]
    app.vectordb = app.mongodb_client.get_database(database_name)[vectordb_name]
    app.compression_retriever = create_vector_search()
    app.model = get_model()
    print("MongoDB connected.")

# method to close the database connection
async def shutdown_db_client(app):
    app.mongodb_client.close()
    print("MongoDB disconnected.")

# creating a server with python FastAPI
app = FastAPI(lifespan=lifespan)

# =====Login functions===== #
# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Secret key and JWT settings
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))
SERVER_PORT = os.getenv("VITE_SERVER_PORT")

# Models
class User(BaseModel):
    username: str
    password: str
    register_date: Optional[datetime] = None
    verification_code: Optional[str] = None
    verified: Optional[bool] = None

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def is_strong_password(password:str):
    # At least 8 characters long
    if len(password) < 8:
        return False
    
    # Contains at least one uppercase letter
    if not re.search(r'[A-Z]', password):
        return False
    
    # Contains at least one lowercase letter
    if not re.search(r'[a-z]', password):
        return False
    
    # Contains at least one digit
    if not re.search(r'\d', password):
        return False
    
    # Contains at least one special character
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        return False
    
    return True


@app.get("/get_user")
async def get_user(user_name:str):
    user = await app.user.find_one({"username": user_name})
    user["_id"] = str(user["_id"])
    return {'user_id':user["_id"]}


@app.post("/login")
async def login(form_data: User):
    user = await app.user.find_one({"username": form_data.username})
    if not user or not verify_password(form_data.password, user["password"]):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    if user['verified'] == False:
        raise HTTPException(status_code=400, detail="Not verified yet! Click here to verify")

    access_token = create_access_token(data={"sub": user["username"]})
    return {"access_token": access_token, "token_type": "bearer", "success": True}

@app.post("/register")
async def register(user: User):
    user_data = await app.user.find_one({"username": user.username})
    if user_data:
        raise HTTPException(status_code=310, detail="User already exists")

    if user.username.split('@')[1] != 'e.ntu.edu.sg':
        return {"message": "Only NTU students may register!"}

    if is_strong_password(user.password) == False:
        return {"message": "Weak password"}

    hashed_password = get_password_hash(user.password)
    verification_code = str(random.randint(100000, 999999))
    app.user.insert_one({"username": user.username, 
                        "password": hashed_password, 
                        "register_date": datetime.now(),
                        "verification_code": verification_code, 
                        "verified": False})
    send_email(user.username, verification_code)
    return {"message": "Email Sent!"}

# =====END Login functions===== #

# ====Email verification==== #
def send_email(email, code):
    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(os.getenv("EMAIL"), os.getenv("EMAIL_PASSWORD"))
            server.sendmail(
                from_addr=os.getenv("EMAIL"),
                to_addrs=email,
                msg=f"Subject: Your Verification Code\n\nYour verification code is {code}"
            )
            print("Email sent successfully!")
    except Exception as e:
        print(f"Error sending email!: {e}")

class VerifyAgain(BaseModel):
    email:str

@app.post("/send_email")
def send_email_again(VerifyAgain:VerifyAgain):
    email = VerifyAgain.email
    code = str(random.randint(100000, 999999))
    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(os.getenv("EMAIL"), os.getenv("EMAIL_PASSWORD"))
            server.sendmail(
                from_addr=os.getenv("EMAIL"),
                to_addrs=email,
                msg=f"Subject: Your Verification Code\n\nYour verification code is {code}"
            )
            print("Email sent successfully!")
        app.user.update_one({"username": email}, {"$set": {"verification_code": code}})
    except Exception as e:
        print(f"Error sending email!: {e}")

class VerifyRequest(BaseModel):
    email: str
    code: str

@app.post("/verify")
async def verify_code(request:VerifyRequest):
    email = request.email
    code = request.code
    # Find user and check the code
    user = await app.user.find_one({"username": email})
    if user and user["verification_code"] == code:
        # If the code matches, mark as verified and complete registration
        app.user.update_one({"username": email}, {"$set": {"verified": True}})
        return {"message": "Success"}
    
    raise HTTPException(status_code=400, detail="Invalid verification code")

# ====END email verification==== #

origins = [
    "http://localhost",
    "http://localhost:5173",
    SERVER_PORT
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

CHROMA_PATH = "chroma"
connection_string = os.getenv("CONNECTION_STRING")
database_name = os.getenv("DATABASE_NAME")
collection_name = os.getenv("COLLECTION_NAME")
user_db_name = os.getenv("USER_DB_NAME")
vectordb_name = os.getenv("VECTORDB_NAME")
load_dotenv()

# Obtained from https://llama.meta.com/docs/model-cards-and-prompt-formats/meta-llama-3/
PROMPT_TEMPLATE = """
<|begin_of_text|><|start_header_id|>system<|end_header_id|>
Attend to the user's question after consulting the given context. If there are no relevant information in the context, feel free to ignore it. Here is the context:\n
{context}
<|eot_id|>
{question}
<|start_header_id|>assistant<|end_header_id|>
"""

def get_model():
    prompt = PromptTemplate.from_template(PROMPT_TEMPLATE)
    repo_id = "meta-llama/Meta-Llama-3-8B-Instruct"

    llm = HuggingFaceEndpoint(
        repo_id=repo_id,
        temperature=0.6,
        huggingfacehub_api_token=os.getenv("HF_TOKEN")
    )
    
    model = prompt | llm

    return model

# ====Initialize the model first====
"""try:
    model = get_model()
    print("Model successfully initialized!")
except:
    raise Exception("-E- Model failed to initialize.")"""
# ===================================

# ====Initialize rerankers====
# Prepare the DB.
#embedding_function = get_embedding_function()
#db = MongoDBAtlasVectorSearch(app.mongodb_client.get_database(database_name)[vectordb_name], embedding_function)

# Search the DB.
# s = time.time()
# results = db.similarity_search_with_score(query_text, k=5)
# Reranking

# ================================

class query_response(BaseModel):
    _id: Optional[str] = None
    user: str 
    convo: list[dict]

@app.get("/api/retrieve_all_chat/{user_id}", response_description = "Obtain all past chat history to display at the start")
async def retrieve_all(user_id:str):
    res = await app.mongodb.find({'user': user_id}).to_list(length=None)  # Convert cursor to a list
    for item in res:
        item["_id"] = str(item["_id"])  # Convert ObjectId to string
    return res

@app.get("/api/retrieve/{id}", response_description="Obtain the convo detail")
async def retrieve(id:str):
    try:
        object_id = ObjectId(id)  # Convert string to ObjectId
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid ObjectId format")

    retrieve = await app.mongodb.find_one({'_id':object_id})

    if retrieve is None:
        raise HTTPException(status_code=404, detail="Item not found")

    retrieve["_id"] = str(retrieve["_id"])  # Convert ObjectId to string
    return retrieve  # Use the Pydantic model to return a valid response

@app.post("/convo/", response_description = "Add new convo")
async def upload(item: query_response):
    new_insert = await app.mongodb.insert_one(item.model_dump())
    created_insert = await app.mongodb.find_one({'_id': new_insert.inserted_id})
    if created_insert:
        created_insert['_id'] = str(created_insert['_id'])
    
    return created_insert

@app.put("/convo/{id}", response_description="Update a convo")
async def update_convo(id: str, item: query_response):
    student = {
        k: v for k, v in item.model_dump().items() if v is not None
    }

    try:
        object_id = ObjectId(id)
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid ObjectId")

    if len(student) >= 1:
        update_result = await app.mongodb.find_one_and_update(
            {"_id": object_id},
            {"$set": student}
        )
    
    if (existing_student := await app.mongodb.find_one({"_id": id})) is not None:
        return existing_student

class ConvoModel(BaseModel):
    query_text: str
    convo: List[Dict]

def create_vector_search():
    """
    Creates a MongoDBAtlasVectorSearch object using the connection string, database, and collection names, along with the OpenAI embeddings and index configuration.
    :return: MongoDBAtlasVectorSearch object
    """
    try:
        Client = MongoClient(connection_string, tlsCAFile=certifi.where())
        vector_search = MongoDBAtlasVectorSearch(
        collection=Client[database_name][vectordb_name],
        embedding = get_embedding_function(),
        index_name='default'
        )
        retriever = vector_search.as_retriever(search_kwargs={"k": 20})
        reranker_model = HuggingFaceCrossEncoder(model_name="mixedbread-ai/mxbai-rerank-xsmall-v1")
        compressor = CrossEncoderReranker(model=reranker_model, top_n=8)
        compression_retriever = ContextualCompressionRetriever(
            base_compressor=compressor, base_retriever=retriever
        )
    except Exception as e:
        print(e)
        raise Exception

    return compression_retriever

async def search_context(query_text):
    results = await asyncio.to_thread(app.compression_retriever.invoke, query_text)
    return results


@app.post("/LLM_response/")
async def LLMrespond(data: ConvoModel):
    print("Question received")    
    query_text = data.query_text
    convo = data.convo
    s = time.time()
    results = await search_context(query_text)
    print(f"Time taken for similarity search and rereanking is {time.time() - s}s")
    # return // for testing latency of MongoDB retrieval 
    context_text = "  \n  \n---  \n  \n".join([doc.page_content for doc in results])
    history_text = ""
    if len(convo)>0:
        for item in convo[-1*min(6,len(convo)):]:
            history_text = history_text + f"<|start_header_id|>{'assistant' if item['user'] == 'LLM' else 'user'}<|end_header_id|>{item['text'].split('==============================================')[0].replace('\n', '')}<|eot_id|>"
    query_text = history_text + f"<|start_header_id|>user<|end_header_id|>{query_text}<|eot_id|>"
    s = time.time()

    try:
        response_text = app.model.invoke({'context': context_text, 'history': history_text, 'question': query_text})
    except Exception as e:
        return {"response": "Error!"}

    print(f"Time taken by LLM is {time.time() - s}s")

    sources = [(doc.metadata.get("source", None) +  ' ' + str(doc.metadata.get("page", None))) for doc in results]
    """for idx, s in enumerate(sources):
        sources[idx] = '|'.join(s.split('|')[:-1])"""
    for idx, s in enumerate(sources):
        sources[idx] = ''.join(s.split('/')[1:])
    sources.sort()
    sources = '  \n'.join(sources)
    formatted_response = f"{response_text}\n\n==============================================\n\nSome relevant materials are:\n\n{sources}"
    print('Answer sent!\n')
    return {"response": formatted_response}