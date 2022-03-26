# This prints out "Hello, John!"
name = "John"
print("Hello, %s!" % name)

# Nếu để là định dạng digit mà truyền vào string sẽ báo lỗi luôn
name = "John"
age = 23
print("%s is %d years old." % (name, age))

# Nhưng có thể convert các object về string with a string reprentation, như list, number...
# This prints out: A list: [1, 2, 3]
mylist = [1,2,3]
print("A list: %s" % mylist)

# Float thì dùng $f