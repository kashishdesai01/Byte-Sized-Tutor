# test_db.py
from database import engine, Base
import models

print("Attempting to connect to the database and create tables...")
try:
    Base.metadata.create_all(bind=engine)
    print("\nSUCCESS: Tables created successfully in the database!")
    print("You can now verify them in Postico.")
except Exception as e:
    print("\nERROR: An error occurred during table creation.")
    print(f"--> {e}")