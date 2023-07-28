import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

def read_dataframes():
    MACD_df = pd.read_csv('MACD_file.csv')
    Trix_df = pd.read_csv('Trix_file.csv')
    KDJ_df = pd.read_csv('KDJ_file.csv')
    return MACD_df, Trix_df, KDJ_df

def concatenate_dataframes(MACD_df, Trix_df, KDJ_df):
    PM_df = pd.concat([MACD_df[["Date", "Portfolio MACD Total"]],
                       Trix_df[["Portfolio Trix Total"]],
                       KDJ_df[["Portfolio KDJ Total"]]], axis=1)
    PM_df["Portfolio Asset"] = PM_df[["Portfolio MACD Total", "Portfolio Trix Total", "Portfolio KDJ Total"]].sum(axis=1)
    PM_df['Portfolio Daily Returns'] = PM_df["Portfolio Asset"].pct_change()
    
    PM_df = PM_df.replace([np.inf, -np.inf], np.nan)    
    
    PM_df['Portfolio Cumulative Returns'] = (1 + PM_df['Portfolio Daily Returns']).cumprod() - 1
    PM_df.to_csv('PM_file.csv', index=True) 
    
    # Plot "Portfolio Cumulative Returns"
    plt.figure(figsize=(20, 10))
    plt.plot(PM_df["Date"], PM_df["Portfolio Cumulative Returns"])
    plt.xlabel("Date")
    plt.ylabel("Cumulative Returns")
    plt.title("Portfolio Cumulative Returns")
    plt.xticks(rotation=45, fontsize=5)
    
    plt.show()        
    
    return PM_df

def evaluate_portfolio(PM_df):
    # Create a list for the column name
    columns = ["Backtest"]

    # Create a list holding the names of the new evaluation metrics
    metrics = [
        "Annualized Return",
        "Cumulative Returns",
        "Annual Volatility",
        "Sharpe Ratio",
        "Sortino Ratio",
    ]

    # Initialize the DataFrame with index set to the evaluation metrics and the column
    portfolio_evaluation_df = pd.DataFrame(index=metrics, columns=columns)
   
    portfolio_evaluation_df.loc["Annualized Return"] = round((PM_df["Portfolio Daily Returns"].mean() * 252), 2)
    portfolio_evaluation_df.loc["Cumulative Returns"] = round((PM_df["Portfolio Cumulative Returns"].iloc[-1]), 2)
    portfolio_evaluation_df.loc["Annual Volatility"] = round((PM_df["Portfolio Daily Returns"].std() * np.sqrt(252)), 2)

    portfolio_evaluation_df.loc["Sharpe Ratio"] = round(((PM_df["Portfolio Daily Returns"].mean() * 252) / (PM_df["Portfolio Daily Returns"].std() * np.sqrt(252))), 2)

    # Create a DataFrame that contains the Portfolio Daily Returns column
    sortino_ratio_df = PM_df[["Portfolio Daily Returns"]].copy()

    # Create a column to hold downside return values
    sortino_ratio_df.loc[:, "Downside Returns"] = 0

    # Find Portfolio Daily Returns values less than 0,
    # square those values, and add them to the Downside Returns column
    sortino_ratio_df.loc[sortino_ratio_df["Portfolio Daily Returns"] < 0, "Downside Returns"] = sortino_ratio_df["Portfolio Daily Returns"]**2

    # Calculate the annualized return value
    annualized_return = (sortino_ratio_df["Portfolio Daily Returns"].mean() * 252)
    downside_standard_deviation = (np.sqrt(sortino_ratio_df["Downside Returns"].mean()) * np.sqrt(252))
    sortino_ratio = annualized_return / downside_standard_deviation

    # Add the Sortino ratio to the evaluation DataFrame
    portfolio_evaluation_df.loc["Sortino Ratio"] = round(sortino_ratio, 2)
    
    evaluation_result_transposed = portfolio_evaluation_df.transpose()

    plt.figure(figsize=(8, 4))
    plt.table(cellText=evaluation_result_transposed.values, 
              colLabels=evaluation_result_transposed.columns, 
              cellLoc='center', loc='center', colColours=['#f5f5f5']*len(evaluation_result_transposed.columns))
    plt.title("Portfolio Backtest Statistic Results")
    plt.axis('off')
    plt.show()

    return portfolio_evaluation_df


