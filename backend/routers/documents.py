# backend/routers/documents.py
from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from sqlalchemy.orm import Session
from typing import List, Optional
from .. import models, auth, crud, schemas # Import schemas
from ..database import get_db

router = APIRouter(
    prefix="/documents",
    tags=["Documents"]
)

@router.post("/upload", response_model=schemas.DocumentResponse)
async def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: Optional[dict] = Depends(auth.get_current_user)
):
    return await crud.create_document(db=db, file=file, user=current_user)

@router.get("/", response_model=List[schemas.DocumentResponse])
def get_user_documents(
    db: Session = Depends(get_db),
    current_user: dict = Depends(auth.get_current_user)
):
    if not current_user:
        raise HTTPException(status_code=401, detail="Authentication required")
    return crud.get_user_documents(db=db, user_email=current_user["email"])


# ... (upload and get_user_documents endpoints remain the same)

# NEW: Endpoint to get chat history for a document
@router.get("/{document_id}/history", response_model=List[schemas.ChatMessage])
def get_document_chat_history(
    document_id: int,
    db: Session = Depends(get_db),
    # This could be protected if you only want owners to see history
    # current_user: Optional[dict] = Depends(auth.get_current_user) 
):
    # For now, we'll keep it public
    return crud.get_chat_history(db=db, document_id=document_id)

@router.delete("/{document_id}", status_code=200)
def delete_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(auth.get_current_user)
):
    if not current_user:
        raise HTTPException(status_code=401, detail="Authentication required")
    user = crud.get_user_from_db(db, current_user["email"])
    return crud.delete_document(db=db, document_id=document_id, user_id=user.id)

@router.get("/{document_id}/progress-report", response_model=schemas.ProgressReportResponse)
def get_document_progress_report(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(auth.get_current_user)
):
    if not current_user:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    user = crud.get_user_from_db(db, current_user["email"])
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return crud.get_progress_report_for_document(db=db, user_id=user.id, document_id=document_id)