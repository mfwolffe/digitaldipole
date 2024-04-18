def find_sigfigs(x):
    '''Returns the number of significant digits in a number. This takes into account
       strings formatted in 1.23e+3 format and even strings such as 123.450''' 
    if x[0] == "-":
        x = x[1:]
    
    # change all the 'E' to 'e'
    x = x.lower()
    if ('e' in x):
        # return the length of the numbers before the 'e'
        myStr = x.split('e')
        return len( myStr[0] ) - 1 # to compenstate for the decimal point
    else:
        # put it in e format and return the result of that
        ### NOTE: because of the 8 below, it may do crazy things when it parses 9 sigfigs
        n = ('%.*e' %(8, float(x))).split('e')
        # remove and count the number of removed user added zeroes. (these are sig figs)
        if '.' in x:
            s = x.replace('.', '')
            #number of zeroes to add back in
            l = len(s) - len(s.rstrip('0'))
            #strip off the python added zeroes and add back in the ones the user added
            n[0] = n[0].rstrip('0') + ''.join(['0' for num in range(l)])
        else:
            #the user had no trailing zeroes so just strip them all
            n[0] = n[0].rstrip('0')
        #pass it back to the beginning to be parsed
    return find_sigfigs(('e'.join(n)))

print(" ")
print("new tests:")
print(find_sigfigs("198745")); # Output: 6
print(find_sigfigs("108.0097")); # Output: 7
print(find_sigfigs("0.00798")); # Output: 3
print(find_sigfigs("20.00")); # Output: 4
print(find_sigfigs("0.0079800")); # Output: 5
print(find_sigfigs("1090")); # Output: 3
print("old tests:")
print(find_sigfigs("123.456")); # Output: 6
print(find_sigfigs("0.0000123")); # Output: 3
print(find_sigfigs("1000")); # Output: 1 (leading zeros are not significant)
print(find_sigfigs("-0.0000000067")); # Output: 2 (2 leading zeros after minus sign)
print(find_sigfigs("123000"));# Output: 3
print(find_sigfigs("1.23e-5")); # Output: 3