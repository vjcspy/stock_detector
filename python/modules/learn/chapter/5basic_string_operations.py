astring = "Hello-world!"
print("single quotes are ' '")

print(len(astring))

# Nếu cái này không tìm thấy thì lại trả về error :))
print(astring.index('o'))
print(astring[3:7])

print('____ start:stop:step ____')
print(astring[3:7:2])
print(astring[3:7:1])

# Revert
print(astring[::-1])

print(astring.startswith("Hello"))
print(astring.endswith("asdfasdfasdf"))

print(astring.split("-"))