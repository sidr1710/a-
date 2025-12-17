# Digital Products Booking Platform

A lightweight FastAPI-powered ecommerce API focused on booking and delivering digital products such as downloads, live sessions, and licenses.

## Features
- **Product catalog** with categories, tags, search, and optional scheduled availability windows.
- **Booking flow** that reserves general inventory or a specific timeslot and returns delivery codes/links.
- **Seed data** for quick exploration (courses, downloadable packs, and mentoring sessions).
- **JSON persistence** using a simple, file-based datastore.

## Getting started
1. Create and activate a virtual environment (optional but recommended):
   ```bash
   python -m venv .venv
   source .venv/bin/activate
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the API locally:
   ```bash
   uvicorn app.main:app --reload
   ```
4. Open the interactive docs at [http://localhost:8000/docs](http://localhost:8000/docs) to explore endpoints.

## API highlights
- `GET /products` — browse products with optional `category`, `tag`, or `search` filters.
- `POST /products` — add a new digital product with availability slots.
- `POST /products/{product_id}/book` — reserve inventory or a timeslot for a customer and receive a delivery link.
- `GET /bookings` — list bookings, filtered by `email` when provided.
- `GET /health` — simple readiness probe.

## Running tests
```bash
pytest
```
