from __future__ import annotations

from fastapi.testclient import TestClient

from app.main import create_app


def get_client(tmp_path):
    app = create_app(tmp_path / "store.json")
    return TestClient(app)


def test_lists_seed_products(tmp_path):
    client = get_client(tmp_path)
    response = client.get("/products")
    assert response.status_code == 200
    products = response.json()
    ids = {product["id"] for product in products}
    assert "prod-course-design" in ids
    assert "prod-audio-pack" in ids


def test_booking_reduces_inventory(tmp_path):
    client = get_client(tmp_path)
    product = client.get("/products/prod-audio-pack").json()
    starting_available = product["available"]

    booking_payload = {
        "customer_email": "sam@example.com",
        "customer_name": "Sam",
        "quantity": 2,
    }
    booking = client.post("/products/prod-audio-pack/book", json=booking_payload)
    assert booking.status_code == 201

    updated = client.get("/products/prod-audio-pack").json()
    assert updated["available"] == starting_available - 2
    assert booking.json()["delivery_link"].startswith("https://deliver.local/")


def test_slot_booking_decrements_capacity(tmp_path):
    client = get_client(tmp_path)
    product = client.get("/products/prod-course-design").json()
    slot = next(item for item in product["availability"] if item["id"] == "slot-weekend")
    starting_booked = slot["booked"]

    payload = {
        "customer_email": "jamie@example.com",
        "customer_name": "Jamie",
        "quantity": 3,
        "slot_id": "slot-weekend",
    }
    response = client.post("/products/prod-course-design/book", json=payload)
    assert response.status_code == 201

    refreshed = client.get("/products/prod-course-design").json()
    refreshed_slot = next(item for item in refreshed["availability"] if item["id"] == "slot-weekend")
    assert refreshed_slot["booked"] == starting_booked + 3
    assert refreshed_slot["capacity"] >= refreshed_slot["booked"]
