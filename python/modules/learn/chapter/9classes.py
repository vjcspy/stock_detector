class MyClass:
    variable = "blah"
    
    def function(self):
        print("This is a message inside the class.")
        
        
my_object = MyClass()
my_object.variable
my_object.function()

class NumberHolder:
    
   def __init__(self, number):
       self.number = number
       
number_holder = NumberHolder(2)
print(number_holder.number)