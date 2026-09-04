"""Data loading and return computation.

Reads Alpha Vantage weekly-adjusted CSVs (newest-first) and returns clean,
date-ascending price frames. `adjusted close` already accounts for dividends
and splits, so returns computed from it are total returns.
"""
from __future__ import annotations

import os
import pandas as pd

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")


def load_prices(symbol: str, data_dir: str | None = None) -> pd.DataFrame:
    """Load one symbol's weekly OHLCV+adjusted frame, indexed by date ascending."""
    data_dir = data_dir or DATA_DIR
    path = os.path.join(data_dir, f"{symbol}_weekly.csv")
    df = pd.read_csv(path)
    df["timestamp"] = pd.to_datetime(df["timestamp"])
    df = df.rename(columns={"adjusted close": "adj_close"})
    df = df.sort_values("timestamp").set_index("timestamp")
    return df[["open", "high", "low", "close", "adj_close", "volume", "dividend amount"]]


def load_panel(symbols: list[str], data_dir: str | None = None) -> pd.DataFrame:
    """Adjusted-close panel (columns=symbols) aligned on the intersection of dates."""
    series = {s: load_prices(s, data_dir)["adj_close"] for s in symbols}
    panel = pd.DataFrame(series).dropna()
    return panel


def weekly_returns(prices: pd.DataFrame | pd.Series) -> pd.DataFrame | pd.Series:
    """Simple weekly total returns from an adjusted-close frame/series."""
    return prices.pct_change().dropna()
