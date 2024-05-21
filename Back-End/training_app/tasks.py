from celery import shared_task
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import os


@shared_task
def sending_mail(to, subject, html_content):
    FROM = 'skhantanda@gmail.com'
    PASSWORD = 'pucx rhet pdvq vulh'
    
    if not FROM or not PASSWORD:
        raise ValueError("Email credentials not found in environment variables.")
    
    # Create a MIMEMultipart object
    message = MIMEMultipart('alternative')
    message['From'] = FROM
    message['To'] = to
    message['Subject'] = subject

    # Attach the HTML content to the message
    html_part = MIMEText(html_content, 'html')
    message.attach(html_part)

    try:
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
            server.login(FROM, PASSWORD)
            server.sendmail(from_addr=FROM, to_addrs=to, msg=message.as_string())
    except smtplib.SMTPException as e:
        print(f"Failed to send email: {e}")