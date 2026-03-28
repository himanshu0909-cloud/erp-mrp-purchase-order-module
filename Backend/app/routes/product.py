from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app import models

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/products")
def create_product(name: str, sku: str, price: float, stock: int, db: Session = Depends(get_db)):
    product = models.Product(name=name, sku=sku, price=price, stock=stock)
    db.add(product)
    db.commit()
    db.refresh(product)
    return product

@router.get("/products")
def get_products(db: Session = Depends(get_db)):
    return db.query(models.Product).all()