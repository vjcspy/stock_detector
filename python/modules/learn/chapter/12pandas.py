import pandas as pd
dict = {
    "country": ["Brazil", "Russia", "India", "China", "South Africa"],
    "capital": ["Brasilia", "Moscow", "New Dehli", "Beijing", "Pretoria"],
    "area": [8.516, 17.10, 3.286, 9.597, 1.221],
    "population": [200.4, 143.5, 1252, 1357, 52.98]
}

brics = pd.DataFrame(dict)
print(brics)
print('_____________')
# Set the index for brics
brics.index = ["BR", "RU", "IN", "CH", "SA"]

# Print out brics with new index values
print(brics)
print('_____________')
# The single bracket will output a Pandas Series, while a double bracket will output a Pandas DataFrame.
print(brics['country'])
print('_____________')
print(brics[['country', 'capital']])
print('_____________')
print(brics[0:2])
print('______ loc/ilog_______')
print(brics.loc[['RU', 'IN']])
print(brics.iloc[[1, 3]])
