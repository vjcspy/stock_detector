primes = [2, 3, 4, 5, 6]

for item in primes:
    print(item)

count = 1
while count < 5:
    print(count)
    count += 1


count = 0
while True:
    print(count)
    count += 1
    if count >= 5:
        break

# Prints out only odd numbers - 1,3,5,7,9
for x in range(10):
    # Check if x is even
    if x % 2 == 0:
        continue
    print(x)