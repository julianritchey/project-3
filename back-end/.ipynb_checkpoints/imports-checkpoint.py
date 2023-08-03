from strategies.grid_strategy_1 import grid_trading_strategy
from strategies.macd_strategy_2 import evaluate_MACD_portfolio as macd_evaluate_portfolio
from strategies.macd_strategy_2 import evaluate_MACD_trades as macd_evaluate_trades
from strategies.macd_strategy_2 import generate_and_plot_MACD_signals as macd_generate_and_plot_ema_signals
# from assets.MCForecast_portfolio import run_monte_carlo_simulation
# from assets.MCForecastTools import MCSimulation
# from assets.ml_risk_prediction import build_df as risk_prediction_build_df
# from assets.ml_risk_prediction import load_model as risk_prediction_load_model
# from assets.ml_risk_prediction import predict_risk_score as risk_prediction_predict_risk_score
# from assets.nn_market_predictor import train_and_predict_stock as nn_train_and_predict_stock
# from assets.PortfolioAnalyzeTool import portfolio_analysis
# from assets.StockAnalyzeTool import calculate_sharpe_ratios
# from assets.StockAnalyzeTool import calculate_statistics
# from assets.StockAnalyzeTool import calculate_stock_betas
from strategies.trix_strategy_3 import evaluate_trix_portfolio as trix_evaluate_portfolio
from strategies.trix_strategy_3 import evaluate_trix_trades as trix_evaluate_trades
from strategies.trix_strategy_3 import generate_and_plot_trix_signals as trix_generate_and_plot_ema_signals
from strategies.kdj_strategy_2 import evaluate_KDJ_portfolio as kdj_evaluate_portfolio
from strategies.kdj_strategy_2 import evaluate_KDJ_trades as kdj_evaluate_trades
from strategies.kdj_strategy_2 import generate_and_plot_KDJ_signals as kdj_generate_and_plot_signals
# from dash import dash_table
# from ipynb.fs.defs.assets.alpaca_api import get_accounts as alpaca_get_accounts
from ipynb.fs.defs.alpaca_api import get_asset as alpaca_get_asset
from ipynb.fs.defs.alpaca_api import get_crypto_assets as alpaca_get_crypto_assets
from ipynb.fs.defs.alpaca_api import get_us_equity_assets as alpaca_get_us_equity_assets
# from ipynb.fs.defs.assets.auth0_api import get_user as auth0_get_user
# from ipynb.fs.defs.assets.auth0_api import patch_user_risk_tolerance
# from ipynb.fs.defs.assets.auth0_api import patch_user_theme_preference
# from ipynb.fs.defs.assets.bitget_api import get_accounts as bitget_get_accounts
# from ipynb.fs.defs.assets.kucoin_api import clean_symbols_data
# from ipynb.fs.defs.assets.kucoin_api import get_24hr_stats
# from ipynb.fs.defs.assets.kucoin_api import get_accounts as kucoin_get_accounts
# from ipynb.fs.defs.assets.kucoin_api import get_actual_fee_rate
# from ipynb.fs.defs.assets.kucoin_api import get_all_tickers
# from ipynb.fs.defs.assets.kucoin_api import get_base_currency
# from ipynb.fs.defs.assets.kucoin_api import get_base_fee
# from ipynb.fs.defs.assets.kucoin_api import get_currencies
# from ipynb.fs.defs.assets.kucoin_api import get_deposit_list
# from ipynb.fs.defs.assets.kucoin_api import get_fiat_price
# from ipynb.fs.defs.assets.kucoin_api import get_headers
# from ipynb.fs.defs.assets.kucoin_api import get_investment_data
# from ipynb.fs.defs.assets.kucoin_api import get_klines
# from ipynb.fs.defs.assets.kucoin_api import get_market_list
# from ipynb.fs.defs.assets.kucoin_api import get_ohlc_data
# from ipynb.fs.defs.assets.kucoin_api import get_orders
# from ipynb.fs.defs.assets.kucoin_api import get_quote_currency
# from ipynb.fs.defs.assets.kucoin_api import get_symbols
# from ipynb.fs.defs.assets.kucoin_api import get_symbols_pair
# from ipynb.fs.defs.assets.kucoin_api import get_ticker
# from ipynb.fs.defs.assets.kucoin_api import get_total_portfolio_value
# from ipynb.fs.defs.assets.kucoin_api import get_total_profit_loss
# from ipynb.fs.defs.assets.kucoin_api import get_trade_histories
# from ipynb.fs.defs.assets.queries import delete_from_assets_portfolios
# from ipynb.fs.defs.assets.queries import delete_from_exchange_connections
# from ipynb.fs.defs.assets.queries import insert_into_assets
# from ipynb.fs.defs.assets.queries import insert_into_assets_portfolios
# from ipynb.fs.defs.assets.queries import insert_into_exchange_connections
# from ipynb.fs.defs.assets.queries import insert_into_portfolios
# from ipynb.fs.defs.assets.queries import select_all_exchanges_data
# from ipynb.fs.defs.assets.queries import select_all_portfolio_data
# from ipynb.fs.defs.assets.queries import select_exchange_connections_data
# from ipynb.fs.defs.assets.queries import update_exchange_connections_data
# from ipynb.fs.defs.assets.questrade_api import get_access_token as questrade_get_access_token
# from ipynb.fs.defs.assets.questrade_api import get_accounts as questrade_get_accounts
# import plotly.graph_objs as go
import pandas as pd

from ipynb.fs.defs.queries import select_user_data
from ipynb.fs.defs.queries import select_users_data
from ipynb.fs.defs.queries import insert_into_users
from ipynb.fs.defs.queries import select_strategies_data
from ipynb.fs.defs.queries import select_strategy_data

from resources.sendEmail import email_alert
from resources.sendSMS import sms_alert

""" API Mapping """

class AddExchangeConnectionData():
    
    # Alpaca
    def Alpaca(input_data):
        api_key = input_data[0][0]
        api_secret = input_data[1][0]
        api_data = [api_key, api_secret, '', '']
        account_data = alpaca_get_accounts(api_key, api_secret)
        if account_data:
            return api_data
        else:
            return None
    
    # Bitget
    def Bitget(input_data):
        api_key = input_data[0][0]
        api_passphrase = input_data[1][0]
        api_secret = input_data[2][0]
        api_data = [api_key, api_passphrase, api_secret, '']
        account_data = bitget_get_accounts(api_key, api_passphrase, api_secret)
        if account_data:
            return api_data
        else:
            return None
    
    # KuCoin
    def KuCoin(input_data):
        api_key = input_data[0][0]
        api_passphrase = input_data[1][0]
        api_secret = input_data[2][0]
        api_data = [api_key, api_passphrase, api_secret, '']
        account_data = kucoin_get_accounts(api_key, api_passphrase, api_secret)
        if account_data:
            return api_data
        else:
            return None
    
    # Questrade
    def QuestradeInc(input_data):
        refresh_token = input_data[2][0]
        response = questrade_get_access_token(refresh_token)
        if response:
            access_token = response['access_token']
            api_server = response['api_server']
            refresh_token = response['refresh_token']
            token_type = response['token_type']
            api_data = [access_token, api_server, refresh_token, token_type]
            account_data = questrade_get_accounts(access_token, api_server, token_type)
            if account_data:
                return api_data
            else:
                return None
        else:
            return None

class GetExchangeConnectionData():
    
    # Alpaca
    def Alpaca(input_data):
        api_key = input_data[0]
        api_secret = input_data[1]
        api_data = [api_key, api_secret, '', '']
        account_data = alpaca_get_accounts(api_key, api_secret)
        if account_data:
            return account_data, api_data
        else:
            return None
    
    # Bitget
    def Bitget(input_data):
        api_key = input_data[0]
        api_passphrase = input_data[1]
        api_secret = input_data[2]
        api_data = [api_key, api_passphrase, api_secret, '']
        account_data = bitget_get_accounts(api_key, api_passphrase, api_secret)
        if account_data:
            return account_data, api_data
        else:
            return None
    
    # KuCoin
    def KuCoin(input_data):
        api_key = input_data[0]
        api_passphrase = input_data[1]
        api_secret = input_data[2]
        api_data = [api_key, api_passphrase, api_secret, '']
        account_data = kucoin_get_accounts(api_key, api_passphrase, api_secret)
        if account_data:
            return account_data, api_data
        else:
            return None
    
    # Questrade
    def QuestradeInc(input_data):
        refresh_token = input_data[2]
        # refresh_token = 'pBmetuoDKvBSxy5Fk3oOQMFL9VQ9JbDn0'
        response = questrade_get_access_token(refresh_token)
        if response:
            access_token = response['access_token']
            api_server = response['api_server']
            refresh_token = response['refresh_token']
            token_type = response['token_type']
            api_data = [access_token, api_server, refresh_token, token_type]
            account_data = questrade_get_accounts(access_token, api_server, token_type)
            if account_data:
                return account_data, api_data
            else:
                return None
        else:
            return None
        
class TradingStrategies():
    
    # Strategy list
    def StrategyList():
        strategy_list = [
            'GRID',
            'MACD',
            'TRIX',
        ]
        return strategy_list
    
    # MACD
    class grid_strategy_1():
        
        # Strategy backtest
        def backtest(symbol, start_date, end_date):
            stock_data, test_data, grid_data, trades_data, portfolio_data = grid_trading_strategy(symbol, start_date, end_date)
            trades_data = trades_data.set_index('Date')
            initial_investment = 200000
            last_action = trades_data[:1]['Action'].values[0]
            cumulative_return_list = [0]
            for i, row in trades_data[1:].iterrows():
                current_return = row['StockValue'] + row['Cash'] - initial_investment
                cumulative_return_list.append(current_return)
                if row['Action'] == last_action:
                    trades_data.at[i,'Action'] = 'Hold'
                last_action = row['Action']
            trades_data['CumulativeReturn'] = cumulative_return_list
            signals_entry = trades_data[trades_data["Action"] == "Buy"]["Price"]
            signals_exit = trades_data[trades_data["Action"] == "Sell"]["Price"]

            ##########
            test_data.index = test_data.index.strftime("%Y-%m-%d")
            signals_entry.index = signals_entry.index.strftime("%Y-%m-%d")
            signals_exit.index = signals_exit.index.strftime("%Y-%m-%d")
            ##########
            
            """ Signal evaluation """

            # Generate positions plot
            # positions_fig = go.Figure()
            # positions_fig.add_trace(
            #     go.Scatter(
            #         mode='lines',
            #         name='Close price',
            #         x=test_data.index,
            #         y=test_data['Close'],
            #     )
            # )
            ##########
            trace1 = {
                'mode':'lines',
                'name':'Close price',
                'x': test_data.index.to_list(),
                'y': test_data['Close'].to_list(),
            }
            ##########
            # positions_fig.add_trace(
            #     go.Scatter(
            #         marker=dict(
            #             color='green',
            #             line=dict(
            #                 width=1,
            #                 color='DarkSlateGrey'
            #             ),
            #             size=10,
            #             symbol='triangle-up'
            #         ),
            #         mode='markers',
            #         name='Entry signals',
            #         x=signals_entry.index,
            #         y=signals_entry,
            #     )
            # )
            ##########
            trace2 = {
                    'mode':'markers',
                    'name':'Entry signals',
                    'x':signals_entry.index.to_list(),
                    'y':signals_entry.to_list(),
            }
            ##########
            # positions_fig.add_trace(
            #     go.Scatter(
            #         marker=dict(
            #             color='red',
            #             line=dict(
            #                 width=1,
            #                 color='DarkSlateGrey'
            #             ),
            #             size=10,
            #             symbol='triangle-down'
            #         ),
            #         mode='markers',
            #         name='Exit signals',
            #         x=signals_exit.index,
            #         y=signals_exit
            #     )
            # )
            ##########
            trace3 = {
                    'mode':'markers',
                    'name':'Exit signals',
                    'x':signals_exit.index.to_list(),
                    'y':signals_exit.to_list(),
            }
            ##########
            # for level in grid_data:
            #     positions_fig.add_hline(y=level, line_color = 'rgba(214, 39, 40, 0.5)')
            # positions_fig.update_layout(
            #     xaxis_title_text='Date',
            #     yaxis_title_text='Price in USD',
            #     title="Entry and Exit Signals Relative to Close Price",
            # )
            ##########
            figures = [trace1, trace2, trace3]
            ##########

            # Generate directional index plot
            # daily_close_fig = go.Figure()
            # daily_close_fig.add_trace(
            #     go.Scatter(
            #         mode='lines',
            #         x=stock_data.index,
            #         y=stock_data['Close'],
            #     )
            # )
            # daily_close_fig.update_layout(
            #     xaxis_title_text='Date',
            #     yaxis_title_text='Price in USD',
            #     title="Daily Close Price",
            # )

            """ Trade evaluation """

            # Generate cumulative returns plot
            # cumulative_returns_fig = go.Figure()
            # cumulative_returns_fig.add_trace(
            #     go.Scatter(
            #         mode='lines',
            #         x=trades_data.index,
            #         y=trades_data['CumulativeReturn'],
            #     )
            # )
            # cumulative_returns_fig.update_layout(
            #     xaxis_title_text='Date',
            #     yaxis_title_text='Return in USD',
            #     title="Portfolio Cumulative Returns (Based on USD 200,000 Initial Investment)",
            # )

            """ Portfolio evaluation """

            # Get portfolio data
            # portfolio_datatable = dash_table.DataTable(
            #     portfolio_data,
            #     [{"name": i, "id": i} for i in ['Metric', 'Value']],
            #     style_cell={
            #         'fontFamily': 'Helvetica Neue, Helvetica, Arial, sans-serif',
            #         'fontSize': '16px',
            #         'paddingLeft': '0.5rem',
            #         'textAlign': 'left',
            #     },
            #     style_header={
            #         'fontFamily': 'Helvetica Neue, Helvetica, Arial, sans-serif',
            #         'fontSize': '16px',
            #         'fontWeight': 'bold',
            #     },
            # )
            # signal_evaluation_figures = [positions_fig, daily_close_fig]
            # trade_evaluation_figures = [cumulative_returns_fig]
            # portfolio_evaluation_tables = [portfolio_datatable]
            
            return figures
        
        # Strategy information
        def information():
            strategy_info = {
                'description': "GRID trading strategy is a systematic trading approach involves placing buy and sell orders at predetermined price levels in a grid-like pattern, aiming to profit from price fluctuations within a specific range.",
                'title': 'GRID Strategy',
            }
            return strategy_info
    
    # MACD
    class macd_strategy_2():
        
        # Strategy backtest
        def backtest(symbol, start_date, end_date):
            signals_df = macd_generate_and_plot_ema_signals(symbol, start_date, end_date)
            trades_df = macd_evaluate_trades(signals_df, symbol)
            portfolio_df = macd_evaluate_portfolio(signals_df, trades_df)
            
            signals_entry = signals_df[signals_df["Entry/Exit"] == 1.0]["Close"]
            signals_exit = signals_df[signals_df["Entry/Exit"] == -1.0]["Close"]

            ##########
            signals_df.index = signals_df.index.strftime("%Y-%m-%d")
            signals_entry.index = signals_entry.index.strftime("%Y-%m-%d")
            signals_exit.index = signals_exit.index.strftime("%Y-%m-%d")
            ##########

            """ Signal evaluation """

            trace1 = {
                    'mode':'lines',
                    'name':'Close price',
                    'x':signals_df.index.to_list(),
                    'y':signals_df['Close'].to_list(),
            }
            trace2 = {
                    'mode':'markers',
                    'name':'Entry signals',
                    'x':signals_entry.index.to_list(),
                    'y':signals_entry.to_list(),
            }
            trace3 = {
                    'mode':'markers',
                    'name':'Exit signals',
                    'x':signals_exit.index.to_list(),
                    'y':signals_exit.to_list(),
            }
            trace4 = {
                    'mode':'lines',
                    'name':'MACD',
                    'x':signals_df.index.to_list(),
                    'y':signals_df['scaled_macd'].to_list(),
            }
            trace5 = {
                    'mode':'lines',
                    'name':'Signal',
                    'x':signals_df.index.to_list(),
                    'y':signals_df['scaled_signal'].to_list(),
            }
            figures = [
                {
                    'data': [trace1, trace2, trace3],
                    'layout': { 'title': "Strategy signals" }
                },
                {
                    'data': [trace4, trace5],
                    'layout': {
                        'shapes': [
                            {
                                'type': 'line',
                                'x0': signals_entry.index.to_list()[0],
                                'y0': 20,
                                'x1': signals_entry.index.to_list()[-1],
                                'y1': 20,
                                'line': {
                                    'color': 'orange',
                                    'width': 1
                                }
                            },
                            {
                                'type': 'line',
                                'x0': signals_entry.index.to_list()[0],
                                'y0': 80,
                                'x1': signals_entry.index.to_list()[-1],
                                'y1': 80,
                                'line': {
                                    'color': 'purple',
                                    'width': 1
                                }
                            }
                        ],
                        'title': "Strategy indicators"
                    }
                }
            ]

            """ Trade evaluation """

            # Generate cumulative returns plot
            # cumulative_returns_fig = go.Figure()
            # cumulative_returns_fig.add_trace(
            #     go.Scatter(
            #         mode='lines',
            #         x=signals_df.index,
            #         y=signals_df['Portfolio Cumulative Returns'],
            #     )
            # )
            # cumulative_returns_fig.update_layout(
            #     xaxis_title_text='Date',
            #     yaxis_title_text='Return in %',
            #     title="Portfolio Cumulative Returns",
            # )

            """ Portfolio evaluation """

            # Get portfolio data
            # portfolio_df = portfolio_df.reset_index()
            # portfolio_df.columns = ['Metric', 'Value']
            # print(portfolio_df)
            # print(portfolio_df.to_dict('records'))
            # portfolio_datatable = dash_table.DataTable(
            #     portfolio_df.to_dict('records'),
            #     [{"name": i, "id": i} for i in portfolio_df.columns],
            #     style_cell={
            #         'fontFamily': 'Helvetica Neue, Helvetica, Arial, sans-serif',
            #         'fontSize': '16px',
            #         'paddingLeft': '0.5rem',
            #         'textAlign': 'left',
            #     },
            #     style_header={
            #         'fontFamily': 'Helvetica Neue, Helvetica, Arial, sans-serif',
            #         'fontSize': '16px',
            #         'fontWeight': 'bold',
            #     },
            # )
            # signal_evaluation_figures = [positions_fig, directional_index_fig]
            # trade_evaluation_figures = [cumulative_returns_fig]
            # portfolio_evaluation_tables = [portfolio_datatable]
            return figures
    
    # TRIX
    class trix_strategy_3():
        
        # Strategy backtest
        def backtest(symbol, start_date, end_date):
            signals_df = trix_generate_and_plot_ema_signals(symbol, start_date, end_date)
            trades_df = trix_evaluate_trades(signals_df, symbol)
            portfolio_df = trix_evaluate_portfolio(signals_df, trades_df)
            
            signals_exit = signals_df[signals_df["Entry/Exit"] == -1.0]["Close"]
            signals_entry = signals_df[signals_df["Entry/Exit"] == 1.0]["Close"]
            moving_avgs = signals_df[["scaled_Trix", "scaled_Signal"]]

            ##########
            signals_df = signals_df.dropna()
            signals_df.index = signals_df.index.strftime("%Y-%m-%d")
            signals_entry.index = signals_entry.index.strftime("%Y-%m-%d")
            signals_exit.index = signals_exit.index.strftime("%Y-%m-%d")
            ##########

            """ Signal evaluation """

            trace1 = {
                    'mode':'lines',
                    'name':'Close price',
                    'x':signals_df.index.to_list(),
                    'y':signals_df['Close'].to_list(),
            }
            trace2 = {
                    'mode':'markers',
                    'name':'Entry signals',
                    'x':signals_entry.index.to_list(),
                    'y':signals_entry.to_list(),
            }
            trace3 = {
                    'mode':'markers',
                    'name':'Exit signals',
                    'x':signals_exit.index.to_list(),
                    'y':signals_exit.to_list(),
            }
            trace4 = {
                    'mode':'lines',
                    'name':'TRIX',
                    'x':signals_df.index.to_list(),
                    'y':signals_df['scaled_Trix'].to_list(),
            }
            trace5 = {
                    'mode':'lines',
                    'name':'Signal',
                    'x':signals_df.index.to_list(),
                    'y':signals_df['scaled_Signal'].to_list(),
            }
            figures = [
                {
                    'data': [trace1, trace2, trace3],
                    'layout': { 'title': "Strategy signals" }
                },
                {
                    'data': [trace4, trace5],
                    'layout': {
                        'shapes': [
                            {
                                'type': 'line',
                                'x0': signals_entry.index.to_list()[0],
                                'y0': 20,
                                'x1': signals_entry.index.to_list()[-1],
                                'y1': 20,
                                'line': {
                                    'color': 'orange',
                                    'width': 1
                                }
                            },
                            {
                                'type': 'line',
                                'x0': signals_entry.index.to_list()[0],
                                'y0': 80,
                                'x1': signals_entry.index.to_list()[-1],
                                'y1': 80,
                                'line': {
                                    'color': 'purple',
                                    'width': 1
                                }
                            }
                        ],
                        'title': "Strategy indicators"
                    }
                }
            ]
            ##########

            """ Trade evaluation """

            # Generate cumulative returns plot
            # cumulative_returns_fig = go.Figure()
            # cumulative_returns_fig.add_trace(
            #     go.Scatter(
            #         mode='lines',
            #         x=signals_df.index,
            #         y=signals_df['Portfolio Cumulative Returns'],
            #     )
            # )
            # cumulative_returns_fig.update_layout(
            #     xaxis_title_text='Date',
            #     yaxis_title_text='Return in %',
            #     title="Portfolio Cumulative Returns",
            # )

            """ Portfolio evaluation """

            # Get portfolio data
            # portfolio_df = portfolio_df.reset_index()
            # portfolio_df.columns = ['Metric', 'Value']
            # portfolio_datatable = dash_table.DataTable(
            #     portfolio_df.to_dict('records'),
            #     [{"name": i, "id": i} for i in portfolio_df.columns],
            #     style_cell={
            #         'fontFamily': 'Helvetica Neue, Helvetica, Arial, sans-serif',
            #         'fontSize': '16px',
            #         'paddingLeft': '0.5rem',
            #         'textAlign': 'left',
            #     },
            #     style_header={
            #         'fontFamily': 'Helvetica Neue, Helvetica, Arial, sans-serif',
            #         'fontSize': '16px',
            #         'fontWeight': 'bold',
            #     },
            # )
            # signal_evaluation_figures = [positions_fig, directional_index_fig]
            # trade_evaluation_figures = [cumulative_returns_fig]
            # portfolio_evaluation_tables = [portfolio_datatable]
            
            return figures
    
    # KDJ
    class kdj_strategy_2():
        
        # Strategy backtest
        def backtest(symbol, start_date, end_date):
            signals_df = kdj_generate_and_plot_signals(symbol, start_date, end_date)
            trades_df = kdj_evaluate_trades(signals_df, symbol)
            portfolio_df = kdj_evaluate_portfolio(signals_df, trades_df)
            
            signals_entry = signals_df[signals_df["Entry/Exit"] == 1.0]["Close"]
            signals_exit = signals_df[signals_df["Entry/Exit"] == -1.0]["Close"]
            
            print(signals_df)
            print(signals_entry)
            print(signals_exit)
            print(signals_entry.index.to_list()[0])
            print(signals_entry.index.to_list()[-1])

            ##########
            signals_df = signals_df.dropna()
            signals_df.index = signals_df.index.strftime("%Y-%m-%d")
            signals_entry.index = signals_entry.index.strftime("%Y-%m-%d")
            signals_exit.index = signals_exit.index.strftime("%Y-%m-%d")
            ##########

            """ Signal evaluation """

            trace1 = {
                    'mode':'lines',
                    'name':'Close price',
                    'x':signals_df.index.to_list(),
                    'y':signals_df['Close'].to_list(),
            }
            trace2 = {
                    'mode':'markers',
                    'name':'Entry signals',
                    'x':signals_entry.index.to_list(),
                    'y':signals_entry.to_list(),
            }
            trace3 = {
                    'mode':'markers',
                    'name':'Exit signals',
                    'x':signals_exit.index.to_list(),
                    'y':signals_exit.to_list(),
            }
            trace4 = {
                    'mode':'lines',
                    'name':'TRIX',
                    'x':signals_df.index.to_list(),
                    'y':signals_df['K'].to_list(),
            }
            trace5 = {
                    'mode':'lines',
                    'name':'Signal',
                    'x':signals_df.index.to_list(),
                    'y':signals_df['D'].to_list(),
            }
            figures = [
                {
                    'data': [trace1, trace2, trace3],
                    'layout': { 'title': "Strategy signals" }
                },
                {
                    'data': [trace4, trace5],
                    'layout': {
                        'shapes': [
                            {
                                'type': 'line',
                                'x0': signals_entry.index.to_list()[0],
                                'y0': 20,
                                'x1': signals_entry.index.to_list()[-1],
                                'y1': 20,
                                'line': {
                                    'color': 'orange',
                                    'width': 1
                                }
                            },
                            {
                                'type': 'line',
                                'x0': signals_entry.index.to_list()[0],
                                'y0': 80,
                                'x1': signals_entry.index.to_list()[-1],
                                'y1': 80,
                                'line': {
                                    'color': 'purple',
                                    'width': 1
                                }
                            }
                        ],
                        'title': "Strategy indicators"
                    }
                }
            ]

            """ Trade evaluation """

            # Generate cumulative returns plot
            # cumulative_returns_fig = go.Figure()
            # cumulative_returns_fig.add_trace(
            #     go.Scatter(
            #         mode='lines',
            #         x=signals_df.index,
            #         y=signals_df['Portfolio Cumulative Returns'],
            #     )
            # )
            # cumulative_returns_fig.update_layout(
            #     xaxis_title_text='Date',
            #     yaxis_title_text='Return in %',
            #     title="Portfolio Cumulative Returns",
            # )

            """ Portfolio evaluation """

            # Get portfolio data
            # portfolio_df = portfolio_df.reset_index()
            # portfolio_df.columns = ['Metric', 'Value']
            # portfolio_datatable = dash_table.DataTable(
            #     portfolio_df.to_dict('records'),
            #     [{"name": i, "id": i} for i in portfolio_df.columns],
            #     style_cell={
            #         'fontFamily': 'Helvetica Neue, Helvetica, Arial, sans-serif',
            #         'fontSize': '16px',
            #         'paddingLeft': '0.5rem',
            #         'textAlign': 'left',
            #     },
            #     style_header={
            #         'fontFamily': 'Helvetica Neue, Helvetica, Arial, sans-serif',
            #         'fontSize': '16px',
            #         'fontWeight': 'bold',
            #     },
            # )
            # signal_evaluation_figures = [positions_fig, directional_index_fig]
            # trade_evaluation_figures = [cumulative_returns_fig]
            # portfolio_evaluation_tables = [portfolio_datatable]
            
            return figures