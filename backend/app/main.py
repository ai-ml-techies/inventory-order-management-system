from fastapi import FastAPI

from app.database.database import Base
from app.database.database import engine

from app.models.product import Product
from app.routes.product import router as product_router

from app.models.customer import Customer
from app.routes.customer import router as customer_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Inventory Management API",
    version="1.0.0"
)

# Register routes
app.include_router(product_router)

app.include_router(customer_router)

@app.get("/")
def home():
    return {
        "message": "Inventory API Running"
    }