from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.product import Product
from app.schemas.product import ProductCreate

router = APIRouter(
    prefix="/products",
    tags=["Products"]
)


@router.post("/")
def create_product(
    payload: ProductCreate,
    db: Session = Depends(get_db)
):

    existing_product = db.query(Product).filter(
        Product.sku == payload.sku
    ).first()

    if existing_product:
        raise HTTPException(
            status_code=409,
            detail="SKU already exists"
        )

    product = Product(
        name=payload.name,
        sku=payload.sku,
        price=payload.price,
        stock_quantity=payload.stock_quantity
    )

    db.add(product)
    db.commit()
    db.refresh(product)

    return product

@router.get("/")
def get_products(
    db: Session = Depends(get_db)
):
    return db.query(Product).all()

@router.get("/{product_id}")
def get_product(
    product_id: int,
    db: Session = Depends(get_db)
):

    product = db.query(Product).filter(
        Product.id == product_id
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    return product

@router.put("/{product_id}")
def update_product(
    product_id: int,
    payload: ProductCreate,
    db: Session = Depends(get_db)
):

    product = db.query(Product).filter(
        Product.id == product_id
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    existing_sku = db.query(Product).filter(
        Product.sku == payload.sku,
        Product.id != product_id
    ).first()

    if existing_sku:
        raise HTTPException(
            status_code=409,
            detail="SKU already exists"
        )

    product.name = payload.name
    product.sku = payload.sku
    product.price = payload.price
    product.stock_quantity = payload.stock_quantity

    db.commit()
    db.refresh(product)

    return product

# delete product
@router.delete("/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db)
):

    product = db.query(Product).filter(
        Product.id == product_id
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    db.delete(product)
    db.commit()

    return {
        "message": "Product deleted successfully"
    }



    