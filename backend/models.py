
from sqlalchemy import Column, Integer, String, ForeignKey, Text, DateTime, Float, Boolean
from sqlalchemy.orm import relationship
from .database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    name = Column(String, index=True)
    documents = relationship("Document", back_populates="owner")
    chat_messages = relationship("ChatHistory", back_populates="user")
    quiz_attempts = relationship("QuizAttempt", back_populates="user")
    flashcard_sets = relationship("FlashcardSet", back_populates="user", cascade="all, delete-orphan")
    


class Document(Base):
    __tablename__ = "documents"
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, index=True, nullable=False)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    owner = relationship("User", back_populates="documents")
    chat_messages = relationship("ChatHistory", back_populates="document", cascade="all, delete-orphan")
    # FIXED: This relationship was missing, causing the error.
    quiz_attempts = relationship("QuizAttempt", back_populates="document", cascade="all, delete-orphan")
    flashcard_sets = relationship("FlashcardSet", back_populates="document", cascade="all, delete-orphan")  # ✅ Added



class ChatHistory(Base):
    __tablename__ = "chat_history"
    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    role = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    document = relationship("Document", back_populates="chat_messages")
    user = relationship("User", back_populates="chat_messages")

class QuizAttempt(Base):
    __tablename__ = "quiz_attempts"
    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    score = Column(Float, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    document = relationship("Document", back_populates="quiz_attempts")
    user = relationship("User", back_populates="quiz_attempts")
    answers = relationship("QuizAnswer", back_populates="attempt", cascade="all, delete-orphan")

class QuizAnswer(Base):
    __tablename__ = "quiz_answers"
    id = Column(Integer, primary_key=True, index=True)
    attempt_id = Column(Integer, ForeignKey("quiz_attempts.id"), nullable=False)
    question_text = Column(Text, nullable=False)
    selected_answer = Column(Text, nullable=False)
    correct_answer = Column(Text, nullable=False)
    is_correct = Column(Boolean, nullable=False)
    
    attempt = relationship("QuizAttempt", back_populates="answers")

class FlashcardSet(Base):
    __tablename__ = "flashcard_sets"
    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, default="Flashcards")
    timestamp = Column(DateTime, default=datetime.utcnow)

    document = relationship("Document", back_populates="flashcard_sets")
    user = relationship("User", back_populates="flashcard_sets")
    cards = relationship("Flashcard", back_populates="flashcard_set", cascade="all, delete-orphan")

class Flashcard(Base):
    __tablename__ = "flashcards"
    id = Column(Integer, primary_key=True, index=True)
    set_id = Column(Integer, ForeignKey("flashcard_sets.id"), nullable=False)
    front = Column(Text, nullable=False)
    back = Column(Text, nullable=False)

    flashcard_set = relationship("FlashcardSet", back_populates="cards")