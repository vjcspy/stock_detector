from stock.modules.compute.ge.alpha import compute_alpha


def test_alpha():
    r = compute_alpha(stock_prices=[
        {"date": "1", "adClose": 10},
        {"date": "2", "adClose": 15},
        {"date": "3", "adClose": 16},
    ], index_price=[
        {"date": "1", "adClose": 3},
        {"date": "2", "adClose": 2},
        {"date": "3", "adClose": 5},
    ])

    assert r == -0.067
