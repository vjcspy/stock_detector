# Decorators allow you to make simple modifications to callable objects like functions, methods, or classes

def repeater(old_function):
    # See learnpython.org/en/Multiple%20Function%20Arguments for how *args and **kwds works
    def new_function(*args, **kwds):
        old_function(*args, **kwds)  # we run the old function
        old_function(*args, **kwds)  # we do it twice
    # we have to return the new_function, or it wouldn't reassign it to the value
    return new_function

@repeater
def multiply(num1, num2):
    print(num1 * num2)

multiply(2, 3)


def double_out(old_function):
    def new_function(*args, **kwds):
        return 2 * old_function(*args, **kwds) # modify the return value
    return new_function

