from __future__ import annotations

import json
from copy import deepcopy
from pathlib import Path
from threading import Lock
from typing import Any, Dict, List, Optional


class DataStore:
    def __init__(self, path: Path):
        self.path = path
        self._lock = Lock()
        self._data: Dict[str, List[Dict[str, Any]]] = {"products": [], "bookings": []}
        self._ensure_loaded()

    def _ensure_loaded(self) -> None:
        self.path.parent.mkdir(parents=True, exist_ok=True)
        if self.path.exists():
            with self.path.open("r", encoding="utf-8") as handle:
                try:
                    payload = json.load(handle)
                except json.JSONDecodeError:
                    payload = {}
            self._data = {
                "products": payload.get("products", []),
                "bookings": payload.get("bookings", []),
            }
        else:
            self._persist()

    def _persist(self) -> None:
        temp_path = self.path.with_suffix(".tmp")
        with temp_path.open("w", encoding="utf-8") as handle:
            json.dump(self._data, handle, indent=2, default=str)
        temp_path.replace(self.path)

    def list_products(self) -> List[Dict[str, Any]]:
        with self._lock:
            return deepcopy(self._data["products"])

    def list_bookings(self, *, customer_email: Optional[str] = None) -> List[Dict[str, Any]]:
        with self._lock:
            bookings = self._data["bookings"]
            if customer_email:
                bookings = [b for b in bookings if b.get("customer_email") == customer_email]
            return deepcopy(bookings)

    def get_product(self, product_id: str) -> Optional[Dict[str, Any]]:
        with self._lock:
            for product in self._data["products"]:
                if product["id"] == product_id:
                    return deepcopy(product)
        return None

    def add_product(self, product: Dict[str, Any]) -> Dict[str, Any]:
        with self._lock:
            self._data["products"].append(product)
            self._persist()
            return deepcopy(product)

    def update_product(self, product: Dict[str, Any]) -> Dict[str, Any]:
        with self._lock:
            for idx, existing in enumerate(self._data["products"]):
                if existing["id"] == product["id"]:
                    self._data["products"][idx] = product
                    self._persist()
                    return deepcopy(product)
            raise KeyError(f"Product {product['id']} not found")

    def add_booking(self, booking: Dict[str, Any]) -> Dict[str, Any]:
        with self._lock:
            self._data["bookings"].append(booking)
            self._persist()
            return deepcopy(booking)

    def seed_if_empty(self, products: List[Dict[str, Any]]) -> None:
        with self._lock:
            if self._data["products"]:
                return
            self._data["products"] = deepcopy(products)
            self._persist()

    def reset(self) -> None:
        with self._lock:
            self._data = {"products": [], "bookings": []}
            self._persist()
