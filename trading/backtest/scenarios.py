"""Named market-regime windows and per-regime scoring.

Signals for trend/momentum strategies are computed over the FULL history and
only then sliced into a regime window, so each window is scored with the
position the strategy actually held going in (no cold-start-to-cash artifact
at the window boundary).
"""
from __future__ import annotations

import pandas as pd

# (label, start, end, kind) - dates are inclusive-ish week boundaries.
REGIMES = [
    ("Dot-com crash",        "2000-03-24", "2002-10-09", "bear"),
    ("2003-07 recovery bull", "2002-10-09", "2007-10-09", "bull"),
    ("Global Financial Crisis", "2007-10-09", "2009-03-09", "bear"),
    ("2009-18 QE bull",      "2009-03-09", "2018-09-20", "bull"),
    ("2018 Q4 selloff",      "2018-09-20", "2018-12-24", "bear"),
    ("COVID crash",          "2020-02-19", "2020-03-23", "bear"),
    ("COVID recovery",       "2020-03-23", "2022-01-03", "bull"),
    ("2022 rate-hike bear",  "2022-01-03", "2022-10-12", "bear"),
    ("2022-26 bull",         "2022-10-12", "2026-09-03", "bull"),
]


def slice_window(equity: pd.Series, start: str, end: str) -> pd.Series:
    """Sub-curve for a window, re-based to 1.0 at the last point before start."""
    start, end = pd.Timestamp(start), pd.Timestamp(end)
    pre = equity[equity.index < start]
    win = equity[(equity.index >= start) & (equity.index <= end)]
    if win.empty:
        return win
    base = pre.iloc[-1] if len(pre) else win.iloc[0]
    return pd.concat([pd.Series([base], index=[pre.index[-1] if len(pre) else win.index[0]]),
                      win]) / base


def regime_stats(equity: pd.Series) -> dict:
    """Total return and worst intra-window drawdown for a re-based sub-curve."""
    if equity is None or len(equity) < 2:
        return {"total_return_pct": None, "max_dd_pct": None, "weeks": 0}
    total = equity.iloc[-1] / equity.iloc[0] - 1.0
    dd = (equity / equity.cummax() - 1.0).min()
    return {
        "total_return_pct": round(total * 100, 1),
        "max_dd_pct": round(dd * 100, 1),
        "weeks": len(equity) - 1,
    }
