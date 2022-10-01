# function agruments as list
def foo(first, second, third, *therest):
    print("First: %s" % first)
    print("Second: %s" % second)
    print("Third: %s" % third)
    print("And all the rest... %s" % list(therest))

# it is also possible to send funcitons agruments by keyword, so that the order of the argument does not matter
def bar(first, second, third, **options):
    print("And all the rest... %s" % (options))
    if options.get("action") == "sum":
        print("The sum is: %d" % (first + second + third))

    if options.get("number") == "first":
        return first


result = bar(1, 2, 3, action="sum", number="first")
print("Result: %d" % (result))
