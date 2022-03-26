phonebook = {}
phonebook["John"] = 938477566
phonebook["Jack"] = 938377264
phonebook["Jill"] = 947662781
print(phonebook)

for name, number in phonebook.items():
    print("Phone number of %s is %d" % (name, number))