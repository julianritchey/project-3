# Import dependencies
import json
from os import environ as env
import uuid
# from urllib.parse import quote_plus, urlencode

# from authlib.integrations.flask_client import OAuth
from dotenv import find_dotenv, load_dotenv

# from dash import Dash, Input, Output, State, dcc, html
from flask import Flask, redirect, render_template, request, session, url_for
from flask_cors import CORS
# import dash
# import dash_bootstrap_components as dbc
# from pages.nav_bar import navbar

from imports import alpaca_get_asset, alpaca_get_crypto_assets, alpaca_get_us_equity_assets, email_alert, insert_into_users, select_strategies_data, select_strategy_data, select_user_data, select_users_data, sms_alert, TradingStrategies
import sqlalchemy as db
from datetime import datetime
import pandas as pd
from twilio.rest import Client

# import boto3
# import botocore.session
# from botocore.config import Config

ENV_FILE = find_dotenv()
if ENV_FILE:
    load_dotenv(ENV_FILE)

# Set style theme
# bi_css = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css'
# dbc_css = 'https://cdn.jsdelivr.net/gh/AnnMarieW/dash-bootstrap-templates/dbc.min.css'

# Create app instance
app = Flask(__name__)
CORS(app)
# app = Dash(
#     external_stylesheets=[bi_css, dbc_css, dbc.themes.BOOTSTRAP],
#     meta_tags=[{
#         "name": "viewport",
#         "content": "width=device-width, initial-scale=1"
#     }],
#     prevent_initial_callbacks='initial_duplicate',
#     server=server,
#     use_pages=True,
# )
app.config.suppress_callback_exceptions = True
app.title = "Investor's Dream"
# server.secret_key = env.get("APP_SECRET_KEY")
    
# Get credentials
alpaca_api_key = env.get('ALPACA_API_KEY')
alpaca_api_secret = env.get('ALPACA_SECRET_KEY')
db_user = env.get('DB_USER')
db_pass = env.get('DB_PASS')
twilio_sms_sid = env.get('TWILIO_SMS_SID')
twilio_sms_auth_token = env.get('TWILIO_SMS_AUTH_TOKEN')
twilio_sms_number = env.get('TWILIO_SMS_NUMBER')

# Connect to database
engine = db.create_engine("postgresql://"+db_user+":"+db_pass+"@localhost:5432/fintech3_db")

""" ROBO ADVISOR CONFIG """

# # Configure the AWS region
# server.config['AWS_REGION'] = 'us-east-1'  

# # Create a Botocore session with the AWS region
# boto_session = botocore.session.Session()

# # Configure the AWS region in the session
# boto_session.set_config_variable('region', server.config['AWS_REGION'])

# # Create a client for the Lex bot service using the session
# config = Config(region_name=server.config['AWS_REGION'])
# lex_client = boto_session.create_client('lex-runtime', config=config)

# # Set global variables
# firstName = ''
# dateOfBirth = ''
# kids = 0
# networth = 0
# income = 0
# marriage = ''

""" OAUTH CONFIG """

# Initialize OAuth
# oauth = OAuth(server)
# oauth.register(
#     "auth0",
#     client_id=env.get("AUTH0_CLIENT_ID"),
#     client_secret=env.get("AUTH0_CLIENT_SECRET"),
#     client_kwargs={
#         "scope": "openid profile email",
#     },
#     server_metadata_url=f'https://{env.get("AUTH0_DOMAIN")}/.well-known/openid-configuration'
# )

""" API ROUTING """
    

@app.route("/api/users", methods=["GET"])
def getUsers():
    
    # Get users data
    users_data = select_users_data(engine)
    
    # Return user data
    return users_data.to_json(orient="index")

@app.route("/api/users/<string:address>", methods=["GET"])
def getUser(address):
    
    # Catch bad call
    if address == 'undefined':
        return []
    
    # Get user data
    user_data = select_user_data(address, engine)
    
    if len(user_data.index) == 0:
        print('User does not exist; creating new user.')
        new_username = uuid.uuid4()
        new_user = insert_into_users(address, str(new_username), "", "", "", "", engine)
    else:
        print('User exists; passing user.')
    
    # Return user data
    return user_data.to_json(orient="index")

@app.route("/api/strategies", methods=["GET"])
def getStrategies():
    
    print('Called /api/strategies')
    
    # Get strategies data
    strategies_data = select_strategies_data(engine)
    print(strategies_data)
    
    # Return strategies data
    return strategies_data

@app.route("/api/strategies/<string:slug>", methods=["GET"])
def getStrategy(slug):
    
    print('Called for strategy')
    
    # Catch bad call
    if not slug:
        return []
    
    # Get strategy data
    strategy_data = select_strategy_data(slug, engine)
    
    # Convert strategy data to json
    json_data = strategy_data.to_json(orient='index')
    
    # Convert json to dictionary
    dict_data = json.loads(json_data)
    
    # Parse strategy data
    parsed_data = dict_data['0']
    
    # Return strategy data
    return json.dumps(parsed_data)

@app.route("/api/strategies/<string:slug>/backtest", methods=["GET"])
def getStrategyBacktest(slug):
    
    print('Called for strategy backtest')
    
    # Catch bad call
    if not slug:
        return []
    
    # Parse args
    args = request.args.to_dict()
    strategy_class = slug.replace('-','_')
    start_date = datetime.strptime(args['start_date'], '%Y-%m-%dT%H:%M:%S.%fZ')
    end_date = datetime.strptime(args['end_date'], '%Y-%m-%dT%H:%M:%S.%fZ')
    symbol = args['symbol']
    
    # Check symbol
    asset_data = alpaca_get_asset(alpaca_api_key, alpaca_api_secret, symbol)
    
    if not asset_data:
        return []
    
    # Get backtest data
    strategy_class = getattr(TradingStrategies, strategy_class)
    figures = strategy_class.backtest(symbol, start_date, end_date)
    
    print(json.dumps(figures))
    
    return json.dumps(figures)

@app.route("/api/assets/crypto", methods=["GET"])
def getCryptoAssets():
    
    # Get assets data
    assets_data = alpaca_get_crypto_assets(alpaca_api_key, alpaca_api_secret)
    print(assets_data)
    
    # Return asset data
    return assets_data

@app.route("/api/assets/us-equity", methods=["GET"])
def getUSEquityAssets():
    
    # Get assets data
    assets_data = alpaca_get_us_equity_assets(alpaca_api_key, alpaca_api_secret)
    
    # Return asset data
    return assets_data

@app.route("/api/assets/<string:symbol>", methods=["GET"])
def getAsset(symbol):
    
    print(symbol)
    
    # Get asset data
    asset_data = alpaca_get_asset(alpaca_api_key, alpaca_api_secret, symbol)
    
    # Return asset data
    return asset_data

@app.route("/api/strategies/<string:slug>/notification", methods=["GET"])
def sendNotification(slug):
    
    # Catch bad call
    if slug == 'undefined':
        return []
    
    # Get args
    args = request.args.to_dict()
    print(args)
    
    if args['subscriptionPeriod'] == '':
        return []
    
    # Parse args
    userAddress = args['userAddress']
    subscriptionPeriod = args['subscriptionPeriod']
    
    # Get user data
    user_data = select_user_data(userAddress, engine)
    
    # Parse user contact data
    email = user_data['email'][0]
    mobile = user_data['mobile'][0]
    
    # Get strategy data
    strategy_data = select_strategy_data(slug, engine)
    
    # Convert dataframe to dictionary
    strategy_dict = strategy_data.to_dict(orient='index')[0]
    
    # Parse strategy name
    strategy_name = strategy_dict['name']
    
    # Draft notification content
    subject = "Strategy Subscription"
    body = "You've subscribed to the "+strategy_name+" trading strategy on a "+subscriptionPeriod+" plan with Investor's Dream! Congrats!"
    
    # Send email notification
    email_alert(subject, body, email)
    
    # Send SMS notification
    sms_alert(body, mobile, twilio_sms_auth_token, twilio_sms_number, twilio_sms_sid)
    
    return args
    

# @server.route("/login")
# def login():
#     redirect_uri=url_for("callback", _external=True)
#     user_login = True
#     return oauth.auth0.authorize_redirect(redirect_uri)

# @server.route("/callback")
# def callback():
#     token = oauth.auth0.authorize_access_token()
#     session["user"] = token
#     return redirect("/")

# @server.route("/logout")
# def logout():
#     session.clear()
#     user_login = False
#     return redirect(
#         "https://" + env.get("AUTH0_DOMAIN")
#         + "/v2/logout?"
#         + urlencode(
#             {
#                 "returnTo": url_for("/", _external=True),
#                 "client_id": env.get("AUTH0_CLIENT_ID"),
#             },
#             quote_via=quote_plus,
#         )
#     )

# @server.route('/chat', methods=['POST'])
# def chat_post():

#     global firstName, dateOfBirth, kids, networth, income, marriage

#     user_input = request.form['user_input']

#     # Generate a unique user ID
#     user_id = "test"

#     networth = 20

#     # Send user input to the bot and receive the response
#     response = lex_client.post_text(
#         botName= 'RiskScore',
#         botAlias= '$LATEST',
#         userId= user_id,
#         inputText= user_input
#     )

#     # Extract slot values from the Lex response
#     slots = response['slots']
#     firstName = slots.get('firstName') 
#     dateOfBirth = slots.get('dateOfBirth')
#     kids = slots.get('kids')
#     networth = slots.get('networth')
#     income = slots.get('income')
#     marriage = slots.get('marriage')


#     # Extract the bot's response from the API response
#     bot_response = response['message']

#     return bot_response

# @server.route("/")
# def dashboard():
#     return redirect("/")

# def serve_layout():
#     if session:
#         return html.Div(
#             [
#                 navbar(True),
#                 dash.page_container,
#             ],
#             className='mx-0 px-0'
#         )
#     else:
#         return html.Div(
#             [
#                 navbar(False),
#                 dbc.Container(
#                     [
#                         html.Img(
#                             className='my-4',
#                             src='assets/logotype_id_light_90.svg',
#                         ),
#                         html.H1(
#                             "Make your dream a reality.",
#                             #className="pt-sm-5",
#                             style={
#                                 'color':'white'
#                             }
#                         ),
#                         html.H3(
#                             [
#                                 dcc.Link(
#                                     "Sign up now.",
#                                     className="pt-2",
#                                     href="/login",
#                                     refresh=True,
#                                     style={
#                                         'color':'white'
#                                     }
#                                 ),
#                             ],
#                         ),
#                     ],
#                 ),
#             ],
#             className='vh-100',
#             style={
#                 'background-image': 'url(/assets/1504342112-huge.jpg)',
#                 'background-size': 'contain',
#                 'background-repeat': 'no-repeat',
#             },
#         )

# # Set app Layout
# app.layout = serve_layout