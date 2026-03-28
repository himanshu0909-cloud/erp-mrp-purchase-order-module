from sqlalchemy.orm import Session
from . import models

def create_purchase_order(db: Session, order_data):
    total = 0

    order = models.PurchaseOrder(
        vendor_id=order_data.vendor_id,
        status="Pending",
        total_amount=0
    )
    db.add(order)
    db.commit()
    db.refresh(order)

    for item in order_data.items:
        product = db.query(models.Product).filter(models.Product.id == item.product_id).first()

        if product.stock < item.quantity:
            raise Exception("Not enough stock")

        subtotal = product.price * item.quantity
        total += subtotal

        order_item = models.OrderItem(
            order_id=order.id,
            product_id=product.id,
            quantity=item.quantity,
            price=product.price
        )
        db.add(order_item)

        product.stock -= item.quantity  # reduce stock

    total_with_tax = total * 1.05
    order.total_amount = total_with_tax

    db.commit()
    db.refresh(order)

    return order