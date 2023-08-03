# reference: https://10mohi6.medium.com/super-easy-python-discord-notifications-api-and-webhook-9c2d85ffced9
import requests
import os
from dotenv import load_dotenv
from discordwebhook import Discord
load_dotenv()

# Send message to channel


def send_notification(url):
    # send message for our club and community
    discord = Discord(url=url)
    discord.post(content="Hello, welcome to Investor's Dream.")


if __name__ == '__main__':
    url = os.getenv("webHook_url")
    send_notification(url)
