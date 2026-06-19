from pydantic import BaseModel, Field

class ProductCreate(BaseModel):
    name: str = Field(min_length=2, max_length=100)

    sku: str = Field(min_length=2, max_length=50)

    price: float = Field(gt=0)

    stock_quantity: int = Field(ge=0)


class ProductResponse(ProductCreate):
    id: int

    class Config:
        from_attributes = True