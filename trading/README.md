# Trading assessment & backtesting

A self-contained sandbox for evaluating low-risk, low-capital trading
strategies with **real** market data, built to pair with the Robinhood
trading MCP server. Nothing here places live orders — it is data, backtests,
and an honest assessment.

> Scope note: this lives inside the MedBadge repo only because the working
> branch requested it. It is fully isolated under `trading/` and touches no
> application code.

## 1. Robinhood MCP connection status

The server was registered with the Claude Code CLI:

```
claude mcp add robinhood-trading --transport http https://agent.robinhood.com/mcp/trading
```

It is in the config but shows **"Needs authentication"**. The endpoint
answers every unauthenticated request with `HTTP 401` and an OAuth challenge:

```
www-authenticate: Bearer resource_metadata="https://agent.robinhood.com/.well-known/oauth-protected-resource/mcp/trading"
```

That OAuth handshake is interactive — it requires logging into Robinhood in a
browser and approving access. It cannot be completed from an autonomous
session. **To finish connecting**, in an interactive Claude Code session run
`/mcp`, select `robinhood-trading`, and complete the browser login. Once
authenticated the account/positions/quote/order tools become available.

Because the live account could not be reached, the assessment below uses
independent market data (Alpha Vantage weekly-adjusted history) rather than
your Robinhood balances. When the MCP is connected, the same strategies can
read your real buying power and (optionally) route orders.

## 2. What "lowest risk, least capital" points to on Robinhood

Robinhood equities are commission-free and support **fractional shares**, so
capital is not a barrier — $5 buys a slice of any ETF. The constraint that
actually controls risk is *strategy design*, not account size. That rules in
long-only, no-leverage, no-options, low-turnover approaches and rules out
margin, day-trading, and anything requiring option premium or a large base.

Four strategies were selected and backtested on that basis:

| Strategy | Idea | Why it's low-risk / low-capital |
|---|---|---|
| **Dollar-cost averaging (DCA)** | Buy a fixed $ of a broad ETF every week | No timing risk, works at any dollar amount via fractional shares |
| **40-week SMA trend** | Hold SPY above its 40-week average, else cash | Sidesteps the deep bear markets; ~200-day filter |
| **60/40 SPY/TLT** | Static stock/bond mix, rebalanced | Diversification halves drawdown vs all-equity |
| **Dual momentum** | Rotate to the strongest of SPY/QQQ, or bonds if weak | Absolute-momentum exit avoids sustained crashes |

## 3. Backtest results (real data, 1999–2026)

Data: dividend/split-adjusted weekly closes for SPY, QQQ, TLT (Alpha Vantage).
Full detail and assumptions in [`results/summary.md`](results/summary.md).
Rerun anytime with `python3 run_backtest.py`.

Key figures (Sharpe at a 3% risk-free rate; drawdown is worst peak-to-trough):

| Strategy | CAGR | Max drawdown | Sharpe | Calmar |
|---|---|---|---|---|
| SPY buy & hold (full) | 8.4% | **-54.6%** | 0.38 | 0.15 |
| SPY 40wk SMA trend (full) | 6.9% | **-20.2%** | 0.39 | 0.34 |
| 60/40 SPY/TLT (2002+) | 8.8% | -29.8% | **0.58** | 0.30 |
| SPY 40wk SMA trend (2002+) | 8.4% | **-20.2%** | 0.50 | **0.41** |
| Dual momentum (2002+) | 7.9% | -34.2% | 0.37 | 0.23 |
| SPY buy & hold (2002+) | 11.3% | -54.6% | 0.53 | 0.21 |

Dollar-cost averaging, $100/week into SPY (fractional shares): **$140,000
invested → $866,934**, ~**11.7%/yr** money-weighted (IRR).

### Reading the results
- **Best risk-adjusted, lowest capital: DCA.** It needs no timing skill and
  no minimum balance; the whole return comes from staying invested. This is
  the single most reliable, lowest-effort option and the recommended default.
- **Best drawdown control: the 40-week SMA trend filter.** It cuts the worst
  loss from ~55% to ~20% — the difference between a survivable dip and a
  portfolio-ending crash — while keeping most of the return. Highest Calmar.
- **Best diversified Sharpe: 60/40 SPY/TLT.** Smoothest ride, one rebalance.
- **Dual momentum underperformed** the simpler filters here (weekly cadence
  and a 26-week lookback add whipsaw); it is kept as a documented comparison,
  not a recommendation.

Plain buy & hold has the highest raw return but a 54% drawdown that most
people cannot hold through — which is exactly the risk the other three exist
to reduce.

## 4. Run it yourself

```bash
cd trading
pip install -r requirements.txt
python3 run_backtest.py                 # writes results/
python3 run_backtest.py --initial 5000 --dca 50   # smaller capital
python3 tests/test_engine.py            # validation (no look-ahead, math)
```

Refresh the price data from the Alpha Vantage MCP tool
(`TIME_SERIES_WEEKLY_ADJUSTED`) into `data/<SYMBOL>_weekly.csv`.

## 5. Honest caveats
- Backtests are hypothetical; past performance does not predict the future.
- Weekly cadence hides intra-week moves and assumes an end-of-week fill.
- Costs modeled as 0.05% slippage per unit turnover; taxes are **not** modeled
  (a taxable account changes the trend/rotation strategies materially).
- No parameter search was run, so results are not curve-fit — but that also
  means they are not optimized. Treat them as a baseline, not a target.
- This is research tooling, **not** financial advice and **not** an
  auto-trader. Order routing is deliberately out of scope until you connect
  the MCP and decide, deliberately, to enable it.

## 6. Suggested next steps
1. Connect the Robinhood MCP (`/mcp`) so backtests can read real buying power.
2. Add a daily-data path for anyone wanting finer signals (RSI, faster SMAs).
3. Add a paper-trading dry run that logs intended DCA/trend orders without
   sending them, before any live routing.
