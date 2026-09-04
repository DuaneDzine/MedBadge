"""Performance metrics for weekly-frequency equity curves."""
from __future__ import annotations

import numpy as np
import pandas as pd

WEEKS_PER_YEAR = 52.0


def max_drawdown(equity: pd.Series) -> float:
    """Worst peak-to-trough decline of an equity curve (negative fraction)."""
    running_max = equity.cummax()
    drawdown = equity / running_max - 1.0
    return float(drawdown.min())


def cagr(equity: pd.Series) -> float:
    """Compound annual growth rate from first to last point of an equity curve."""
    if len(equity) < 2:
        return 0.0
    years = (equity.index[-1] - equity.index[0]).days / 365.25
    if years <= 0 or equity.iloc[0] <= 0:
        return 0.0
    return float((equity.iloc[-1] / equity.iloc[0]) ** (1.0 / years) - 1.0)


def annualized_vol(returns: pd.Series) -> float:
    return float(returns.std(ddof=0) * np.sqrt(WEEKS_PER_YEAR))


def sharpe(returns: pd.Series, rf_annual: float = 0.0) -> float:
    """Annualized Sharpe ratio. rf_annual is a flat annual risk-free rate."""
    rf_weekly = rf_annual / WEEKS_PER_YEAR
    excess = returns - rf_weekly
    sd = excess.std(ddof=0)
    if sd == 0:
        return 0.0
    return float(excess.mean() / sd * np.sqrt(WEEKS_PER_YEAR))


def performance_summary(equity: pd.Series, returns: pd.Series | None = None,
                        rf_annual: float = 0.0) -> dict:
    """One-row metric dict for an equity curve (and its period returns)."""
    if returns is None:
        returns = equity.pct_change().dropna()
    mdd = max_drawdown(equity)
    cg = cagr(equity)
    vol = annualized_vol(returns)
    return {
        "final_value": round(float(equity.iloc[-1]), 2),
        "total_return_pct": round(float(equity.iloc[-1] / equity.iloc[0] - 1.0) * 100, 1),
        "cagr_pct": round(cg * 100, 2),
        "vol_pct": round(vol * 100, 2),
        "sharpe": round(sharpe(returns, rf_annual), 2),
        "max_drawdown_pct": round(mdd * 100, 1),
        "calmar": round(cg / abs(mdd), 2) if mdd < 0 else float("nan"),
        "pct_weeks_positive": round(float((returns > 0).mean()) * 100, 1),
        "weeks": int(len(equity)),
    }
