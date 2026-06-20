from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.database.database import get_db

from app.models.customer import Customer
from app.models.product import Product
from app.models.order import Order
from app.models.order import OrderItem

from app.schemas.order import OrderCreate

router = APIRouter(
    prefix="/orders",
    tags=["Orders"]
)

@router.post("/")
def create_order(
    payload: OrderCreate,
    db: Session = Depends(get_db)
):

    customer = db.query(Customer).filter(
        Customer.id == payload.customer_id
    ).first()

    if not customer:
        raise HTTPException(
            status_code=404,
            detail="Customer not found"
        )

    total_amount = 0

    order = Order(
        customer_id=payload.customer_id,
        total_amount=0
    )

    db.add(order)
    db.flush()

    for item in payload.items:

        product = db.query(Product).filter(
            Product.id == item.product_id
        ).first()

        if not product:
            raise HTTPException(
                status_code=404,
                detail=f"Product {item.product_id} not found"
            )

        if product.stock_quantity < item.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient stock for {product.name}"
            )

        line_total = product.price * item.quantity

        total_amount += line_total

        product.stock_quantity -= item.quantity

        order_item = OrderItem(
            order_id=order.id,
            product_id=product.id,
            quantity=item.quantity,
            unit_price=product.price
        )

        db.add(order_item)

    order.total_amount = total_amount

    db.commit()
    db.refresh(order)

    return {
        "order_id": order.id,
        "customer_id": order.customer_id,
        "total_amount": order.total_amount
    }
@router.get("/")
def get_orders(
    db: Session = Depends(get_db)
):
    return db.query(Order).all()

@router.get("/{order_id}")
def get_order(
    order_id: int,
    db: Session = Depends(get_db)
):

    order = db.query(Order).filter(
        Order.id == order_id
    ).first()

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    return {
        "id": order.id,
        "customer": order.customer.full_name,
        "total_amount": order.total_amount,
        "items": [
            {
                "product": item.product.name,
                "quantity": item.quantity,
                "unit_price": item.unit_price
            }
            for item in order.items
        ]
    }

@router.delete("/{order_id}")
def delete_order(
    order_id: int,
    db: Session = Depends(get_db)
):

    order = db.query(Order).filter(
        Order.id == order_id
    ).first()

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    order_items = db.query(OrderItem).filter(
        OrderItem.order_id == order.id
    ).all()

    for item in order_items:

        product = db.query(Product).filter(
            Product.id == item.product_id
        ).first()

        if product:
            product.stock_quantity += item.quantity

    db.delete(order)
    db.commit()

    return {
        "message": "Order deleted successfully"
    }