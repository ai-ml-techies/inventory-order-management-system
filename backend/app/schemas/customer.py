from pydantic import BaseModel
from pydantic import EmailStr
from pydantic import Field


class CustomerCreate(BaseModel):
    full_name: str = Field(min_length=2)

    email: EmailStr

    phone: str = Field(min_length=10)


class CustomerResponse(CustomerCreate):
    id: int

    class Config:
        from_attributes = True