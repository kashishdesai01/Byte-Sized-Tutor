from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from typing import List
from .. import auth, crud, schemas
from ..database import get_db

router = APIRouter(
    prefix="/flashcards",
    tags=["Flashcards"]
)

@router.post("/generate", response_model=schemas.FlashcardSetResponse)
async def generate_flashcards(
    request: schemas.DocumentRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(auth.get_current_user)
):
    if not current_user:
        raise HTTPException(status_code=401, detail="Authentication required")
    user = crud.get_user_from_db(db, current_user["email"])
    return await crud.create_flashcards(db=db, document_id=request.document_id, user_id=user.id)

@router.get("/document/{document_id}", response_model=List[schemas.FlashcardSetResponse])
def get_flashcard_sets(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(auth.get_current_user)
):
    if not current_user:
        raise HTTPException(status_code=401, detail="Authentication required")
    user = crud.get_user_from_db(db, current_user["email"])
    return crud.get_flashcard_sets_for_document(db=db, user_id=user.id, document_id=document_id)


@router.delete("/set/{set_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_flashcard_set(
    set_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(auth.get_current_user)
):
    """Delete a specific flashcard set."""
    if not current_user:
        raise HTTPException(status_code=401, detail="Authentication required")
    user = crud.get_user_from_db(db, current_user["email"])
    crud.delete_flashcard_set(db=db, set_id=set_id, user_id=user.id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)

@router.post("/delete-multiple", status_code=status.HTTP_204_NO_CONTENT)
def delete_multiple_flashcard_sets(
    request: schemas.DeleteItemsRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(auth.get_current_user)
):
    """Delete multiple flashcard sets by their IDs."""
    if not current_user:
        raise HTTPException(status_code=401, detail="Authentication required")
    user = crud.get_user_from_db(db, current_user["email"])
    crud.delete_multiple_flashcard_sets(db=db, item_ids=request.item_ids, user_id=user.id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)

@router.delete("/document/{document_id}/all", status_code=status.HTTP_204_NO_CONTENT)
def delete_all_flashcard_sets_for_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(auth.get_current_user)
):
    """Delete all flashcard sets associated with a specific document."""
    if not current_user:
        raise HTTPException(status_code=401, detail="Authentication required")
    user = crud.get_user_from_db(db, current_user["email"])
    crud.delete_all_flashcard_sets_for_document(db=db, document_id=document_id, user_id=user.id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)