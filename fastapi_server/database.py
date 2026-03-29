import os
from pathlib import Path
from motor.motor_asyncio import AsyncIOMotorClient

# Load .env file if present
_env_path = Path(__file__).parent / ".env"
if _env_path.exists():
    from dotenv import load_dotenv
    load_dotenv(_env_path)

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/grabit")
DB_NAME = os.getenv("MONGODB_DB_NAME", "grabit")

client: AsyncIOMotorClient = None
db = None

async def connect_db():
    global client, db
    # Show only the host, not credentials, in logs
    safe_uri = MONGODB_URI.split("@")[-1] if "@" in MONGODB_URI else MONGODB_URI
    client = AsyncIOMotorClient(MONGODB_URI)
    db = client[DB_NAME]
    print(f"[OK] FastAPI MongoDB Connected: {safe_uri}")


async def close_db():
    global client
    if client:
        client.close()
        print("[OK] FastAPI MongoDB Disconnected")

def get_db():
    return db
