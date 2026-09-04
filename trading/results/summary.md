# Backtest results (real weekly data)

- Lump-sum start capital: **$10,000**
- Transaction cost: **0.05%** per unit of turnover (Robinhood equities are commission-free; this models slippage)
- Sharpe uses a flat **3%** annual risk-free rate
- Returns use dividend/split-adjusted closes (total return)

| strategy                           | period                 |   cagr_pct |   vol_pct |   sharpe |   max_drawdown_pct |   calmar |   pct_weeks_positive |   final_value |
|:-----------------------------------|:-----------------------|-----------:|----------:|---------:|-------------------:|---------:|---------------------:|--------------:|
| SPY buy & hold                     | 1999-11-19..2026-09-03 |       8.4  |     17.66 |     0.38 |              -54.6 |     0.15 |                 56.3 |       86868.9 |
| SPY 40wk SMA trend                 | 1999-11-19..2026-09-03 |       6.9  |     10.86 |     0.39 |              -20.2 |     0.34 |                 41.6 |       59694.4 |
| [common] SPY buy & hold            | 2002-08-09..2026-09-03 |      11.29 |     17.18 |     0.53 |              -54.6 |     0.21 |                 57.6 |      131303   |
| [common] 60/40 SPY/TLT             | 2002-08-09..2026-09-03 |       8.84 |     10.36 |     0.58 |              -29.8 |     0.3  |                 58.1 |       76736.1 |
| [common] Dual momentum SPY/QQQ/TLT | 2002-08-09..2026-09-03 |       7.86 |     15.72 |     0.37 |              -34.2 |     0.23 |                 54.6 |       61767   |
| [common] SPY 40wk SMA trend        | 2002-08-09..2026-09-03 |       8.35 |     11.31 |     0.5  |              -20.2 |     0.41 |                 45.9 |       68860.3 |

## Dollar-cost averaging (SPY)
- Contribution: **$100/week** via fractional shares
- Invested **$140,000** -> final **$866,934** (**+519.2%**, ~**11.68%/yr** IRR)

> DCA is money-weighted (IRR) because capital is deployed gradually; it is not directly comparable to the lump-sum time-weighted CAGR above.
