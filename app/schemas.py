from __future__ import annotations

from datetime import datetime
from typing import List, Literal, Optional

from pydantic import BaseModel, EmailStr, Field


class AvailabilitySlot(BaseModel):
    id: str
    start_time: datetime
    duration_minutes: int = Field(..., gt=0)
    capacity: int = Field(..., gt=0)
    booked: int = Field(0, ge=0)
    price: Optional[float] = Field(None, ge=0)


class ProductBase(BaseModel):
    name: str
    description: str
    category: str
    price: float = Field(..., ge=0)
    delivery_method: str = Field(..., description="download, stream, or license")
    available: int = Field(10, ge=0, description="General inventory for unscheduled bookings")
    tags: List[str] = Field(default_factory=list)


class ProductCreate(ProductBase):
    availability: List[AvailabilitySlot] = Field(default_factory=list)


class Product(ProductBase):
    id: str
    availability: List[AvailabilitySlot]
    created_at: datetime
    updated_at: datetime


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    price: Optional[float] = Field(None, ge=0)
    delivery_method: Optional[str] = None
    available: Optional[int] = Field(None, ge=0)
    tags: Optional[List[str]] = None
    availability: Optional[List[AvailabilitySlot]] = None


class BookingRequest(BaseModel):
    customer_email: EmailStr
    customer_name: str = Field(..., min_length=1)
    quantity: int = Field(1, ge=1, le=20)
    slot_id: Optional[str] = Field(None, description="Optional timeslot to reserve for scheduled digital products")
    note: Optional[str] = Field(None, max_length=500)


class ProductSnapshot(BaseModel):
    name: str
    delivery_method: str
    category: str
    price: float


class Booking(BaseModel):
    id: str
    product_id: str
    slot_id: Optional[str]
    customer_email: EmailStr
    customer_name: str
    quantity: int
    total: float
    status: Literal["reserved", "confirmed"]
    reserved_at: datetime
    delivery_code: str
    delivery_notes: Optional[str] = None
    product: ProductSnapshot
    note: Optional[str] = None


class BookingResponse(Booking):
    delivery_link: Optional[str] = None


class Health(BaseModel):
    message: str
