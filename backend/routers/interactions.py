from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import auth, crud, schemas # Import schemas
from ..database import get_db
from typing import Optional, List, Dict



router = APIRouter(
    tags=["Interactions"]
)

from fastapi import Request

@router.post("/ask")
async def ask_question(
    request: Request,  
    db: Session = Depends(get_db),
    current_user: Optional[dict] = Depends(auth.get_current_user)
):
    try:
        body = await request.json()
        print("🔥 Incoming request body:", body)
        parsed_request = schemas.AskRequest(**body)
    except Exception as e:
        print("❌ Invalid or malformed input:", e)
        raise HTTPException(status_code=422, detail="Invalid input format")
    
    return await crud.get_answer(db=db, request=parsed_request, user=current_user)


@router.post("/summarize")
async def summarize_document(request: schemas.DocumentRequest, db: Session = Depends(get_db)):
    return await crud.get_summary(db=db, request=request)

@router.post("/generate-quiz", response_model=schemas.Quiz)
async def generate_quiz(request: schemas.DocumentRequest, db: Session = Depends(get_db), current_user: dict = Depends(auth.get_current_user)):
    if not current_user:
        raise HTTPException(status_code=401, detail="Authentication required to generate a quiz")
    return await crud.create_quiz(db=db, request=request)

@router.post("/submit-quiz", status_code=201)
def submit_quiz(
    request: schemas.SubmitQuizRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(auth.get_current_user)
):
    if not current_user:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    user = crud.get_user_from_db(db, current_user["email"])
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    crud.save_quiz_attempt(db=db, user_id=user.id, request=request)
    return {"message": "Quiz attempt saved successfully."}


@router.get("/documents/{document_id}/quiz-history", response_model=List[schemas.QuizAttemptResponse])
def get_quiz_history(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(auth.get_current_user)
):
    if not current_user:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    user = crud.get_user_from_db(db, current_user["email"])
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    return crud.get_quiz_history_for_document(db=db, user_id=user.id, document_id=document_id)

@router.delete("/documents/{document_id}/chat", status_code=200)
def delete_chat_for_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(auth.get_current_user)
):
    if not current_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required")
    user = crud.get_user_from_db(db, current_user["email"])
    return crud.delete_chat_history(db=db, document_id=document_id, user_id=user.id)


@router.delete("/documents/{document_id}/quizzes", status_code=200)
def delete_all_quizzes_for_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(auth.get_current_user)
):
    if not current_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required")
    user = crud.get_user_from_db(db, current_user["email"])
    return crud.delete_all_quiz_history(db=db, document_id=document_id, user_id=user.id)

@router.delete("/quiz-attempts/{attempt_id}", status_code=200)
def delete_single_quiz(
    attempt_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(auth.get_current_user)
):
    if not current_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required")
    user = crud.get_user_from_db(db, current_user["email"])
    return crud.delete_single_quiz_attempt(db=db, attempt_id=attempt_id, user_id=user.id)

class DeleteMultipleRequest(schemas.BaseModel):
    attempt_ids: List[int]

@router.post("/quiz-attempts/delete-multiple", status_code=200)
def delete_multiple_quizzes(
    request: DeleteMultipleRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(auth.get_current_user)
):
    if not current_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required")
    user = crud.get_user_from_db(db, current_user["email"])
    return crud.delete_multiple_quiz_attempts(db=db, attempt_ids=request.attempt_ids, user_id=user.id)

