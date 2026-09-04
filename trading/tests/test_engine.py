"""Self-contained validation tests (run with `python3 tests/test_engine.py`
or `pytest`). They assert the engine has no look-ahead bias and that the
metric math is correct against hand-computable cases.
"""
import os
import sys

import numpy as np
import pandas as pd

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from backtest import engine, metrics, strategies  # noqa: E402


def _dates(n):
    return pd.date_range("2020-01-05", periods=n, freq="W")


def test_buy_and_hold_matches_compounded_returns():
    idx = _dates(6)
    ret = pd.DataFrame({"SPY": [0.0, 0.01, -0.02, 0.03, 0.01, -0.01]}, index=idx)
    w = pd.DataFrame({"SPY": 1.0}, index=idx)
    eq = engine.backtest_weights(ret, w, cost_per_turnover=0.0, initial=100.0)
    # With a one-week execution lag, week-0 return is not earned (no prior weight).
    expected = 100.0 * np.prod([1 + r for r in ret["SPY"].iloc[1:]])
    assert abs(eq.iloc[-1] - expected) < 1e-6, (eq.iloc[-1], expected)


def test_no_lookahead():
    # A spike return in week k must never be captured by a weight decided in
    # week k (only a weight from week k-1 can earn it). Put all return in week 3.
    idx = _dates(6)
    ret = pd.DataFrame({"A": [0, 0, 0, 0.5, 0, 0]}, index=idx, dtype=float)
    # Strategy that is only invested exactly on the spike week -> must earn 0,
    # because execution lags by one week.
    w = pd.DataFrame({"A": [0, 0, 0, 1, 0, 0]}, index=idx, dtype=float)
    eq = engine.backtest_weights(ret, w, cost_per_turnover=0.0, initial=100.0)
    assert abs(eq.iloc[-1] - 100.0) < 1e-9, eq.iloc[-1]
    # Being invested the week BEFORE the spike captures it.
    w2 = pd.DataFrame({"A": [0, 0, 1, 0, 0, 0]}, index=idx, dtype=float)
    eq2 = engine.backtest_weights(ret, w2, cost_per_turnover=0.0, initial=100.0)
    assert abs(eq2.iloc[-1] - 150.0) < 1e-9, eq2.iloc[-1]


def test_dca_flat_price_no_profit():
    idx = _dates(10)
    prices = pd.Series([100.0] * 10, index=idx)
    res = engine.backtest_dca(prices, contribution=100.0, freq_weeks=1)
    assert res["invested"] == 1000.0
    assert abs(res["final_value"] - 1000.0) < 1e-6
    assert abs(res["profit"]) < 1e-6


def test_cagr_and_drawdown_math():
    idx = pd.date_range("2020-01-01", periods=2, freq="365D")
    eq = pd.Series([100.0, 200.0], index=idx)  # doubled in ~1 year
    assert abs(metrics.cagr(eq) - 1.0) < 0.02  # ~100%/yr
    dd_eq = pd.Series([100, 120, 60, 90], index=_dates(4))
    assert abs(metrics.max_drawdown(dd_eq) - (-0.5)) < 1e-9  # 120 -> 60


def test_sma_trend_goes_to_cash_below_average():
    idx = _dates(60)
    # Rising then crashing price; trend filter should exit near the top.
    prices = pd.Series(list(range(50, 90)) + list(range(89, 69, -1)), index=idx, dtype=float)
    w = strategies.sma_trend(prices, "X", window=10)
    assert w["X"].iloc[5] == 0.0  # not enough history -> cash
    assert w["X"].iloc[25] == 1.0  # uptrend -> invested
    assert w["X"].iloc[-1] == 0.0  # downtrend -> cash


def _run_all():
    fns = [v for k, v in globals().items() if k.startswith("test_") and callable(v)]
    for fn in fns:
        fn()
        print(f"PASS {fn.__name__}")
    print(f"\n{len(fns)} tests passed")


if __name__ == "__main__":
    _run_all()
