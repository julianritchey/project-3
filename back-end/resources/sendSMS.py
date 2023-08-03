# a third-party SMS gateway service: https://www.twilio.com/en-us/messaging

# Download the helper library from https://www.twilio.com/docs/python/install
import os
from twilio.rest import Client
from dotenv import load_dotenv
load_dotenv()


def sms_alert(body, client_phone_number, auth_token, our_twilio_number, account_sid):
    # Find your Account SID and Auth Token at twilio.com/console
    # and set the environment variables. See http://twil.io/secure
    
    # account_sid = os.getenv('TWILIO_SMS_SID')
    # auth_token = os.getenv('TWILIO_SMS_AUTH_TOKEN')
    # our_twilio_number = os.getenv('TWILIO_SMS_NUMBER')

    client = Client(account_sid, auth_token)

    message = client.messages.create(
        body=body,
        from_=our_twilio_number,
        to=client_phone_number
    )

    print(message.sid)


if __name__ == '__main__':
    client_number = os.getenv('test_phone_number')
    print(client_number)
    sms_alert(client_number)