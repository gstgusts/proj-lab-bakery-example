from pydantic import BaseModel, ConfigDict, EmailStr


class UserProfile(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    surname: str
    email: EmailStr
