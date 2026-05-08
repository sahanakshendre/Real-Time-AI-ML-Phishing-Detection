import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv

load_dotenv()

class EmailService:
    def __init__(self):
        # Configure for Gmail SMTP
        self.smtp_server = "smtp.gmail.com"
        self.smtp_port = 587

    def send_phishing_alert(self, recipient_email: str, url: str, confidence: float, sender_email: str = None, sender_password: str = None):
        """Send a real email alert when phishing is detected."""
        from_email = sender_email
        from_password = sender_password
        
        print(f"\n[EMAIL SERVICE] Attempting to send email:")
        print(f"  From: {from_email}")
        print(f"  To: {recipient_email}")
        print(f"  SMTP Server: {self.smtp_server}:{self.smtp_port}")
        
        if not from_email or not from_password:
            print(f"[ERROR] Email service not configured. Missing sender email or password.")
            print(f"  from_email: {from_email}")
            print(f"  from_password: {'***' if from_password else 'MISSING'}")
            return False

        try:
            message = MIMEMultipart()
            message["From"] = from_email
            message["To"] = recipient_email
            message["Subject"] = f"🚨 Security Alert: Phishing URL Detected ({confidence}% confidence)"

            body = f"""
            <html>
              <body style="font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px;">
                <div style="background: #fff; border-left: 4px solid #ff5274; padding: 20px; border-radius: 8px;">
                  <h2 style="color: #ff5274; margin: 0 0 10px;">⚠️ Phishing Alert</h2>
                  <p>A suspicious URL has been detected and blocked by Cyber Sentinel:</p>
                  
                  <div style="background: #f9f9f9; padding: 15px; border-radius: 6px; margin: 15px 0; word-break: break-all;">
                    <strong>URL:</strong><br/>
                    <code style="color: #666;">{url}</code>
                  </div>
                  
                  <p><strong>Threat Level:</strong> <span style="color: #ff5274; font-weight: bold;">{confidence}% Confidence</span></p>
                  
                  <p style="color: #666; margin-top: 20px;">
                    <strong>Recommendation:</strong> Do not click on or open this link. 
                    Delete any emails containing this URL.
                  </p>
                  <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                  <p style="color: #999; font-size: 12px;">
                    This is an automated alert from Cyber Sentinel AI/ML Phishing Detection System.
                    If you didn't authorize this detection, please contact your administrator.
                  </p>
                </div>
              </body>
            </html>
            """

            message.attach(MIMEText(body, "html"))

            print(f"[EMAIL SERVICE] Connecting to SMTP server...")
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                print(f"[EMAIL SERVICE] Starting TLS...")
                server.starttls()
                print(f"[EMAIL SERVICE] Logging in...")
                server.login(from_email, from_password)
                print(f"[EMAIL SERVICE] Sending message...")
                server.send_message(message)
            
            print(f"[SUCCESS] Email sent successfully to {recipient_email}")
            return True

        except smtplib.SMTPAuthenticationError as e:
            print(f"[ERROR] SMTP Authentication failed: {str(e)}")
            print(f"  Check your Gmail app password is correct (16 characters)")
            return False
        except smtplib.SMTPException as e:
            print(f"[ERROR] SMTP error: {str(e)}")
            return False
        except Exception as e:
            print(f"[ERROR] Email sending failed: {type(e).__name__}: {str(e)}")
            import traceback
            traceback.print_exc()
            return False
