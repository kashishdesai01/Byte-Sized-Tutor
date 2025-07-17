# Byte Sized Tutor  Tutor: Your Personal AI-Powered Learning Assistant

<p align="center">
  <strong>Transform any document into an interactive learning experience. Chat with your PDFs, generate quizzes, create flashcards, and track your progress—all in one place.</strong>
</p>

<p align="center">
  <img alt="Python" src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white">
  <img alt="FastAPI" src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white">
  <img alt="React" src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black">
  <img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white">
</p>

---

## Project Overview

Byte Sized Tutor is a full-stack web application designed to enhance the learning process by transforming static documents into interactive study materials. It leverages a Retrieval-Augmented Generation (RAG) pipeline to allow users to chat with their documents, test their knowledge with auto-generated quizzes, and create flashcards for key concepts.

This project demonstrates an end-to-end implementation of a modern AI system, from data ingestion and processing on the backend to a dynamic, user-friendly interface on the frontend.

## Core Features

* **📄 PDF & DOCX Document Processing:** Users can upload documents to create a personalized knowledge base for the application to work with.
* **💬 Context-Aware Conversational Chat:** Engage in a dialogue with your documents. The system uses a RAG pipeline to provide answers based on the provided text and maintains conversation history for follow-up questions.
* **🧠 Automated Quiz Generation:** Generate multiple-choice quizzes on-demand from the document's content to validate understanding.
* **📇 On-Demand Flashcard Creation:** Automatically create flashcard sets for key terms and concepts found within the documents.
* **📈 Quiz Performance Tracking & Visualization:** A progress dashboard tracks quiz scores over time, displaying key metrics like average score, highest score, and a performance trend chart.
* **🔒 JWT-Based User Authentication:** A complete user management system with registration, login, and a secure "Forgot Password" email flow using JSON Web Tokens.

## Architecture & Tech Stack

This project was built using a modern, robust technology stack, showcasing skills in both backend and frontend development.

| Area       | Technology                                                                                                                                     |
| :--------- | :--------------------------------------------------------------------------------------------------------------------------------------------- |
| **Backend** | ![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white) **FastAPI**, **SQLAlchemy**, **PostgreSQL** |
| **Frontend** | ![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black) **Tailwind CSS**, **Chart.js** |
| **AI / ML** | **LangChain**, **Google Gemini**, **Hugging Face Embeddings**, **FAISS** (Vector Store)                                                      |
| **Auth** | **JWT** (JSON Web Tokens), **OAuth2**, **Passlib** (Hashing)                                                                                     |

## Local Development Setup

To run this project locally, you will need to set up the backend server and the frontend client separately.

### Prerequisites

* Python 3.10+
* Node.js and npm
* A running PostgreSQL database instance

### Backend Setup

1.  **Navigate to the `backend` directory:**
    ```bash
    cd backend
    ```
2.  **Create and activate a virtual environment:**
    ```bash
    python -m venv .venv
    source .venv/bin/activate
    ```
3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
    *(Note: You may need to create a `requirements.txt` file first by running `pip freeze > requirements.txt`)*
4.  **Set up environment variables:**
    * Create a `.env` file in the `backend` directory.
    * Add your `DATABASE_URL`, `SECRET_KEY`, and `MAIL_` settings.
5.  **Run the server from the project root directory:**
    ```bash
    # From the /AI_Study_Buddy/ directory
    uvicorn backend.main:app --reload
    ```
    The backend will be running at `http://127.0.0.1:8000`.

### Frontend Setup

1.  **Navigate to the `frontend` directory:**
    ```bash
    cd frontend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Start the development server:**
    ```bash
    npm start
    ```
    The frontend will open in your browser, usually at `http://localhost:3000` or `http://localhost:5173`.

## Future Work

This project has a strong foundation with many possibilities for future expansion:

* **Multi-Document Chat:** Allow users to select multiple documents and ask comparative questions across them.
* **Streaming Responses:** Implement real-time, token-by-token streaming for the chat interface to improve user experience.
* **Google Login:** Integrate Google OAuth for a seamless, one-click login experience.
* **Expanded Document Support:** Add support for more file types, such as `.txt`, `.pptx`, and YouTube video transcripts.

---
*This project was created to demonstrate a comprehensive understanding of full-stack AI application development. Feel free to connect!*
