def covariance(x, y):
	# Finding the mean of the series x and y
	mean_x = sum(x) / float(len(x))
	mean_y = sum(y) / float(len(y))
	# Subtracting mean from the individual elements
	sub_x = [i - mean_x for i in x]
	sub_y = [i - mean_y for i in y]
	numerator = sum([sub_x[i] * sub_y[i] for i in range(len(sub_x))])
	denominator = len(x) - 1
	cov = numerator / denominator
	return cov
