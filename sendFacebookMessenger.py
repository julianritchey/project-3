import os
from twilio.rest import Client
from dotenv import load_dotenv
load_dotenv()


def messenger_alert(messenger_user_id):
    # Find your Account SID and Auth Token at twilio.com/console
    # and set the environment variables. See http://twil.io/secure
    account_sid = os.getenv('TWILIO_ACCOUNT_SID')
    auth_token = os.getenv('TWILIO_AUTH_TOKEN')
    our_facebook_page_id = os.getenv('facebook_page_id')

    client = Client(account_sid, auth_token)

    message = client.messages.create(
        body='Hi there',
        from_='messenger:' + our_facebook_page_id,
        to='messenger:' + messenger_user_id
    )

    print(message.sid)


if __name__ == '__main__':
    client_messenger = os.getenv('test_messenger_user_id')
    print(client_messenger)
    messenger_alert(client_messenger)
