from fastapi import APIRouter, status
from app.schemas.contact import ContactCreate, ContactResponse
from app.services.contact_service import contact_service

router = APIRouter(tags=["Contact"])


@router.post(
    "/contact",
    response_model=ContactResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Submit Contact Message",
)
async def submit_contact(payload: ContactCreate):
    """Validates the contact form payload and persists submission to MongoDB asynchronously."""
    return await contact_service.create_contact_submission(payload)
