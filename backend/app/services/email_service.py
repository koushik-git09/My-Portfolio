import asyncio
import json
import logging
import smtplib
import urllib.request
from datetime import datetime, timezone
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import Optional
from app.core.config import settings

logger = logging.getLogger("uvicorn.error")


class EmailService:
    @staticmethod
    def _create_html_content(
        name: str, email: str, subject: str, message: str, timestamp: datetime
    ) -> str:
        date_str = timestamp.strftime("%B %d, %Y at %I:%M %p UTC")
        return f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {{
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #080B12;
      color: #F8FAFC;
      margin: 0;
      padding: 24px;
    }}
    .container {{
      max-width: 600px;
      margin: 0 auto;
      background: #151C29;
      border: 1px solid #263244;
      border-radius: 16px;
      overflow: hidden;
    }}
    .header {{
      background: #111827;
      padding: 24px;
      border-bottom: 1px solid #263244;
    }}
    .badge {{
      display: inline-block;
      padding: 4px 10px;
      font-size: 11px;
      font-weight: 600;
      color: #B6FF5C;
      background: rgba(182, 255, 92, 0.12);
      border: 1px solid rgba(182, 255, 92, 0.3);
      border-radius: 6px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }}
    .title {{
      margin: 12px 0 0 0;
      font-size: 20px;
      font-weight: 700;
      color: #F8FAFC;
    }}
    .content {{
      padding: 24px;
    }}
    .field {{
      margin-bottom: 18px;
    }}
    .field-label {{
      font-size: 11px;
      font-weight: 600;
      color: #94A3B8;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      margin-bottom: 4px;
    }}
    .field-value {{
      font-size: 15px;
      color: #F8FAFC;
      font-weight: 500;
    }}
    .message-box {{
      background: #0B101A;
      border: 1px solid #263244;
      border-radius: 10px;
      padding: 16px;
      margin-top: 6px;
      font-size: 14px;
      line-height: 1.6;
      color: #E2E8F0;
      white-space: pre-wrap;
    }}
    .btn-container {{
      margin-top: 24px;
      text-align: center;
    }}
    .btn {{
      display: inline-block;
      background: #B6FF5C;
      color: #080B12 !important;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 700;
      text-decoration: none;
      box-shadow: 0 4px 14px rgba(182, 255, 92, 0.25);
    }}
    .footer {{
      background: #0B101A;
      padding: 16px 24px;
      border-top: 1px solid #263244;
      text-align: center;
      font-size: 12px;
      color: #64748B;
    }}
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <span class="badge">New Portfolio Inquiry</span>
      <h2 class="title">Message from {name}</h2>
    </div>
    <div class="content">
      <div class="field">
        <div class="field-label">Sender Name</div>
        <div class="field-value">{name}</div>
      </div>
      <div class="field">
        <div class="field-label">Email Address</div>
        <div class="field-value"><a href="mailto:{email}" style="color: #B6FF5C; text-decoration: none;">{email}</a></div>
      </div>
      <div class="field">
        <div class="field-label">Subject</div>
        <div class="field-value">{subject}</div>
      </div>
      <div class="field">
        <div class="field-label">Timestamp</div>
        <div class="field-value" style="font-size: 13px; color: #94A3B8;">{date_str}</div>
      </div>
      <div class="field">
        <div class="field-label">Message Content</div>
        <div class="message-box">{message}</div>
      </div>
      <div class="btn-container">
        <a href="mailto:{email}?subject=Re:%20{subject}" class="btn">Reply Directly to {name}</a>
      </div>
    </div>
    <div class="footer">
      Sent via your Google Antigravity Full-Stack Portfolio gateway.
    </div>
  </div>
</body>
</html>"""

    @classmethod
    def _send_via_smtp(
        cls,
        name: str,
        sender_email: str,
        subject: str,
        message_body: str,
        ts: datetime,
        target_email: str,
    ) -> bool:
        from_email = settings.SMTP_FROM_EMAIL or settings.SMTP_USER
        msg = MIMEMultipart("alternative")
        msg["Subject"] = f"[Portfolio Contact] {subject} - {name}"
        msg["From"] = f"{name} via Portfolio <{from_email}>"
        msg["To"] = target_email
        msg["Reply-To"] = sender_email

        plain_text = (
            f"New message from {name} ({sender_email}):\n\n"
            f"Subject: {subject}\n\n"
            f"Message:\n{message_body}\n\n"
            f"Sent: {ts.strftime('%Y-%m-%d %H:%M:%S UTC')}"
        )
        html_text = cls._create_html_content(name, sender_email, subject, message_body, ts)

        msg.attach(MIMEText(plain_text, "plain"))
        msg.attach(MIMEText(html_text, "html"))

        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=15) as server:
            server.ehlo()
            server.starttls()
            server.ehlo()
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.sendmail(from_email, [target_email], msg.as_string())

        logger.info(f"[Email Service] Successfully forwarded contact message to {target_email} via SMTP")
        return True

    @classmethod
    def _send_via_resend(
        cls,
        name: str,
        sender_email: str,
        subject: str,
        message_body: str,
        ts: datetime,
        target_email: str,
    ) -> bool:
        from_email = settings.SMTP_FROM_EMAIL or "onboarding@resend.dev"
        payload = {
            "from": f"{name} via Portfolio <{from_email}>",
            "to": [target_email],
            "reply_to": sender_email,
            "subject": f"[Portfolio Contact] {subject} - {name}",
            "html": cls._create_html_content(name, sender_email, subject, message_body, ts),
        }
        req = urllib.request.Request(
            "https://api.resend.com/emails",
            data=json.dumps(payload).encode("utf-8"),
            headers={
                "Authorization": f"Bearer {settings.RESEND_API_KEY}",
                "Content-Type": "application/json",
                "User-Agent": "AntigravityPortfolio/1.0",
            },
            method="POST",
        )
        with urllib.request.urlopen(req, timeout=10) as resp:
            if resp.status in (200, 201):
                logger.info(f"[Email Service] Successfully sent contact message to {target_email} via Resend")
                return True
        return False

    @classmethod
    async def send_contact_notification(
        cls,
        name: str,
        email: str,
        subject: str,
        message: str,
        timestamp: Optional[datetime] = None,
    ) -> bool:
        ts = timestamp or datetime.now(timezone.utc)
        target_email = settings.NOTIFICATION_EMAIL or "koushikgoud912@gmail.com"

        # 1. Try Resend API if key is provided
        if settings.RESEND_API_KEY:
            try:
                success = await asyncio.to_thread(
                    cls._send_via_resend, name, email, subject, message, ts, target_email
                )
                if success:
                    return True
            except Exception as exc:
                logger.error(f"[Email Service] Resend dispatch failed: {exc}")

        # 2. Try SMTP if user and password are provided
        if settings.SMTP_USER and settings.SMTP_PASSWORD:
            try:
                success = await asyncio.to_thread(
                    cls._send_via_smtp, name, email, subject, message, ts, target_email
                )
                if success:
                    return True
            except Exception as exc:
                logger.error(f"[Email Service] SMTP dispatch failed: {exc}")
                return False

        logger.info(
            f"[Email Notification Ready] A message from '{name}' <{email}> was recorded. "
            f"To deliver live alerts to {target_email}, configure SMTP_USER/SMTP_PASSWORD or RESEND_API_KEY in backend/.env"
        )
        return False


email_service = EmailService()
