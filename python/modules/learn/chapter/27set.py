# Sets are lists with no duplicate entries. 
print(set("my name is Eric and Eric is my name".split()))

a = set(["Jake", "John", "Eric"])
b = set(["John", "Jill"])

print(a.intersection(b))
print(b.intersection(a))
print(a.symmetric_difference(b))
print(b.symmetric_difference(a))
print(a.difference(b))
print(b.difference(a))
print(a.union(b))

# Muốn thao tác các phép toán tập hợp thì convert list sang set 