import smtplib
from email.message import EmailMessage
import os
from dotenv import load_dotenv
load_dotenv()


def email_alert(subject, body, to):
    msg = EmailMessage()
    msg.set_content(body)
    msg['subject'] = subject
    msg['to'] = to

    user = os.getenv("our_email")
    msg['from'] = user
    password = os.getenv("our_password")

    server = smtplib.SMTP("smtp.gmail.com", 587)
    server.starttls()
    server.login(user, password)
    server.send_message(msg)
    server.quit()


if __name__ == '__main__':
    client_email = "806981384wl@gmail.com"
    email_alert("HI", "Hello world", client_email)
