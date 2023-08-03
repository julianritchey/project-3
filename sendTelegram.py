# Reference: https://medium.com/codex/using-python-to-send-telegram-messages-in-3-simple-steps-419a8b5e5e2
import requests
import os
from dotenv import load_dotenv
load_dotenv()


def get_userId(TOKEN):
    # Getting your (client's) chat ID
    #  This chat ID will be used in function ---> send_one_message(TOKEN, chat_id, message)
    url = f"https://api.telegram.org/bot{TOKEN}/getUpdates"
    print(requests.get(url).json())
    # Note: if you don’t send your Telegram bot a message, your results might be empty
    # Q: How to get the user's Id ?


# Sending your Telegram message using Python

def send_one_message(TOKEN, chat_id, message):
    url = f"https://api.telegram.org/bot{TOKEN}/sendMessage?chat_id={chat_id}&text={message}"
    print(requests.get(url).json())  # this sends the message


if __name__ == '__main__':
    TOKEN = os.getenv('teleToken')
    chat_id = os.getenv("test_teleID")
    message = "hello from your telegram bot"
    send_one_message(TOKEN, chat_id, message)
    get_userId(TOKEN)
