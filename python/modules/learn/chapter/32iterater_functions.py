from functools import reduce
my_strings = ['a', 'b', 'c', 'd', 'e']
my_numbers = [1, 2, 3, 4, 5]

results = list(zip(my_strings, my_numbers))

print(results)

# Python 3
numbers = [3, 4, 6, 9, 34, 12]


def custom_sum(first, second):
    return first + second


result = reduce(custom_sum, numbers, 10)
print(result)
