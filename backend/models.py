from pydantic import BaseModel
from datetime import date, datetime
from typing import List, Optional, Literal

class Product(BaseModel):
    id: int
    name: str
    description: str
    price: float
    imageUrl: str
    quantity: int
    createdAt: date

class OrderItem(BaseModel):
    id: int
    name: str
    qty: int
    price: float

class Customer(BaseModel):
    name: str
    surname: str
    address: str
    phone: str
    email: Optional[str] = None

class Order(BaseModel):
    id: int
    items: List[OrderItem]
    createdAt: datetime
    acceptedAt: Optional[datetime] = None
    customer: Customer
    status: Literal['Accepted', 'Rejected', 'Finished']
    totalPrice: Optional[float] = None
