from __future__ import annotations

from pathlib import Path
from typing import Optional

from fastapi import Depends, FastAPI, Query, Request

from . import schemas, services
from .storage import DataStore


def get_store(request: Request) -> DataStore:
    return request.app.state.store  # type: ignore[attr-defined]


def create_app(data_path: Optional[Path] = None) -> FastAPI:
    app = FastAPI(
        title="Digital Products Booking API",
        description="A lightweight ecommerce layer for reserving and delivering digital products.",
        version="1.0.0",
    )

    store = DataStore(data_path or Path("data/store.json"))
    store.seed_if_empty(services.seed_default_products())
    app.state.store = store

    @app.get("/health", response_model=schemas.Health)
    def health() -> schemas.Health:
        return schemas.Health(message="Digital booking platform ready")

    @app.get("/products", response_model=list[schemas.Product])
    def get_products(
        category: Optional[str] = None,
        tag: Optional[str] = None,
        search: Optional[str] = Query(None, description="Search by product name or description"),
        store: DataStore = Depends(get_store),
    ) -> list[schemas.Product]:
        return services.list_products(store, category=category, tag=tag, search=search)

    @app.post("/products", response_model=schemas.Product, status_code=201)
    def create_product(
        payload: schemas.ProductCreate,
        store: DataStore = Depends(get_store),
    ) -> schemas.Product:
        return services.create_product(store, payload)

    @app.get("/products/{product_id}", response_model=schemas.Product)
    def retrieve_product(product_id: str, store: DataStore = Depends(get_store)) -> schemas.Product:
        return services.get_product(store, product_id)

    @app.patch("/products/{product_id}", response_model=schemas.Product)
    def modify_product(
        product_id: str,
        payload: schemas.ProductUpdate,
        store: DataStore = Depends(get_store),
    ) -> schemas.Product:
        return services.update_product(store, product_id, payload)

    @app.post("/products/{product_id}/book", response_model=schemas.BookingResponse, status_code=201)
    def book_product(
        product_id: str,
        payload: schemas.BookingRequest,
        store: DataStore = Depends(get_store),
    ) -> schemas.BookingResponse:
        booking = services.book_product(store, product_id, payload)
        delivery_link = f"https://deliver.local/{booking.delivery_code}"
        return schemas.BookingResponse(**booking.model_dump(), delivery_link=delivery_link)

    @app.get("/bookings", response_model=list[schemas.Booking])
    def get_bookings(
        email: Optional[str] = Query(None, description="Filter by customer email"),
        store: DataStore = Depends(get_store),
    ) -> list[schemas.Booking]:
        return services.list_bookings(store, email=email)

    return app


app = create_app()


__all__ = ["app", "create_app"]
