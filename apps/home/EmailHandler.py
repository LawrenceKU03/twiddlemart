from django.conf import settings

from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import smtplib

# FACADE


class EmailHandler:
    def __init__(self, recipients, subject, msg, html_msg=""):
        self.sender = settings.EMAIL_HOST_USER
        self.recipients = recipients
        self.subject = subject
        self.msg = msg
        self.html_msg = html_msg

    def send_mail(self):
        msg = MIMEMultipart("alternative")
        msg["From"] = self.sender
        msg["To"] = ",".join(self.recipients)
        msg["Subject"] = self.subject
        text = MIMEText(self.msg, "plain")
        html = MIMEText(self.html_msg, "html")
        msg.attach(text)
        msg.attach(html)
        smtp_server = smtplib.SMTP_SSL(
            settings.EMAIL_HOST, settings.EMAIL_PORT)
        smtp_server.login(self.sender, settings.EMAIL_HOST_PASSWORD)
        smtp_server.sendmail(self.sender, self.recipients, msg.as_string())
        smtp_server.quit()
