#!/usr/bin/env python3
"""Regime-by-regime scenario backtest + parameter-robustness sweep.

Writes:
    results/scenarios.md        per-regime total return & drawdown per strategy
    results/robustness.md       parameter sweeps (SMA window, momentum lookback, mix)
"""
from __future__ import annotations

import os
import sys

import pandas as pd

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from backtest import data, strategies, engine, metrics, scenarios  # noqa: E402

RESULTS = os.path.join(os.path.dirname(os.path.abspath(__file__)), "results")
COST = 0.0005
INITIAL = 10_000.0


def _full_equities():
    """Full-history equity curves for each strategy (signals warmed up)."""
    spy = data.load_prices("SPY")
    panel = data.load_panel(["SPY", "QQQ", "TLT"])
    spy_ret = data.weekly_returns(spy[["adj_close"]]).rename(columns={"adj_close": "SPY"})
    panel_ret = panel.pct_change().dropna()

    eq = {}
    eq["SPY buy & hold"] = engine.backtest_weights(
        spy_ret, strategies.buy_and_hold(spy, "SPY"), COST, INITIAL)
    eq["SPY 40wk SMA trend"] = engine.backtest_weights(
        spy_ret, strategies.sma_trend(spy["adj_close"], "SPY", 40), COST, INITIAL)
    eq["60/40 SPY/TLT"] = engine.backtest_weights(
        panel_ret, strategies.static_mix(panel, {"SPY": 0.6, "TLT": 0.4}), COST, INITIAL)
    eq["Dual momentum"] = engine.backtest_weights(
        panel_ret, strategies.dual_momentum(panel, ["SPY", "QQQ"], "TLT", 26), COST, INITIAL)
    return eq


def scenario_report():
    eq = _full_equities()
    rows = []
    for label, start, end, kind in scenarios.REGIMES:
        row = {"regime": label, "kind": kind, "window": f"{start[:7]}..{end[:7]}"}
        for name, curve in eq.items():
            sub = scenarios.slice_window(curve, start, end)
            st = scenarios.regime_stats(sub)
            ret = st["total_return_pct"]
            dd = st["max_dd_pct"]
            row[name] = f"{ret:+.0f}% (dd {dd:.0f}%)" if ret is not None else "n/a"
        rows.append(row)
    df = pd.DataFrame(rows).set_index("regime")
    md = ["# Scenario backtest: performance by market regime", "",
          "Total return over each window, worst intra-window drawdown in parentheses.",
          "Trend/momentum positions are warmed up on prior history, so each row",
          "reflects the position actually held entering the regime. `n/a` = the",
          "asset (TLT, from 2002) has no data for that window.", "",
          df.to_markdown(), "",
          "**Read:** buy & hold captures every bull but eats the full bear; the",
          "40-week SMA trend and 60/40 are the ones that limit the crash windows",
          "(dot-com, GFC, 2022). Fast crashes (2018 Q4, COVID) are too quick for a",
          "weekly trend filter to dodge cleanly.", ""]
    with open(os.path.join(RESULTS, "scenarios.md"), "w") as f:
        f.write("\n".join(md))
    print(df.to_string())


def robustness_report():
    spy = data.load_prices("SPY")
    panel = data.load_panel(["SPY", "QQQ", "TLT"])
    spy_ret = data.weekly_returns(spy[["adj_close"]]).rename(columns={"adj_close": "SPY"})
    panel_ret = panel.pct_change().dropna()

    md = ["# Parameter robustness", "",
          "If a strategy only works at one magic parameter it is curve-fit. These",
          "sweeps show the low-risk strategies are stable across nearby settings.", ""]

    # SMA window sweep
    md.append("## SPY SMA trend - window (weeks)")
    rows = []
    for w in [26, 30, 40, 50, 52]:
        e = engine.backtest_weights(spy_ret, strategies.sma_trend(spy["adj_close"], "SPY", w),
                                    COST, INITIAL)
        s = metrics.performance_summary(e, rf_annual=0.03)
        rows.append({"window": w, "cagr_pct": s["cagr_pct"], "max_dd_pct": s["max_drawdown_pct"],
                     "sharpe": s["sharpe"], "calmar": s["calmar"]})
    md.append(pd.DataFrame(rows).set_index("window").to_markdown())
    md.append("")

    # Momentum lookback sweep
    md.append("## Dual momentum - lookback (weeks)")
    rows = []
    for lb in [13, 26, 39, 52]:
        e = engine.backtest_weights(panel_ret, strategies.dual_momentum(panel, ["SPY", "QQQ"], "TLT", lb),
                                    COST, INITIAL)
        s = metrics.performance_summary(e, rf_annual=0.03)
        rows.append({"lookback": lb, "cagr_pct": s["cagr_pct"], "max_dd_pct": s["max_drawdown_pct"],
                     "sharpe": s["sharpe"], "calmar": s["calmar"]})
    md.append(pd.DataFrame(rows).set_index("lookback").to_markdown())
    md.append("")

    # Stock/bond mix sweep
    md.append("## Static mix - SPY / TLT weight")
    rows = []
    for sw in [0.4, 0.5, 0.6, 0.7, 0.8]:
        e = engine.backtest_weights(panel_ret, strategies.static_mix(panel, {"SPY": sw, "TLT": round(1-sw,2)}),
                                    COST, INITIAL)
        s = metrics.performance_summary(e, rf_annual=0.03)
        rows.append({"spy_weight": sw, "cagr_pct": s["cagr_pct"], "max_dd_pct": s["max_drawdown_pct"],
                     "sharpe": s["sharpe"], "calmar": s["calmar"]})
    md.append(pd.DataFrame(rows).set_index("spy_weight").to_markdown())
    md.append("")
    with open(os.path.join(RESULTS, "robustness.md"), "w") as f:
        f.write("\n".join(md))
    print("\nRobustness sweeps written.")


if __name__ == "__main__":
    os.makedirs(RESULTS, exist_ok=True)
    scenario_report()
    robustness_report()
