"""Core backtest engines.

Two execution models:

1. backtest_weights - a strategy emits target portfolio weights each week.
   To avoid look-ahead bias, the weights decided using data through the close
   of week t are applied to the return earned from week t to t+1 (a one-week
   execution lag via .shift(1)). Turnover between consecutive weight vectors
   is charged an optional per-unit cost (Robinhood equities are commission
   free, so the default is a small slippage estimate, not a commission).

2. backtest_dca - dollar-cost averaging: invest a fixed cash amount every
   `freq_weeks` into one asset using fractional shares. Reported with a
   money-weighted (IRR) return because capital is deployed gradually and is
   not directly comparable to a lump-sum time-weighted return.
"""
from __future__ import annotations

import numpy as np
import pandas as pd


def backtest_weights(returns: pd.DataFrame, weights: pd.DataFrame,
                     cost_per_turnover: float = 0.0005,
                     initial: float = 10_000.0) -> pd.Series:
    """Equity curve for a target-weight strategy.

    returns: weekly simple returns, columns = assets.
    weights: target weights per week, same columns; a cash weight is implied
             by (1 - row sum) and earns zero.
    """
    weights = weights.reindex(returns.index).fillna(0.0)
    # Execute with a one-week lag: last week's decision earns this week's return.
    applied = weights.shift(1).fillna(0.0)
    gross = (applied * returns).sum(axis=1)
    # Transaction cost on turnover (sum of absolute weight changes).
    turnover = weights.diff().abs().sum(axis=1).fillna(0.0)
    cost = turnover * cost_per_turnover
    net = gross - cost
    equity = (1.0 + net).cumprod() * initial
    equity.iloc[0] = initial  # anchor start
    return equity


def backtest_dca(prices: pd.Series, contribution: float = 100.0,
                 freq_weeks: int = 1) -> dict:
    """Dollar-cost average a fixed contribution into one asset.

    Returns a dict with the equity curve, total invested, final value, and a
    money-weighted annual return (IRR) so gradual deployment is scored fairly.
    """
    prices = prices.dropna()
    idx = prices.index
    shares = 0.0
    invested = 0.0
    equity = []
    cashflows = []  # (date, amount) negative = outflow to buy
    for i, (date, px) in enumerate(prices.items()):
        if i % freq_weeks == 0:
            shares += contribution / px
            invested += contribution
            cashflows.append((date, -contribution))
        equity.append(shares * px)
    equity = pd.Series(equity, index=idx)
    final_value = float(equity.iloc[-1])
    cashflows.append((idx[-1], final_value))  # liquidation inflow
    irr_annual = _xirr(cashflows)
    return {
        "equity": equity,
        "invested": round(invested, 2),
        "final_value": round(final_value, 2),
        "profit": round(final_value - invested, 2),
        "money_weighted_return_pct": round((final_value / invested - 1.0) * 100, 1),
        "irr_annual_pct": round(irr_annual * 100, 2) if irr_annual is not None else None,
        "contribution": contribution,
        "freq_weeks": freq_weeks,
    }


def _xirr(cashflows: list[tuple], guess: float = 0.08) -> float | None:
    """Annualized internal rate of return for dated cashflows (bisection)."""
    if not cashflows:
        return None
    t0 = cashflows[0][0]
    times = np.array([(d - t0).days / 365.25 for d, _ in cashflows])
    amts = np.array([a for _, a in cashflows], dtype=float)

    def npv(rate):
        return np.sum(amts / (1.0 + rate) ** times)

    lo, hi = -0.9999, 10.0
    f_lo, f_hi = npv(lo), npv(hi)
    if np.sign(f_lo) == np.sign(f_hi):
        return None
    for _ in range(200):
        mid = (lo + hi) / 2.0
        f_mid = npv(mid)
        if abs(f_mid) < 1e-6:
            return mid
        if np.sign(f_mid) == np.sign(f_lo):
            lo, f_lo = mid, f_mid
        else:
            hi, f_hi = mid, f_mid
    return (lo + hi) / 2.0
