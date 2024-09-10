from pymongo.mongo_client import MongoClient
from dateutil import parser
from datetime import datetime
import certifi


def get_database(connection_string, database_name):
  
   # Create a connection using MongoClient. You can import MongoClient or use pymongo.MongoClient
   client = MongoClient(connection_string, tlsCAFile=certifi.where())
 
   # Create the database for our example (we will use the same database throughout the tutorial
   return client[database_name]

def insert_db(db, collection_name, query, answer):
    
    collection = db[collection_name]

    item = {
        "question": query,
        "answer": answer,
        "date": parser.parse(datetime.now().strftime("%d/%m/%Y %H:%M:%S"))
        }
    collection.insert_one(item)
   
  
# This is added so that many files can reuse the function get_database()
if __name__ == "__main__":   
  
    # Get the database
    dbname = get_database()
    collection = dbname[collection_name]

    item_1 = {
        "question": "How do i find this?",
        "date": parser.parse(datetime.now().strftime("%d/%m/%Y %H:%M:%S"))
        }
    collection.insert_many([item_1])