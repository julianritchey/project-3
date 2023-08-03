import pandas as pd
import yfinance as yf
import numpy as np
import hvplot.pandas
from finta import TA
import talib as ta
import matplotlib.pyplot as plt
import warnings
warnings.filterwarnings("ignore") 

def generate_and_plot_trix_signals(symbol_trix, start_date_trix, end_date_trix):
    # Get stock data
    data = yf.download(symbol_trix, start=start_date_trix, end= end_date_trix)
    data.index = pd.to_datetime(data.index, unit='1d')

    # Create a DataFrame with the index and Close column from the dataset
    trix_signals_df = data.loc[:, ["Close"]].copy()
    trix_window = 15
    signal_length = 9
        
    # Calculate the ADX indicator
    adx_df = data.loc[:, ["High", "Low", "Close"]].copy()
    adx_df["avg"] = ta.ADX(adx_df["High"], adx_df["Low"], adx_df["Close"], timeperiod=20)

    # Generate the single, double and triple exponential moving averages (15 days, respectively)
    trix_signals_df["SingleEMA"] = data["Close"].ewm(span=trix_window).mean()
    trix_signals_df["DoulbeEMA"] = trix_signals_df["SingleEMA"].ewm(span=trix_window).mean()
    trix_signals_df["TripleEMA"] = trix_signals_df["DoulbeEMA"].ewm(span=trix_window).mean()
    trix_signals_df["Trix"] = (trix_signals_df["TripleEMA"]-trix_signals_df["TripleEMA"].shift(1))/trix_signals_df["TripleEMA"].shift(1)*10000
    trix_signals_df["Signal"] = trix_signals_df["Trix"].ewm(span=signal_length).mean()
    trix_signals_df["adx"]=adx_df["avg"]
    
        # Calculate the minimum and maximum values of Trix and signal
    min_trix = trix_signals_df["Trix"].min()
    max_trix = trix_signals_df["Trix"].max()
    min_signal = trix_signals_df["Signal"].min()
    max_signal = trix_signals_df["Signal"].max()

    # Perform MinMax scaling for Trix and signal
    trix_signals_df["scaled_Trix"] = (trix_signals_df["Trix"] - min_trix) / (max_trix - min_trix) * 100
    trix_signals_df["scaled_Signal"] = (trix_signals_df["Signal"] - min_signal) / (max_signal - min_signal) * 100

    # Generate the trading signal 1 or 0
    trix_signals_df["delta"] = 0.0
    trix_signals_df["delta"][trix_window:] = np.where(
        (trix_signals_df["scaled_Trix"][trix_window:] > trix_signals_df["scaled_Signal"][trix_window:]),
        1.0, 0.0)

    # Calculate the points in time at which a position should be taken, 1 or -1
    trix_signals_df["Entry/Exit"] = 0.0
    trix_signals_df["Entry/Exit"] = trix_signals_df["delta"].diff()
    
    # Plot entry and exit signals
    exit = trix_signals_df[trix_signals_df["Entry/Exit"] == -1.0]["Close"]
    entry = trix_signals_df[trix_signals_df["Entry/Exit"] == 1.0]["Close"]
    moving_avgs = trix_signals_df[["scaled_Trix", "scaled_Signal"]]
        
#     # Set the figure size to make the image larger
#     plt.figure(figsize=(25, 12))

#     # Create the first subplot for the "Close" plot
#     ax1 = plt.subplot(2, 1, 1)
#     ax1.plot(trix_signals_df["Close"], label="Close", color="blue")
#     ax1.scatter(exit.index, exit, color="red", marker="v", s=50, label="Exit")
#     ax1.scatter(entry.index, entry, color="purple", marker="^", s=50, label="Entry")
#     ax1.set_xlabel("Date")
#     ax1.set_ylabel("Close Price")
#     ax1.set_title("Close Price")

#     # Create the second subplot for the "KDJ" plot
#     ax2 = plt.subplot(2, 1, 2)
#     ax2.plot(moving_avgs, linewidth=1.5, label=["scaled_Trix", "scaled_Signal"])
#     ax2.set_xlabel("Date")
#     ax2.set_ylabel("Trix and Signal Values")
#     ax2.set_title("Trix Strategy")
#     ax2.axhline(y=20, color='orange', linestyle='--', label='20')
#     ax2.axhline(y=80, color='purple', linestyle='--', label='80')

#     # Show the legends for both subplots
#     ax1.legend(loc="upper left")
#     ax2.legend(loc="upper left")

#     # Adjust the space between the subplots for better visualization
#     plt.tight_layout()

#     # Show the plots
#     plt.show()    
    
    return(trix_signals_df)

#Backtest the trades
def evaluate_trix_trades(trix_signals_df, symbol_trix):

    # Set initial capital
    initial_capital = float(100000)
    # Set the share size
    share_size = round(initial_capital / trix_signals_df["Close"].max())
    
    trix_signals_df['Position'] = share_size * trix_signals_df['delta']
    trix_signals_df['Entry/Exit Position'] = trix_signals_df['Position'].diff()
    trix_signals_df['Portfolio Holdings'] = trix_signals_df['Close'] * trix_signals_df['Position']
    trix_signals_df['Portfolio Cash'] = initial_capital - (trix_signals_df['Close'] * trix_signals_df['Entry/Exit Position']).cumsum()
    trix_signals_df['Portfolio Trix Total'] = trix_signals_df['Portfolio Cash'] + trix_signals_df['Portfolio Holdings']
    trix_signals_df['Portfolio Daily Returns'] = trix_signals_df['Portfolio Trix Total'].pct_change()
    trix_signals_df['Portfolio Cumulative Returns'] = (1 + trix_signals_df['Portfolio Daily Returns']).cumprod() - 1
    
#     trix_signals_df.to_csv('Trix_file.csv', index=True)    
    
#     plt.figure(figsize=(10,6))
#     plt.plot(trix_signals_df["Portfolio Cumulative Returns"], label="Portfolio Cumulative Returns")
#     plt.xlabel("Index")
#     plt.ylabel("Return in %")
#     plt.title("Portfolio Cumulative Returns by Trix Strategy")
#     plt.legend()
#     plt.tight_layout()
#     plt.show()

    trade_evaluation_df = pd.DataFrame(
        columns=[
            "Stock",
            "Entry Date",
            "Exit Date",
            "Shares",
            "Entry Share Price",
            "Exit Share Price",
            "Entry Portfolio Holding",
            "Exit Portfolio Holding",
            "Profit/Loss"]
    )
    for index, row in trix_signals_df.iterrows():
        if row["Entry/Exit"] == 1:
            entry_date = index
            entry_portfolio_holding = row["Portfolio Holdings"]
            share_size = row["Entry/Exit Position"]
            # share_size = round(initial_capital / row["Close"])
            entry_share_price = row["Close"]

        elif row["Entry/Exit"] == -1:
            exit_date = index
            exit_portfolio_holding = abs(row["Close"] * row["Entry/Exit Position"])
            exit_share_price = row["Close"]
            profit_loss = exit_portfolio_holding - entry_portfolio_holding
            trade_evaluation_df = trade_evaluation_df.append(
                {
                    "Stock": symbol_trix,
                    "Entry Date": entry_date,
                    "Exit Date": exit_date,
                    "Shares": share_size,
                    "Entry Share Price": entry_share_price,
                    "Exit Share Price": exit_share_price,
                    "Entry Portfolio Holding": entry_portfolio_holding,
                    "Exit Portfolio Holding": exit_portfolio_holding,
                    "Profit/Loss": profit_loss
                },
                ignore_index=True
            )
                
    return trade_evaluation_df

def evaluate_trix_portfolio(trix_signals_df, trade_evaluation_df):
    # Create a list for the column name
    columns = ["Backtest"]

    # Create a list holding the names of the new evaluation metrics
    metrics = [
        "Annualized Return",
        "Cumulative Returns",
        "Annual Volatility",
        "Sharpe Ratio",
        "Sortino Ratio",
        "Success Ratio",
        "Avg Profit per trade",
        "Avg Loss per trade"
    ]

    # Initialize the DataFrame with index set to the evaluation metrics and the column
    portfolio_evaluation_df = pd.DataFrame(index=metrics, columns=columns)

    portfolio_evaluation_df.loc["Annualized Return"] = (
        trix_signals_df["Portfolio Daily Returns"].mean() * 252
    )

    portfolio_evaluation_df.loc["Cumulative Returns"] = (
        trix_signals_df["Portfolio Cumulative Returns"][-1]
    )

    portfolio_evaluation_df.loc["Annual Volatility"] = (
        trix_signals_df["Portfolio Daily Returns"].std() * np.sqrt(252)
    )

    portfolio_evaluation_df.loc["Sharpe Ratio"] = (
        trix_signals_df["Portfolio Daily Returns"].mean() * 252
    ) / (
        trix_signals_df["Portfolio Daily Returns"].std() * np.sqrt(252)
    )

    portfolio_evaluation_df.loc["Success Ratio"] = len(trade_evaluation_df[trade_evaluation_df["Profit/Loss"] > 0]) / len(trade_evaluation_df)

    portfolio_evaluation_df.loc["Avg Profit per trade"] = trade_evaluation_df[trade_evaluation_df["Profit/Loss"] > 0]["Profit/Loss"].mean()

    portfolio_evaluation_df.loc["Avg Loss per trade"] = trade_evaluation_df[trade_evaluation_df["Profit/Loss"] < 0]["Profit/Loss"].mean()

    # Create a DataFrame that contains the Portfolio Daily Returns column
    sortino_ratio_df = trix_signals_df[["Portfolio Daily Returns"]].copy()

    # Create a column to hold downside return values
    sortino_ratio_df.loc[:, "Downside Returns"] = 0

    # Find Portfolio Daily Returns values less than 0,
    # square those values, and add them to the Downside Returns column
    sortino_ratio_df.loc[sortino_ratio_df["Portfolio Daily Returns"] < 0,
                         "Downside Returns"] = sortino_ratio_df["Portfolio Daily Returns"]**2

    # Calculate the annualized return value
    annualized_return = (
        sortino_ratio_df["Portfolio Daily Returns"].mean() * 252
    )

    downside_standard_deviation = (
        np.sqrt(sortino_ratio_df["Downside Returns"].mean()) * np.sqrt(252)
    )

    sortino_ratio = annualized_return / downside_standard_deviation

    # Add the Sortino ratio to the evaluation DataFrame
    portfolio_evaluation_df.loc["Sortino Ratio"] = sortino_ratio

    return portfolio_evaluation_df