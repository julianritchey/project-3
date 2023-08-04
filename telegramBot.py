# Reference: https://www.youtube.com/watch?v=CNkiPN_WZfA
# bot name: investors-dream
# username: investorsDream_bot

# Use version 13.13: pip install python-telegram-bot==13.13

from telegram.ext import Updater, CommandHandler, MessageHandler
import os
from dotenv import load_dotenv
import requests
load_dotenv()

TOKEN = os.getenv('teleToken')


def start(update, context):
    update.message.reply_text("Hello! Welcome To Investors Dream Bot")


def help(update, context):
    update.message.reply_text("""
        The following commands are available:
                              
        /start -> Welcome Message
        /help -> This Message
        /about -> Information About Investors Dream                      
""")


def about(update, context):
    update.message.reply_text("""
        Investor's Dream is a web application that provides users a multitude of investment tools, including
        
        /summary -> A summary of current investments held in multiple exchanges.
        /portfolio -> A portfolio planner for analyzing and simulating theoretical portfolios.
        /marketPredictor -> A market predictor for viewing potential market movement.
        /tradingStrategies -> A set of trading strategies along with a tool for backtesting the strategies.
        /buySell ->  An interface for buying or selling market assets through a connected exchange.
""")


updater = Updater(TOKEN)
disp = updater.dispatcher

# create a command handler, it's going to handle a certain command,
# map a function to it and then add the command handler to the dispatcher
disp.add_handler(CommandHandler("start", start))
disp.add_handler(CommandHandler("help", help))
disp.add_handler(CommandHandler("about", about))


updater.start_polling()
updater.idle()
