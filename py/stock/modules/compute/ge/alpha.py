import pandas as pd


def compute_alpha(stock_prices: list, index_price: list) -> float:
    """
    Là cách tính do mình nghĩ ra để đo lường sự tương quan giữa phần trăm tăng giảm mỗi ngày của 2 cố phiếu

    :param stock_prices:
    :param index_price:
    :return:
    """
    if len(stock_prices) != len(index_price) or len(stock_prices) == 0:
        raise Exception("Date stock and index provided must be same length")

    pd_stock_prices = pd.DataFrame(
        stock_prices, index=[price['date'] for price in stock_prices], columns=['adClose'])
    pd_index_prices = pd.DataFrame(
        index_price, index=[price['date'] for price in stock_prices], columns=['adClose'])

    list_pct_stock_prices = (pd_stock_prices['adClose'].pct_change())
    list_pct_index_prices = (pd_index_prices['adClose'].pct_change())

    r = list_pct_stock_prices * list_pct_index_prices

    print(list_pct_stock_prices)
    print(list_pct_index_prices)
    print(r)
    print(round(r.sum(), 3))

    return round(r.sum(), 3)
