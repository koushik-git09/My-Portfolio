import re
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, field_validator


class ContactCreate(BaseModel):
    name: str = Field(
        ...,
        min_length=1,
        max_length=100,
        description="Full name of the sender",
        examples=["Jane Doe"],
    )
    email: str = Field(
        ...,
        min_length=3,
        max_length=255,
        description="Valid email address for response",
        examples=["jane.doe@example.com"],
    )
    subject: Optional[str] = Field(
        default="General Inquiry",
        max_length=200,
        description="Subject of the inquiry",
        examples=["Collaboration on AI Project"],
    )
    message: str = Field(
        ...,
        min_length=1,
        max_length=5000,
        description="Detailed message content",
        examples=["Hello, I would love to discuss an AI/ML engineering opportunity."],
    )

    @field_validator("name", "message")
    @classmethod
    def check_not_empty(cls, v: str) -> str:
        trimmed = v.strip()
        if not trimmed:
            raise ValueError("Field cannot be empty or only whitespace.")
        return trimmed

    @field_validator("email")
    @classmethod
    def validate_email_format(cls, v: str) -> str:
        trimmed = v.strip().lower()
        pattern = r"^[^@\s]+@[^@\s]+\.[^@\s]+$"
        if not re.match(pattern, trimmed):
            raise ValueError("Please provide a valid email address (e.g. name@example.com).")
        return trimmed

    @field_validator("subject", mode="before")
    @classmethod
    def clean_subject(cls, v: Optional[str]) -> str:
        if not v or not str(v).strip():
            return "General Inquiry"
        return str(v).strip()


class ContactResponse(BaseModel):
    success: bool = True
    message: str
    id: Optional[str] = None
    created_at: Optional[datetime] = None
