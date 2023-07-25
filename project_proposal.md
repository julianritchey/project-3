# Project Proposal
Project 3 (Capstone) for FinTech bootcamp.

## Project title
**Investor's Dream v3.0**

## Team members
- Andrea Delgadillo Tomasevich
- Dmitry Chalganov
- John Yin
- Julian Ritchey
- Wanlin Li

## Project description
Investor's Dream v3.0 will provide users two primary features:
- The ability to create custom trading strategies.
- The ability to subscribe to notifications from custom or pre-existing trading strategies on a monthly or yearly basis.

### Strategy creation
Users will be able to create their own strategies using a variety of indicators and custom-defined conditions, such as:
- Timeframe (`1h`, `1D`, `1M`, etc.)
- Indicators utilized, if applicable (`BB`, `EMA`, `VOL`, etc.)
- Methodology (buy upon retest of market structure break, sell upon swing failure pattern, etc.)

### Strategy subscription
Users will be able to subscribe to either a strategy they've created or a strategy another user has created. The feature may include the following:
- The ability to backtest a strategy on any asset of the user's choosing.
- The ability to subscribe to notifications from strategies on any asset of the user's choosing.
- A display of strategy details, such as:
  - Title
  - Description/methodology (buy upon retest of market structure break, sell upon swing failure pattern, etc.)
- A display of details relating to a completed strategy backtest, such as:
  - Max performance
  - Min performance
  - Sharpe ratio
  - Standard deviation

## Questions to answer
- How can an application draw in first-time investors?
- How can an application facilitate investment decisions?
- How can an application improve portfolio performance?
- How can an application monetize its features/services?
- How can an application facilitate fee transactions for features/services?
- How can a company make an initial public offering on blockchain?

## Datasets to be used
- Historic market data
- User investments
- Trading indicators

## Rough breakdown of tasks
- Create low-timeframe (minutes) trading strategy for testing and presentation *- John*
- Create smart contract for minting project token. *- Dmitry*
- Create smart contract for subscribing to strategy notifications. (Monthly and yearly fixed fees) *- Andrea*
- Create layout for strategy creation. *- Julian*
- Create API connections for notification methods. (E.g. Telegram, Discord, SMS, etc.) *- Wanlin*
