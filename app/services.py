from __future__ import annotations

from datetime import datetime, timedelta
from typing import List, Optional
from uuid import uuid4

from fastapi import HTTPException, status

from . import schemas
from .storage import DataStore


def _now() -> datetime:
    return datetime.utcnow()


def create_product(store: DataStore, payload: schemas.ProductCreate) -> schemas.Product:
    now = _now()
    product = schemas.Product(
        id=uuid4().hex,
        created_at=now,
        updated_at=now,
        **payload.model_dump(),
    )
    store.add_product(product.model_dump())
    return product


def update_product(store: DataStore, product_id: str, payload: schemas.ProductUpdate) -> schemas.Product:
    product_data = store.get_product(product_id)
    if not product_data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

    product = schemas.Product(**product_data)
    updates = payload.model_dump(exclude_unset=True)
    for field, value in updates.items():
        setattr(product, field, value)

    product.updated_at = _now()
    store.update_product(product.model_dump())
    return product


def list_products(
    store: DataStore,
    *,
    category: Optional[str] = None,
    tag: Optional[str] = None,
    search: Optional[str] = None,
) -> List[schemas.Product]:
    products = [schemas.Product(**item) for item in store.list_products()]
    if category:
        products = [p for p in products if p.category.lower() == category.lower()]
    if tag:
        products = [p for p in products if tag.lower() in {t.lower() for t in p.tags}]
    if search:
        query = search.lower()
        products = [p for p in products if query in p.name.lower() or query in p.description.lower()]
    return products


def get_product(store: DataStore, product_id: str) -> schemas.Product:
    product = store.get_product(product_id)
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    return schemas.Product(**product)


def _reserve_slot(product: schemas.Product, slot_id: str, quantity: int) -> schemas.AvailabilitySlot:
    for idx, slot in enumerate(product.availability):
        if slot.id != slot_id:
            continue
        if slot.booked + quantity > slot.capacity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Selected slot is fully booked",
            )
        updated_slot = slot.model_copy(update={"booked": slot.booked + quantity})
        product.availability[idx] = updated_slot
        return updated_slot
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Slot not found")


def book_product(store: DataStore, product_id: str, request: schemas.BookingRequest) -> schemas.Booking:
    product_data = store.get_product(product_id)
    if not product_data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

    product = schemas.Product(**product_data)
    quantity = request.quantity
    total_price = product.price * quantity
    delivery_notes: Optional[str] = None
    slot_id = request.slot_id
    if slot_id:
        slot = _reserve_slot(product, slot_id, quantity)
        total_price = (slot.price or product.price) * quantity
        delivery_notes = f"Reserved slot starting {slot.start_time.isoformat()}"
    else:
        if product.available < quantity:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Not enough inventory")
        product.available -= quantity
        delivery_notes = "Instant delivery prepared"

    product.updated_at = _now()
    store.update_product(product.model_dump())

    booking = schemas.Booking(
        id=uuid4().hex,
        product_id=product.id,
        slot_id=slot_id,
        customer_email=request.customer_email,
        customer_name=request.customer_name,
        quantity=quantity,
        total=round(total_price, 2),
        status="reserved",
        reserved_at=_now(),
        delivery_code=uuid4().hex[:8].upper(),
        delivery_notes=delivery_notes,
        product=schemas.ProductSnapshot(
            name=product.name,
            delivery_method=product.delivery_method,
            category=product.category,
            price=product.price,
        ),
        note=request.note,
    )
    store.add_booking(booking.model_dump())
    return booking


def list_bookings(store: DataStore, *, email: Optional[str] = None) -> List[schemas.Booking]:
    bookings = [schemas.Booking(**item) for item in store.list_bookings(customer_email=email)]
    return sorted(bookings, key=lambda b: b.reserved_at, reverse=True)


def seed_default_products() -> List[dict]:
    now = _now()
    slots_base = now + timedelta(days=2)
    return [
        schemas.Product(
            id="prod-course-design",
            name="Design Systems Masterclass",
            description="Live cohort-based course with guided exercises and downloadables.",
            category="courses",
            price=249.0,
            delivery_method="live-stream",
            available=25,
            tags=["design", "ux", "figma"],
            availability=[
                schemas.AvailabilitySlot(
                    id="slot-weekend",
                    start_time=slots_base.replace(hour=15, minute=0, second=0, microsecond=0),
                    duration_minutes=120,
                    capacity=30,
                    booked=0,
                    price=269.0,
                ),
                schemas.AvailabilitySlot(
                    id="slot-evening",
                    start_time=(slots_base + timedelta(days=3)).replace(hour=18, minute=0, second=0, microsecond=0),
                    duration_minutes=120,
                    capacity=25,
                    booked=0,
                    price=249.0,
                ),
            ],
            created_at=now,
            updated_at=now,
        ).model_dump(),
        schemas.Product(
            id="prod-audio-pack",
            name="Podcast Starter Audio Pack",
            description="Royalty-free jingles, bumpers, and mixing templates for instant download.",
            category="digital-assets",
            price=49.0,
            delivery_method="download",
            available=250,
            tags=["audio", "podcast", "templates"],
            availability=[],
            created_at=now,
            updated_at=now,
        ).model_dump(),
        schemas.Product(
            id="prod-mentoring",
            name="Product Strategy Mentoring",
            description="One-hour private strategy call with follow-up playbook and recordings.",
            category="sessions",
            price=180.0,
            delivery_method="video-call",
            available=10,
            tags=["product", "strategy", "coaching"],
            availability=[
                schemas.AvailabilitySlot(
                    id="slot-morning",
                    start_time=(slots_base + timedelta(days=1)).replace(hour=9, minute=0, second=0, microsecond=0),
                    duration_minutes=60,
                    capacity=5,
                    booked=0,
                    price=180.0,
                ),
                schemas.AvailabilitySlot(
                    id="slot-late",
                    start_time=(slots_base + timedelta(days=2)).replace(hour=21, minute=0, second=0, microsecond=0),
                    duration_minutes=60,
                    capacity=5,
                    booked=0,
                    price=195.0,
                ),
            ],
            created_at=now,
            updated_at=now,
        ).model_dump(),
    ]
