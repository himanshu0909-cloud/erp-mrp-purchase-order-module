from pydantic import BaseModel
from typing import List

class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int

class PurchaseOrderCreate(BaseModel):
    vendor_id: int
    items: List[OrderItemCreate]