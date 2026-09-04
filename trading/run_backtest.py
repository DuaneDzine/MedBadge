#!/usr/bin/env python3
"""Run all strategies on real weekly data and emit a comparison report.

Usage:
    python3 run_backtest.py                # full run, writes results/
    python3 run_backtest.py --initial 5000 --dca 50

Outputs:
    results/summary.csv        machine-readable metric table
    results/summary.md         human-readable report
    results/equity_curves.csv  weekly equity curve per strategy
"""
from __future__ import annotations

import argparse
import os
import sys

import pandas as pd

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from backtest import data, strategies, engine, metrics  # noqa: E402

RESULTS = os.path.join(os.path.dirname(os.path.abspath(__file__)), "results")
RF_ANNUAL = 0.03  # flat 3% risk-free assumption for Sharpe


def run(initial: float, dca_amount: float, cost: float) -> None:
    os.makedirs(RESULTS, exist_ok=True)
    spy = data.load_prices("SPY")
    panel_all = data.load_panel(["SPY", "QQQ", "TLT"])  # common window (2002+)

    rows = []
    curves = {}

    # ---- Table A: SPY-only, full history ----
    spy_ret = data.weekly_returns(spy[["adj_close"]]).rename(columns={"adj_close": "SPY"})

    bh_w = strategies.buy_and_hold(spy, "SPY")
    bh_eq = engine.backtest_weights(spy_ret, bh_w, cost, initial)
    curves["SPY_buy_hold"] = bh_eq
    rows.append({"strategy": "SPY buy & hold", "period": _period(bh_eq),
                 **metrics.performance_summary(bh_eq, rf_annual=RF_ANNUAL)})

    sma_w = strategies.sma_trend(spy["adj_close"], "SPY", window=40)
    sma_eq = engine.backtest_weights(spy_ret, sma_w, cost, initial)
    curves["SPY_sma40_trend"] = sma_eq
    rows.append({"strategy": "SPY 40wk SMA trend", "period": _period(sma_eq),
                 **metrics.performance_summary(sma_eq, rf_annual=RF_ANNUAL)})

    # DCA reported separately (money-weighted); equity curve still saved.
    dca = engine.backtest_dca(spy["adj_close"], contribution=dca_amount, freq_weeks=1)
    curves["SPY_dca_weekly"] = dca["equity"]

    # ---- Table B: multi-asset, common window (apples-to-apples) ----
    panel_ret = panel_all.pct_change().dropna()

    b_bh = engine.backtest_weights(panel_ret, strategies.buy_and_hold(panel_all, "SPY"),
                                   cost, initial)
    curves["cmn_SPY_buy_hold"] = b_bh
    rows.append({"strategy": "[common] SPY buy & hold", "period": _period(b_bh),
                 **metrics.performance_summary(b_bh, rf_annual=RF_ANNUAL)})

    mix = engine.backtest_weights(panel_ret,
                                  strategies.static_mix(panel_all, {"SPY": 0.6, "TLT": 0.4}),
                                  cost, initial)
    curves["cmn_60_40"] = mix
    rows.append({"strategy": "[common] 60/40 SPY/TLT", "period": _period(mix),
                 **metrics.performance_summary(mix, rf_annual=RF_ANNUAL)})

    dm = engine.backtest_weights(panel_ret,
                                 strategies.dual_momentum(panel_all, ["SPY", "QQQ"], "TLT", 26),
                                 cost, initial)
    curves["cmn_dual_momentum"] = dm
    rows.append({"strategy": "[common] Dual momentum SPY/QQQ/TLT", "period": _period(dm),
                 **metrics.performance_summary(dm, rf_annual=RF_ANNUAL)})

    b_sma = engine.backtest_weights(
        panel_ret,
        strategies.sma_trend(panel_all["SPY"], "SPY", 40).reindex(columns=["SPY"]),
        cost, initial)
    curves["cmn_SPY_sma40"] = b_sma
    rows.append({"strategy": "[common] SPY 40wk SMA trend", "period": _period(b_sma),
                 **metrics.performance_summary(b_sma, rf_annual=RF_ANNUAL)})

    summary = pd.DataFrame(rows).set_index("strategy")
    summary.to_csv(os.path.join(RESULTS, "summary.csv"))

    curves_df = pd.DataFrame(curves)
    curves_df.to_csv(os.path.join(RESULTS, "equity_curves.csv"))

    _write_markdown(summary, dca, initial, dca_amount, cost)
    _print(summary, dca, initial, dca_amount)


def _period(eq: pd.Series) -> str:
    return f"{eq.index[0].date()}..{eq.index[-1].date()}"


def _print(summary: pd.DataFrame, dca: dict, initial: float, dca_amount: float) -> None:
    cols = ["cagr_pct", "vol_pct", "sharpe", "max_drawdown_pct", "calmar",
            "pct_weeks_positive", "final_value"]
    print(f"\nLump-sum start capital: ${initial:,.0f}   (transaction cost per unit turnover applied)\n")
    print(summary[cols].to_string())
    print("\nDollar-cost averaging (SPY, ${:.0f}/week, fractional shares):".format(dca_amount))
    print(f"  invested ${dca['invested']:,.0f} -> ${dca['final_value']:,.0f} "
          f"(+{dca['money_weighted_return_pct']}% total, ~{dca['irr_annual_pct']}%/yr IRR)")


def _write_markdown(summary: pd.DataFrame, dca: dict, initial: float,
                    dca_amount: float, cost: float) -> None:
    cols = ["period", "cagr_pct", "vol_pct", "sharpe", "max_drawdown_pct",
            "calmar", "pct_weeks_positive", "final_value"]
    md = ["# Backtest results (real weekly data)", ""]
    md.append(f"- Lump-sum start capital: **${initial:,.0f}**")
    md.append(f"- Transaction cost: **{cost*100:.2f}%** per unit of turnover "
              "(Robinhood equities are commission-free; this models slippage)")
    md.append(f"- Sharpe uses a flat **{RF_ANNUAL*100:.0f}%** annual risk-free rate")
    md.append("- Returns use dividend/split-adjusted closes (total return)")
    md.append("")
    md.append(summary[cols].to_markdown())
    md.append("")
    md.append("## Dollar-cost averaging (SPY)")
    md.append(f"- Contribution: **${dca_amount:.0f}/week** via fractional shares")
    md.append(f"- Invested **${dca['invested']:,.0f}** -> final **${dca['final_value']:,.0f}** "
              f"(**+{dca['money_weighted_return_pct']}%**, ~**{dca['irr_annual_pct']}%/yr** IRR)")
    md.append("")
    md.append("> DCA is money-weighted (IRR) because capital is deployed gradually; "
              "it is not directly comparable to the lump-sum time-weighted CAGR above.")
    md.append("")
    with open(os.path.join(RESULTS, "summary.md"), "w") as f:
        f.write("\n".join(md))


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--initial", type=float, default=10_000.0)
    ap.add_argument("--dca", type=float, default=100.0, help="weekly DCA contribution")
    ap.add_argument("--cost", type=float, default=0.0005, help="cost per unit turnover")
    args = ap.parse_args()
    run(args.initial, args.dca, args.cost)
