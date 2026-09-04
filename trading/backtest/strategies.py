"""Strategy definitions. Each returns a target-weight DataFrame aligned to a
price index. Weights are decisions made at each week's close; the engine
applies them to the FOLLOWING week's return (one-week lag), so none of these
look ahead.

All are chosen for the Robinhood context: commission-free, fractional shares
(so any capital works), long-only, no leverage, no options, no margin.
"""
from __future__ import annotations

import pandas as pd


def buy_and_hold(prices: pd.DataFrame, asset: str) -> pd.DataFrame:
    """Always 100% invested in one asset. The baseline."""
    w = pd.DataFrame(0.0, index=prices.index, columns=[asset])
    w[asset] = 1.0
    return w


def sma_trend(prices_adj: pd.Series, asset: str, window: int = 40) -> pd.DataFrame:
    """Hold the asset while its price is above its N-week SMA, else hold cash.

    40 weeks ~= the 200-day moving average, a well-known trend filter that
    sidesteps the deepest bear markets at the cost of some whipsaws.
    """
    sma = prices_adj.rolling(window).mean()
    signal = (prices_adj > sma).astype(float)
    signal[sma.isna()] = 0.0
    w = pd.DataFrame({asset: signal})
    return w


def dual_momentum(panel: pd.DataFrame, risky: list[str], safe: str,
                  lookback: int = 26) -> pd.DataFrame:
    """Relative + absolute momentum (Antonacci-style GEM, weekly).

    Each week: among the risky assets pick the one with the highest trailing
    `lookback`-week return. If that return is positive AND beats the safe
    asset's trailing return, hold it; otherwise rotate to the safe asset.
    Low turnover, historically shallow drawdowns.
    """
    trailing = panel.pct_change(lookback)
    cols = risky + [safe]
    w = pd.DataFrame(0.0, index=panel.index, columns=cols)
    for date, row in trailing.iterrows():
        if row[risky].isna().any() or pd.isna(row[safe]):
            w.loc[date, safe] = 1.0  # not enough history -> defensive
            continue
        best = row[risky].idxmax()
        if row[best] > 0 and row[best] > row[safe]:
            w.loc[date, best] = 1.0
        else:
            w.loc[date, safe] = 1.0
    return w


def static_mix(panel: pd.DataFrame, weights: dict) -> pd.DataFrame:
    """Fixed-weight portfolio rebalanced each week (e.g. 60/40 SPY/TLT)."""
    w = pd.DataFrame(0.0, index=panel.index, columns=list(weights.keys()))
    for k, v in weights.items():
        w[k] = v
    return w
