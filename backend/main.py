from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import authentication, documents, interactions, flashcards


Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Study Buddy API (Refactored)",
    description="A modular and scalable API for the AI Study Buddy application.",
    version="3.0.0",
)


origins = ["http://localhost:5173", "http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(authentication.router)
app.include_router(documents.router)
app.include_router(interactions.router)
app.include_router(flashcards.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the AI Study Buddy API!"}
