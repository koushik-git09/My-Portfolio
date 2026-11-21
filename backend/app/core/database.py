import logging
from typing import Optional
from pymongo import AsyncMongoClient
from pymongo.asynchronous.collection import AsyncCollection
from pymongo.asynchronous.database import AsyncDatabase
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
from app.core.config import settings

logger = logging.getLogger("uvicorn.error")


class MongoManager:
    client: Optional[AsyncMongoClient] = None
    db: Optional[AsyncDatabase] = None
    is_connected: bool = False
    connection_status_message: str = "Database not initialized"


db_manager = MongoManager()


async def connect_to_mongo() -> None:
    """Initializes the MongoDB AsyncMongoClient connection."""
    if not settings.MONGODB_URI or not settings.MONGODB_URI.strip():
        db_manager.is_connected = False
        db_manager.connection_status_message = (
            "MONGODB_URI not configured (running in local fallback mode)"
        )
        logger.info(db_manager.connection_status_message)
        return

    try:
        logger.info("Connecting to MongoDB Atlas via AsyncMongoClient...")
        db_manager.client = AsyncMongoClient(
            settings.MONGODB_URI,
            serverSelectionTimeoutMS=3000,
            connectTimeoutMS=3000,
        )
        # Verify connection asynchronously with ping
        await db_manager.client.admin.command("ping")
        db_manager.db = db_manager.client[settings.DATABASE_NAME]
        db_manager.is_connected = True
        db_manager.connection_status_message = (
            f"Connected to MongoDB Atlas database: '{settings.DATABASE_NAME}'"
        )
        logger.info(db_manager.connection_status_message)
    except (ConnectionFailure, ServerSelectionTimeoutError) as err:
        db_manager.is_connected = False
        db_manager.connection_status_message = (
            "Failed to connect to MongoDB Atlas (network unreachable or invalid credentials)"
        )
        logger.warning(
            f"MongoDB connection warning: {db_manager.connection_status_message}. "
            f"Details: {str(err)[:80]}"
        )
    except Exception as exc:
        db_manager.is_connected = False
        db_manager.connection_status_message = "Unexpected error connecting to MongoDB"
        logger.warning(f"MongoDB error: {str(exc)[:80]}")


async def close_mongo_connection() -> None:
    """Closes the MongoDB AsyncMongoClient connection gracefully."""
    if db_manager.client:
        logger.info("Closing MongoDB connection...")
        await db_manager.client.close()
        db_manager.is_connected = False
        db_manager.connection_status_message = "Connection closed"


def get_database() -> Optional[AsyncDatabase]:
    """Returns the connected AsyncDatabase instance if available."""
    return db_manager.db


def get_collection(name: str) -> Optional[AsyncCollection]:
    """Returns an AsyncCollection instance if connected, otherwise None."""
    if db_manager.db is not None:
        return db_manager.db[name]
    return None


def get_contacts_collection() -> Optional[AsyncCollection]:
    return get_collection("contacts")


def get_portfolio_collection() -> Optional[AsyncCollection]:
    return get_collection("portfolio")


async def ensure_mongo_connected() -> None:
    """Ensures database connection is active (useful for serverless cold-starts)."""
    if not db_manager.is_connected and settings.MONGODB_URI and settings.MONGODB_URI.strip():
        await connect_to_mongo()


def is_database_connected() -> bool:
    return db_manager.is_connected


def get_connection_status() -> dict:
    return {
        "connected": db_manager.is_connected,
        "message": db_manager.connection_status_message,
    }
