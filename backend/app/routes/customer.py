from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.customer import Customer
from app.schemas.customer import CustomerCreate

router = APIRouter(
    prefix="/customers",
    tags=["Customers"]
)
@router.post("/")
def create_customer(
    payload: CustomerCreate,
    db: Session = Depends(get_db)
):

    existing_customer = db.query(Customer).filter(
        Customer.email == payload.email
    ).first()

    if existing_customer:
        raise HTTPException(
            status_code=409,
            detail="Email already exists"
        )

    customer = Customer(
        full_name=payload.full_name,
        email=payload.email,
        phone=payload.phone
    )

    db.add(customer)
    db.commit()
    db.refresh(customer)

    return customer
@router.get("/")
def get_customers(
    db: Session = Depends(get_db)
):
    return db.query(Customer).all()

@router.get("/{customer_id}")
def get_customer(
    customer_id: int,
    db: Session = Depends(get_db)
):

    customer = db.query(Customer).filter(
        Customer.id == customer_id
    ).first()

    if not customer:
        raise HTTPException(
            status_code=404,
            detail="Customer not found"
        )

    return customer

@router.delete("/{customer_id}")
def delete_customer(
    customer_id: int,
    db: Session = Depends(get_db)
):

    customer = db.query(Customer).filter(
        Customer.id == customer_id
    ).first()

    if not customer:
        raise HTTPException(
            status_code=404,
            detail="Customer not found"
        )

    db.delete(customer)
    db.commit()

    return {
        "message": "Customer deleted successfully"
    }