# Scenario backtest: performance by market regime

Total return over each window, worst intra-window drawdown in parentheses.
Trend/momentum positions are warmed up on prior history, so each row
reflects the position actually held entering the regime. `n/a` = the
asset (TLT, from 2002) has no data for that window.

| regime                  | kind   | window           | SPY buy & hold   | SPY 40wk SMA trend   | 60/40 SPY/TLT   | Dual momentum   |
|:------------------------|:-------|:-----------------|:-----------------|:---------------------|:----------------|:----------------|
| Dot-com crash           | bear   | 2000-03..2002-10 | -43% (dd -46%)   | -13% (dd -16%)       | -4% (dd -7%)    | +6% (dd -0%)    |
| 2003-07 recovery bull   | bull   | 2002-10..2007-10 | +111% (dd -11%)  | +45% (dd -11%)       | +74% (dd -6%)   | +30% (dd -26%)  |
| Global Financial Crisis | bear   | 2007-10..2009-03 | -54% (dd -55%)   | -12% (dd -12%)       | -30% (dd -30%)  | -3% (dd -18%)   |
| 2009-18 QE bull         | bull   | 2009-03..2018-09 | +412% (dd -17%)  | +132% (dd -20%)      | +237% (dd -7%)  | +162% (dd -24%) |
| 2018 Q4 selloff         | bear   | 2018-09..2018-12 | -16% (dd -17%)   | -14% (dd -15%)       | -9% (dd -9%)    | -14% (dd -16%)  |
| COVID crash             | bear   | 2020-02..2020-03 | -32% (dd -32%)   | -12% (dd -12%)       | -17% (dd -17%)  | -15% (dd -18%)  |
| COVID recovery          | bull   | 2020-03..2022-01 | +113% (dd -6%)   | +60% (dd -6%)        | +57% (dd -5%)   | +49% (dd -10%)  |
| 2022 rate-hike bear     | bear   | 2022-01..2022-10 | -23% (dd -24%)   | -10% (dd -10%)       | -26% (dd -26%)  | -28% (dd -28%)  |
| 2022-26 bull            | bull   | 2022-10..2026-09 | +124% (dd -17%)  | +70% (dd -10%)       | +62% (dd -12%)  | +76% (dd -16%)  |

**Read:** buy & hold captures every bull but eats the full bear; the
40-week SMA trend and 60/40 are the ones that limit the crash windows
(dot-com, GFC, 2022). Fast crashes (2018 Q4, COVID) are too quick for a
weekly trend filter to dodge cleanly.
