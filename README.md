# pa1

 1. Give three examples of Python programs that use binary operators and/or builtins from this PA, but have different behavior than your compiler. 


     (1) pow(2,-1): In python it should equal to 1/2, but in our PA, it equals 0
                  We should make our compiler support float operation.
                  
                  
     (2) x = 1: In python these sentences should print nothing however in our PA it prints 1.
              We should warp other functions to juedge if we should return the top element of the stack.
              
              
     (3) pow(2,31)： In python it should return 2147483648,  but in our PA it return -2147483648
                   We could use a larger integer type in our PA
                   
 
2. What resources did you find most helpful in completing the assignment?
   The TA video is the most helpful one! (Thanks to our responsible TA)


3. Who (if anyone) in the class did you work with on the assignment? (See collaboration below)
   I work on my own.
