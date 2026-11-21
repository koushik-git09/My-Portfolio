from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class ProfileSchema(BaseModel):
    initials: str
    displayName: str
    shortLabel: str
    email: str
    githubHandle: str
    linkedinHandle: str
    location: str
    availability: str
    heroHeadline: str
    heroSupport: str
    animatedRoles: List[str]
    portraitImage: str
    phone: Optional[str] = None
    linkedinUrl: Optional[str] = None
    resumeUrl: Optional[str] = None


class PortfolioResponse(BaseModel):
    profile: ProfileSchema
    about: Dict[str, Any]
    skills: List[Dict[str, Any]]
    experience: List[Dict[str, Any]]
    projects: List[Dict[str, Any]]
    achievements: List[Dict[str, Any]]
    education: List[Dict[str, Any]]
    codingProfiles: Optional[List[Dict[str, Any]]] = None
    featuredRepos: Optional[List[Dict[str, Any]]] = None
    source: str = Field(
        default="mock_fallback",
        description="Indicates whether data came from 'mongodb' or 'local_fallback'",
    )
