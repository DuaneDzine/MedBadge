# Trading playbook — low-risk, low-capital, Robinhood

A precise, mechanical operating guide derived from the backtests in this
folder (real SPY/QQQ/TLT weekly data, 1999–2026). It is rules, not
predictions. Nothing here is financial advice; it is a documented process.

## 0. Objective & constraints
- **Goal:** capture most of the equity risk premium while keeping the worst
  drawdown survivable, at any capital level.
- **Hard constraints (self-imposed):** long-only, no leverage, no margin, no
  options, no single stocks, no day-trading. Broad ETFs only.
- **Robinhood facts that shape this:** $0 commissions, fractional shares (any
  dollar amount works), and a built-in *Recurring investments* scheduler.
  Cash-account settlement is T+1; avoid the pattern-day-trader rule by never
  making 4+ day trades in 5 business days (these strategies never day-trade).

## 1. The strategy stack (pick by effort tolerance)

| Tier | Strategy | Effort | Worst historical drawdown | Who it's for |
|---|---|---|---|---|
| **1 (default)** | Weekly DCA into a broad ETF | ~0 (automated) | equals buy & hold (~-55%) but averaged in | Everyone; smallest capital |
| **2** | DCA **+** 40–50wk SMA trend overlay | ~2 min/week | ~-20% | Wants crash protection |
| **3** | 60/40 (or 50/50) SPY/TLT, rebalanced | ~10 min/quarter | ~-28% | Wants a smoother ride |

Dual momentum is **not** recommended: it beat buy & hold on drawdown only
with a long (39–52wk) lookback and still whipsawed (see `results/robustness.md`).

## 2. Exact operating rules

### Tier 1 — Dollar-cost averaging (the core)
- **Instrument:** one broad, low-fee ETF — SPY, VOO, or VTI.
- **Amount:** a fixed sum you can sustain through a bear market (e.g. $25–$100/week).
- **Cadence:** weekly or biweekly, same day, via Robinhood Recurring investments.
- **Rule:** buy on schedule regardless of price. **Never** pause or sell on a dip
  — dips are when DCA does its best work (backtest: $100/wk → ~11.7%/yr IRR).
- **Review:** none required. Raise the contribution as income grows.

### Tier 2 — Trend overlay (crash protection)
- **Signal:** 40-week simple moving average of SPY's weekly *close*
  (≈ the 200-day MA). 50-week was marginally better in-sample; 40 is the
  convention. Robustness across 40–52 weeks is flat, so don't optimize it.
- **Check:** once a week, after Friday's close. Two states only:
  - Close **above** the 40wk SMA → be **invested** (hold SPY).
  - Close **below** the 40wk SMA → move that sleeve to **cash/T-bills** (BIL/SGOV).
- **Execution:** act on the next session's open; market order on a liquid ETF.
- **Expect whipsaws:** ~30–40% of weeks are in cash, and some exits reverse
  within weeks. That is the *premium paid* for cutting GFC/dot-com losses from
  ~-50% to ~-13%. Do not abandon the rule after one bad whipsaw.
- **How to combine with Tier 1:** keep DCA contributions running always;
  apply the trend rule only to the *lump* already invested (core-satellite).

### Tier 3 — Static stock/bond mix
- **Weights:** 60/40 SPY/TLT (best Sharpe in-sample) or 50/50 (lowest drawdown).
- **Rebalance:** quarterly, or whenever a sleeve drifts >5 percentage points.
- **Caveat learned from 2022:** stocks and long bonds fell together, so 60/40
  lost ~-26% that year. It diversifies most crashes, not a rate shock.

## 3. Regime decision table (what to expect, not what to guess)

The strategies are mechanical — you do **not** forecast the regime. This table
is only to set expectations so you hold the rule through stress.

| Regime type | Example | Buy & hold | Trend overlay | 60/40 |
|---|---|---|---|---|
| Slow bear | Dot-com, GFC, 2022 | -43% to -54% | **-10% to -13%** | -4% to -30% |
| Fast crash | 2018 Q4, COVID | -16% to -32% | -12% to -15% | -9% to -17% |
| Bull | 2009–18, 2020–21, 2022–26 | full upside | ~55–75% of upside | ~55–75% of upside |

Takeaways: the trend overlay earns its keep in *slow* bears; no weekly rule
dodges a *fast* crash cleanly; in bulls, protection costs upside — that trade
is the whole point.

## 4. Risk limits (mechanical stops on yourself)
- Max single-position weight: 100% of the *equity* sleeve in one broad ETF is
  fine (it's already diversified); never in one company.
- Keep ≥3–6 months expenses in cash **outside** this account first.
- Never invest borrowed money; keep margin disabled.
- No position added on a >X% down day out of "conviction" — schedule only.

## 5. Backtest → live checklist
1. `pip install -r requirements.txt`
2. `python3 run_backtest.py` — headline metrics (`results/summary.md`).
3. `python3 run_scenarios.py` — regime + robustness (`results/scenarios.md`, `results/robustness.md`).
4. `python3 tests/test_engine.py` — confirm no look-ahead / correct math.
5. Refresh data from the Alpha Vantage `TIME_SERIES_WEEKLY_ADJUSTED` tool into
   `data/<SYMBOL>_weekly.csv` before trusting recent signals.
6. **Paper-trade the trend rule for one full quarter** (log intended buys/sells,
   send nothing) before any live routing.
7. Connect the Robinhood MCP (`/mcp`, interactive) to read live buying power.
   Keep order routing manual until you have watched the signals for a quarter.

## 6. What NOT to do
- No options, leverage (no 2x/3x ETFs), margin, or shorting.
- No single-stock concentration or "hot tip" trades.
- No discretionary overrides of the mechanical signal.
- No performance-chasing into last year's winner.

## 7. Honest caveats
- Backtests are hypothetical; the future can differ from every regime shown.
- Weekly cadence assumes an end-of-week decision and next-open fill.
- Taxes are not modeled — the trend overlay realizes gains and is far more
  tax-efficient inside an IRA/Roth than a taxable account.
- Parameters were sanity-checked for robustness, not optimized; treat the
  numbers as a baseline, not a target.
