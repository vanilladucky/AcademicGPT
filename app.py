import streamlit as st
from dotenv import load_dotenv
import os
from query_data import main as query
from populate_database import main as populate
from pymongo.mongo_client import MongoClient
from db import get_database, insert_db
import subprocess
import pysqlite3
import sys
st.set_page_config(page_title="A more reliable LLM", page_icon=":books:")
sys.modules["sqlite3"] = sys.modules.pop("pysqlite3")

load_dotenv()
connection_string = os.getenv("CONNECTION_STRING")
database_name = os.getenv('DATABASE_NAME')
collection_name = os.getenv('COLLECTION_NAME')
CHROMA_PATH = "chroma"

if 'prev' not in st.session_state:
    st.session_state['prev'] = ''

if 'send_again' not in st.session_state:
    st.session_state['send_again'] = True

def populate_db(reset = False):
    print("====Populating DB!====")
    if reset == False:
        subprocess.run(["python3", "populate_database.py"])
    elif reset == True:
        subprocess.run(["python3", "populate_database.py", "--reset"])
    return

@st.cache_resource
def init_connection():
    print("====Connecting to DB====")
    print("====Connection successful!====")
    return get_database(connection_string, database_name)

try:
    db = init_connection()
except:
    raise Exception("Cannot connect to MongoDB")

try:
    if os.path.exists(CHROMA_PATH) == False:
        with st.spinner("Loading the PDFs into a database..."):
            populate_db(False)
except:
    raise Exception("Vector DB cannot be set up!")

def send_to_DB(db, collection_name, text_input, response_text):
    if st.session_state['send_again'] and len(text_input) > 0 and len(response_text) > 0:
        print("====Sending to MongoDB====")
        insert_db(db, collection_name, text_input, response_text)
        print("====Successfully sent!====")
        st.session_state['send_again'] = False
    else:
        print("Not sending the same question and answer!")



def main():
    st.header("A more reliable LLM :books:")
    st.write("So far, the following lecture materials are studied by the LLM")
    st.markdown("- Computer Architecture")
    st.markdown("- Data Structure and Algorithms")
    st.markdown("- Probability and Statistics")
    st.markdown("- Introduction to Databases")
    st.markdown("- Computer Networks")
    st.markdown("- Operating Systems")
    st.markdown("- Introduction to Data Science and Artifical Intelligence")
    
    text_input = st.text_input("Ask question")
    response_text = ""
    if text_input and st.session_state['prev'] != text_input:
        with st.spinner('searching for answers...'):
            response_text = query(text_input)
        st.write(response_text)
        st.session_state['prev'] = text_input
        st.session_state['send_again'] = True
    st.button('Good!', on_click = send_to_DB, args = [db, collection_name, text_input, response_text])

if __name__=="__main__":
    main()
