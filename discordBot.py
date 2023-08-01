# step1: https://discord.com/developers/applications
# https://discord.com/developers/applications/1135721641754767551/information
#

import discord
import os
from dotenv import load_dotenv
from neuralintents import GenericAssistant

load_dotenv()
TOKEN = os.getenv('Discord_PUBLIC_KEY')


client = discord.Client()

client.run(TOKEN)
