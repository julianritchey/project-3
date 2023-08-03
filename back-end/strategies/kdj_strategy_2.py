import pandas as pd
import yfinance as yf
import numpy as np
import matplotlib.pyplot as plt
import requests
import warnings
warnings.filterwarnings("ignore") 


def generate_and_plot_KDJ_signals(symbol_KDJ, start_date_KDJ, end_date_KDJ, n=14, m1=5, m2=5):
    # Get stock data
    data = yf.download(symbol_KDJ, start=start_date_KDJ, end=end_date_KDJ)
    data.index = pd.to_datetime(data.index, unit='1d')
    
    KDJ_df = data.loc[:, ["High","Low","Close"]].copy()

    KDJ_df["rolling_14D_high_prices"] = KDJ_df["High"].rolling(window=n,min_periods=n).max()
    KDJ_df["rolling_14D_low_prices"] = KDJ_df["Low"].rolling(window=n, min_periods=n).min()

    KDJ_df["rolling_5D_high_prices"] = KDJ_df["High"].rolling(window=m1,min_periods=m1).max()
    KDJ_df["rolling_5D_low_prices"] = KDJ_df["Low"].rolling(window=m1, min_periods=m1).min()

    KDJ_df["K"] = 100 * ((KDJ_df["Close"] - KDJ_df["rolling_14D_low_prices"]) / (KDJ_df["rolling_14D_high_prices"] - KDJ_df["rolling_14D_low_prices"]))

    ct_minus_ln_sum = (KDJ_df["Close"] - KDJ_df["rolling_5D_low_prices"]).rolling(window=m2, min_periods=m2).sum()
    hn_minus_ln_sum = (KDJ_df["rolling_5D_high_prices"] - KDJ_df["rolling_5D_low_prices"]).rolling(window=m2, min_periods=m2).sum()

    KDJ_df["D"] = 100 * (ct_minus_ln_sum / hn_minus_ln_sum)

    KDJ_df["delta"] = 0.0
    KDJ_df["delta"][n:] = np.where((KDJ_df["K"][n:] > KDJ_df["D"][n:]), 1.0, 0.0)
    KDJ_df["Entry/Exit"] = KDJ_df["delta"].diff()

    # Plot entry and exit signals
    exit = KDJ_df[KDJ_df["Entry/Exit"] == -1.0]["Close"]
    entry = KDJ_df[KDJ_df["Entry/Exit"] == 1.0]["Close"]

#     # Set the figure size to make the image larger
#     plt.figure(figsize=(25, 12))

#     # Create the first subplot for the "Close" plot
#     ax1 = plt.subplot(2, 1, 1)
#     ax1.plot(KDJ_df["Close"], label="Close", color="blue")
#     ax1.scatter(exit.index, exit, color="red", marker="v", s=50, label="Exit")
#     ax1.scatter(entry.index, entry, color="purple", marker="^", s=50, label="Entry")
#     ax1.set_xlabel("Date")
#     ax1.set_ylabel("Close Price")
#     ax1.set_title("Close Price")

#     # Create the second subplot for the "KDJ" plot
#     ax2 = plt.subplot(2, 1, 2)
#     ax2.plot(KDJ_df["K"], label="K", color="green")
#     ax2.plot(KDJ_df["D"], label="D", color="red")
#     ax2.set_xlabel("Date")
#     ax2.set_ylabel("K and D Values")
#     ax2.set_title("KDJ K and D Values")
#     ax2.axhline(y=20, color='orange', linestyle='--', label='20')
#     ax2.axhline(y=80, color='purple', linestyle='--', label='80')

#     # Show the legends for both subplots
#     ax1.legend(loc="upper left")
#     ax2.legend(loc="upper left")

#     # Adjust the space between the subplots for better visualization
#     plt.tight_layout()

#     # Show the plots
#     plt.show()
    
    return KDJ_df

#Backtest the trades
def evaluate_KDJ_trades(KDJ_df, symbol_KDJ):

    # Set initial capital
    initial_capital = float(100000)
    # Set the share size
    share_size = round(initial_capital / KDJ_df["Close"].max())
    
    KDJ_df['Position'] = share_size * KDJ_df['delta']
    KDJ_df['Entry/Exit Position'] = KDJ_df['Position'].diff()
    KDJ_df['Portfolio Holdings'] = KDJ_df['Close'] * KDJ_df['Position']
    KDJ_df['Portfolio Cash'] = initial_capital - (KDJ_df['Close'] * KDJ_df['Entry/Exit Position']).cumsum()
    KDJ_df['Portfolio KDJ Total'] = KDJ_df['Portfolio Cash'] + KDJ_df['Portfolio Holdings']
    KDJ_df['Portfolio Daily Returns'] = KDJ_df['Portfolio KDJ Total'].pct_change()
    KDJ_df['Portfolio Cumulative Returns'] = (1 + KDJ_df['Portfolio Daily Returns']).cumprod() - 1

#     KDJ_df.to_csv('KDJ_file.csv', index=True)    
    
#     plt.figure(figsize=(10,6))
#     plt.plot(KDJ_df["Portfolio Cumulative Returns"], label="Portfolio Cumulative Returns")
#     plt.xlabel("Index")
#     plt.ylabel("Return in %")
#     plt.title("Portfolio Cumulative Returns by KDJ Strategy")
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
    for index, row in KDJ_df.iterrows():
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
                    "Stock": symbol_KDJ,
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

def evaluate_KDJ_portfolio(KDJ_df, trade_evaluation_df):
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
        KDJ_df["Portfolio Daily Returns"].mean() * 252
    )

    portfolio_evaluation_df.loc["Cumulative Returns"] = (
        KDJ_df["Portfolio Cumulative Returns"][-1]
    )

    portfolio_evaluation_df.loc["Annual Volatility"] = (
        KDJ_df["Portfolio Daily Returns"].std() * np.sqrt(252)
    )

    portfolio_evaluation_df.loc["Sharpe Ratio"] = (
        KDJ_df["Portfolio Daily Returns"].mean() * 252
    ) / (
        KDJ_df["Portfolio Daily Returns"].std() * np.sqrt(252)
    )

    portfolio_evaluation_df.loc["Success Ratio"] = len(trade_evaluation_df[trade_evaluation_df["Profit/Loss"] > 0]) / len(trade_evaluation_df)

    portfolio_evaluation_df.loc["Avg Profit per trade"] = trade_evaluation_df[trade_evaluation_df["Profit/Loss"] > 0]["Profit/Loss"].mean()

    portfolio_evaluation_df.loc["Avg Loss per trade"] = trade_evaluation_df[trade_evaluation_df["Profit/Loss"] < 0]["Profit/Loss"].mean()

    # Create a DataFrame that contains the Portfolio Daily Returns column
    sortino_ratio_df = KDJ_df[["Portfolio Daily Returns"]].copy()

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