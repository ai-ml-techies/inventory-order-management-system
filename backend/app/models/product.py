from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Float

from app.database.database import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)

    sku = Column(
        String,
        unique=True,
        nullable=False
    )

    price = Column(
        Float,
        nullable=False
    )

    stock_quantity = Column(
        Integer,
        default=0
    )