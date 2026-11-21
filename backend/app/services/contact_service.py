import logging
from datetime import datetime, timezone
from typing import List
from app.core.database import (
    ensure_mongo_connected,
    get_contacts_collection,
    is_database_connected,
)
from app.schemas.contact import ContactCreate, ContactResponse
from app.services.email_service import email_service

logger = logging.getLogger("uvicorn.error")

# Safe local in-memory fallback store for offline development
_dev_contact_submissions: List[dict] = []


class ContactService:
    @staticmethod
    async def create_contact_submission(data: ContactCreate) -> ContactResponse:
        """Saves a contact submission to MongoDB asynchronously or in-memory fallback."""
        await ensure_mongo_connected()
        doc = {
            "name": data.name,
            "email": data.email,
            "subject": data.subject,
            "message": data.message,
            "created_at": datetime.now(timezone.utc),
        }

        if is_database_connected():
            collection = get_contacts_collection()
            if collection is not None:
                try:
                    result = await collection.insert_one(doc)
                    logger.info(f"Saved contact submission to MongoDB with ID {result.inserted_id}")

                    # Dispatch email notification in background asynchronously
                    try:
                        await email_service.send_contact_notification(
                            name=data.name,
                            email=data.email,
                            subject=data.subject,
                            message=data.message,
                            timestamp=doc["created_at"],
                        )
                    except Exception as err:
                        logger.error(f"[ContactService] Email notification error: {err}")

                    return ContactResponse(
                        success=True,
                        message="Your message has been received successfully. Thank you!",
                        id=str(result.inserted_id),
                        created_at=doc["created_at"],
                    )
                except Exception as exc:
                    logger.error(f"Error writing to MongoDB: {exc}")
                    # Fall back to logging and dev store below

        # Fallback when database is unconfigured or offline
        doc["_id"] = f"dev-sub-{len(_dev_contact_submissions) + 1}"
        _dev_contact_submissions.append(doc)
        logger.info(
            f"[Local Dev Fallback] Saved contact submission from '{data.name}' <{data.email}>. "
            f"Total dev submissions: {len(_dev_contact_submissions)}"
        )

        # Dispatch email notification in background asynchronously
        try:
            await email_service.send_contact_notification(
                name=data.name,
                email=data.email,
                subject=data.subject,
                message=data.message,
                timestamp=doc["created_at"],
            )
        except Exception as err:
            logger.error(f"[ContactService] Email notification error: {err}")

        return ContactResponse(
            success=True,
            message="Your message has been received (recorded in development mode).",
            id=doc["_id"],
            created_at=doc["created_at"],
        )


contact_service = ContactService()
