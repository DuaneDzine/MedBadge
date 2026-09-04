"""Lightweight weekly backtesting engine for low-risk, low-capital strategies."""
from .data import load_prices, weekly_returns
from .metrics import performance_summary
from .engine import backtest_weights, backtest_dca

__all__ = [
    "load_prices",
    "weekly_returns",
    "performance_summary",
    "backtest_weights",
    "backtest_dca",
]
