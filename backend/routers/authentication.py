# backend/routers/authentication.py
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from .. import models, auth, schemas, email_utils, crud  # Import schemas
from ..database import get_db

router = APIRouter(
    tags=["Authentication"]
)

# @router.post("/register/", status_code=201)
# def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
#     db_user = db.query(models.User).filter(models.User.email == user.email).first()
#     if db_user:
#         raise HTTPException(status_code=400, detail="Email already registered")
#     hashed_password = auth.get_password_hash(user.password)
#     db_user = models.User(email=user.email, hashed_password=hashed_password)
#     db.add(db_user)
#     db.commit()
#     db.refresh(db_user)
#     return {"message": "User created successfully"}

# @router.post("/register/", status_code=201)
# def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
#     db_user = db.query(models.User).filter(models.User.email == user.email).first()
#     if db_user:
#         raise HTTPException(status_code=400, detail="Email already registered")
    
#     hashed_password = auth.get_password_hash(user.password)
    
#     # ✅ UPDATE THIS LINE to include the name
#     db_user = models.User(
#         email=user.email, 
#         hashed_password=hashed_password, 
#         name=user.name
#     )
    
#     db.add(db_user)
#     db.commit()
#     db.refresh(db_user)
#     return {"message": "User created successfully"}

@router.post("/register/", response_model=schemas.Token, status_code=201)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = auth.get_password_hash(user.password)
    
    db_user = models.User(
        email=user.email, 
        hashed_password=hashed_password, 
        name=user.name
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    # ✅ 2. Create and return a token immediately after creating the user
    access_token = auth.create_access_token(data={"sub": db_user.email, "id": db_user.id})
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/token", response_model=schemas.Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect email or password", headers={"WWW-Authenticate": "Bearer"})
    access_token = auth.create_access_token(data={"sub": user.email, "id": user.id})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/forgot-password")
async def forgot_password(request: schemas.ForgotPasswordRequest, db: Session = Depends(get_db)):
    """
    Handles a forgot password request. Finds the user and sends a reset email if they exist.
    """
    user = crud.get_user_from_db(db, email=request.email)
    if user:
        # User exists, so we generate a token and send the reset email.
        token = auth.create_password_reset_token(email=user.email)
        await email_utils.send_password_reset_email(email=user.email, token=token)
    
    # IMPORTANT: Always return a generic success message.
    # This prevents attackers from using this endpoint to check if an email is registered.
    return {"message": "If an account with that email exists, a password reset link has been sent."}


@router.post("/reset-password")
def reset_password(request: schemas.ResetPasswordRequest, db: Session = Depends(get_db)):
    """
    Handles the actual password reset using the token from the email link.
    """
    # Verify the token is valid, not expired, and for the right purpose.
    email = auth.verify_password_reset_token(token=request.token)
    
    user = crud.get_user_from_db(db, email=email)
    if not user:
        # This case should rarely happen if the token is valid, but it's good practice.
        raise HTTPException(status_code=404, detail="User not found")
    
    # Update the user's password using the new CRUD function.
    crud.update_user_password(db=db, user=user, new_password=request.new_password)
    
    return {"message": "Password has been reset successfully."}