import os

from dotenv import load_dotenv
from pymongo import MongoClient
from pymongo.server_api import ServerApi

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL")
MONGODB_DATABASE = os.getenv("MONGODB_DATABASE")

if not MONGODB_URL:
    raise ValueError("MONGODB_URL is not set")

if not MONGODB_DATABASE:
    raise ValueError("MONGODB_DATABASE is not set")

client = MongoClient(
    MONGODB_URL,
    server_api=ServerApi("1"),
    serverSelectionTimeoutMS=10000
)

db = client[MONGODB_DATABASE]