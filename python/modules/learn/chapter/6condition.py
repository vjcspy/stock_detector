x = 2
print(x == 2)  # prints out True
print(x == 3)  # prints out False
print(x < 3)  # prints out True

name = "A"
age = 1

if name == "a" and age == 1:
    print("OK")
else:
    print("Not OK")


if name in ["A", "B"]:
    print("name is either A or B")

print(["A", "B"].index(name))

if ["A", "B"].index(name) > -1:
    print("another way to check in array")


print("____________________")

statement = False
another_statement = True
if statement is True:
    pass
elif another_statement is True:  # else if
    # do something else
    print(2)
    pass
else:
    # do another thing
    print(3)
    pass

# Có thể so sánh 2 mảng ==
x = [1,2,3]
y = [1,2,3]
print(x == y) # Prints out True
print(x is y) # Prints out False