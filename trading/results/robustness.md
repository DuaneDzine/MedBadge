# Parameter robustness

If a strategy only works at one magic parameter it is curve-fit. These
sweeps show the low-risk strategies are stable across nearby settings.

## SPY SMA trend - window (weeks)
|   window |   cagr_pct |   max_dd_pct |   sharpe |   calmar |
|---------:|-----------:|-------------:|---------:|---------:|
|       26 |       5.81 |        -33.6 |     0.3  |     0.17 |
|       30 |       6.07 |        -29.3 |     0.32 |     0.21 |
|       40 |       6.9  |        -20.2 |     0.39 |     0.34 |
|       50 |       7.89 |        -18.6 |     0.48 |     0.42 |
|       52 |       7.9  |        -20.2 |     0.47 |     0.39 |

## Dual momentum - lookback (weeks)
|   lookback |   cagr_pct |   max_dd_pct |   sharpe |   calmar |
|-----------:|-----------:|-------------:|---------:|---------:|
|         13 |       7.03 |        -50.1 |     0.32 |     0.14 |
|         26 |       7.86 |        -34.2 |     0.37 |     0.23 |
|         39 |       9.93 |        -33.3 |     0.48 |     0.3  |
|         52 |       9.05 |        -28.6 |     0.42 |     0.32 |

## Static mix - SPY / TLT weight
|   spy_weight |   cagr_pct |   max_dd_pct |   sharpe |   calmar |
|-------------:|-----------:|-------------:|---------:|---------:|
|          0.4 |       7.24 |        -29.8 |     0.48 |     0.24 |
|          0.5 |       8.07 |        -28   |     0.55 |     0.29 |
|          0.6 |       8.84 |        -29.8 |     0.58 |     0.3  |
|          0.7 |       9.54 |        -36.7 |     0.58 |     0.26 |
|          0.8 |      10.19 |        -43.2 |     0.57 |     0.24 |
