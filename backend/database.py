from pymongo import MongoClient
from dotenv import load_dotenv
import os
import certifi

load_dotenv()

mongo_uri = os.getenv("MONGO_URI")

client = MongoClient(
    mongo_uri,
    tls=True,
    tlsCAFile=certifi.where()
)

db = client["smartfit"]
workouts_collection = db["workouts"]
users_collection = db["users"]