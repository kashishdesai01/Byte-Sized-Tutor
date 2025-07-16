# backend/schemas.py
from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from datetime import datetime

# --- User & Auth Schemas ---
class UserCreate(BaseModel):
    name: str  
    email: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str

# --- Document Schemas ---
class DocumentResponse(BaseModel):
    id: int
    filename: str
    owner_id: Optional[int] = None
    class Config:
        from_attributes = True

# --- Chat History Schemas ---
# This is for sending data TO the frontend
class ChatMessage(BaseModel):
    id: int
    role: str
    content: str
    timestamp: datetime
    class Config:
        from_attributes = True

# NEW: This is for receiving data FROM the frontend
class ChatMessageInput(BaseModel):
    role: str
    content: str
    # Making id and timestamp optional because they aren't needed for the ask logic
    id: Optional[int] = None
    timestamp: Optional[datetime] = None

class AskRequest(BaseModel):
    question: str
    document_ids: List[int] # Changed from single int to a list of ints
    chat_history: Optional[List[ChatMessageInput]] = None

class DocumentRequest(BaseModel):
    document_id: int

# --- Quiz Schemas ---
class QuizQuestion(BaseModel):
    question: str
    options: List[str]
    correct_answer: str
    explanation: str

class Quiz(BaseModel):
    questions: List[QuizQuestion]

class UserAnswer(BaseModel):
    question_text: str
    selected_answer: str
    correct_answer: str
    is_correct: bool

class SubmitQuizRequest(BaseModel):
    document_id: int
    answers: List[UserAnswer]
    score: float

class QuizAnswerResponse(BaseModel):
    id: int
    question_text: str
    selected_answer: str
    correct_answer: str
    is_correct: bool
    class Config:
        from_attributes = True

class QuizAttemptResponse(BaseModel):
    id: int
    score: float
    timestamp: datetime
    answers: List[QuizAnswerResponse]
    class Config:
        from_attributes = True

class FlashcardBase(BaseModel):
    front: str
    back: str

class FlashcardCreate(FlashcardBase):
    pass

class FlashcardResponse(FlashcardBase):
    id: int
    set_id: int
    class Config:
        from_attributes = True

class FlashcardSetResponse(BaseModel):
    id: int
    title: str
    timestamp: datetime
    cards: List[FlashcardResponse]
    class Config:
        from_attributes = True

class DeleteItemsRequest(BaseModel):
    """A generic schema for deleting multiple items by a list of their IDs."""
    item_ids: List[int]

class ForgotPasswordRequest(BaseModel):
    email: str

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

class ScoreOverTime(BaseModel):
    timestamp: datetime
    score: float

class ProgressReportResponse(BaseModel):
    total_quizzes_taken: int
    average_score: Optional[float] = None
    highest_score: Optional[float] = None
    scores_over_time: List[ScoreOverTime]
