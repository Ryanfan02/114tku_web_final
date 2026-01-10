from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings

client = AsyncIOMotorClient(settings.MONGO_URL)
db = client[settings.MONGO_DB]


async def ensure_indexes():
 
    await db.users.create_index("username", unique=True)

  
    await db.events.create_index([("user_id", 1), ("dateISO", 1)])
