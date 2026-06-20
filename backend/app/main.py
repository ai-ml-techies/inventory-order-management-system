from fastapi import FastAPI

from app.database.database import Base
from app.database.database import engine

from fastapi.middleware.cors import CORSMiddleware

from app.models.product import Product
from app.routes.product import router as product_router

from app.models.customer import Customer
from app.routes.customer import router as customer_router

from app.models.order import Order
from app.models.order import OrderItem

from app.routes.order import router as order_router

from app.routes.dashboard import router as dashboard_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Inventory Management API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Register routes
app.include_router(product_router)

app.include_router(customer_router)

app.include_router(order_router)

app.include_router(dashboard_router)

@app.get("/")
def home():
    return {
        "message": "Inventory API Running"
    }