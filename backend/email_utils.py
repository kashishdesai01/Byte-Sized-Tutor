import os
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from dotenv import load_dotenv

load_dotenv()

conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv("MAIL_USERNAME"),
    MAIL_PASSWORD=os.getenv("MAIL_PASSWORD"),
    MAIL_FROM=os.getenv("MAIL_FROM"),
    MAIL_PORT=int(os.getenv("MAIL_PORT", 587)),
    MAIL_SERVER=os.getenv("MAIL_SERVER"),
    MAIL_STARTTLS=os.getenv("MAIL_STARTTLS", "True").lower() == "true",
    MAIL_SSL_TLS=os.getenv("MAIL_SSL_TLS", "False").lower() == "true",
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)

async def send_password_reset_email(email: str, token: str):
    """
    Sends a password reset email to the user with a unique token link.
    """
    frontend_url = "http://localhost:5173" 
    reset_link = f"{frontend_url}/reset-password?token={token}"
    
    html_content = f"""
    <html>
        <body>
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2>Password Reset Request</h2>
                <p>Hi,</p>
                <p>You recently requested to reset your password for your AI Study Buddy account.</p>
                <p>Please click the button below to set a new password. This link is only valid for 15 minutes.</p>
                <a href="{reset_link}" style="background-color: #06b6d4; color: white; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 5px; margin: 10px 0;">
                    Reset Your Password
                </a>
                <p>If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
                <p>Thanks,<br>The AI Study Buddy Team</p>
            </div>
        </body>
    </html>
    """
    
    message = MessageSchema(
        subject="Your AI Study Buddy Password Reset Link",
        recipients=[email],
        body=html_content,
        subtype="html"
    )
    
    fm = FastMail(conf)
    await fm.send_message(message)