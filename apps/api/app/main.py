import os
from typing import Union

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


def _get_cors_origins() -> list[str]:
    raw_origins = (
        os.getenv("CORS_ORIGINS")
        or os.getenv("CORS_ORIGIN")
        or "http://localhost:3000"
    )
    return [origin.strip() for origin in raw_origins.split(",") if origin.strip()]

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=_get_cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}
