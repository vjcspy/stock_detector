import pandas as pd
import numpy as np


def cal_beta(stock_prices: list, index_price: list) -> float:
	"""

	@rtype: object
	"""
	if len(stock_prices) != len(index_price) or len(stock_prices) == 0:
		raise Exception("Date stock and index provided must be same length")

	pd_stock_prices = pd.DataFrame(
		stock_prices, index=[price['date'] for price in stock_prices], columns=['date', 'adClose'])
	pd_index_prices = pd.DataFrame(
		index_price, index=[price['date'] for price in stock_prices], columns=['date', 'adClose'])
	# pd_stock_index_prices = pd_stock_prices.merge(pd_index_prices, left_on='date', right_on='date')

	list_pct_stock_prices: list = (pd_stock_prices['adClose'].pct_change().values.tolist())
	list_pct_stock_prices.pop(0)

	list_pct_index_prices: list = (pd_index_prices['adClose'].pct_change().values.tolist())
	list_pct_index_prices.pop(0)

	list_pct_stock_prices = list(map(lambda x: round(100 * x, 3), list_pct_stock_prices))
	list_pct_index_prices = list(map(lambda x: round(100 * x, 3), list_pct_index_prices))

	np_pct_stock = np.array(list_pct_stock_prices)
	np_pct_index = np.array(list_pct_index_prices)

	cov = np.cov(np_pct_stock, np_pct_index, ddof=1)[0][1]
	var = np_pct_index.var()
	beta = round(cov / var, 3)

	return beta
