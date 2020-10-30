##  instruction: halt
will stop the vm

example code:
```
INSTRUCTION_HALT
```

Variants: 
0000000

##  instruction: nop
this instruction does nothing

example code:
```
INSTRUCTION_NOP
```
   

##  instruction: label
defines a label  
where you can jump to later with the  
  instructions: je, jne, jg, jge, jl, jmp

example code:
```
INSTRUCTION_LABEL,
INSTRUCTION_JMP  , 0
LABEL got the index of 0
```

##  instruction: je
jumps to a label if the value in register C and D are equal

example code:
```
INSTRUCTION_LABEL,
INSTRUCTION_PUSH, 2,
INSTRUCTION_PUSH, 2,
INSTRUCTION_POP,  C,
INSTRUCTION_POP,  D,
INSTRUCTION_JE ,  0,
```

LABEL got the index of 0
registers:
    A = 0, B = 0, C = 2, D = 2

##  instruction: jne
jumps to a label if the value in register C and D are not equal

example code:
```
INSTRUCTION_LABEL,
INSTRUCTION_PUSH, 1,
INSTRUCTION_PUSH, 2,
INSTRUCTION_POP , C,
INSTRUCTION_POP , D,
INSTRUCTION_JNE , 0,
```
LABEL got the index of 0

registers:   
    A = 0, B = 0, C = 1, D = 2

##  instruction: jg
jumps to a label if the value in register C is greater the value in D

example code:
```
INSTRUCTION_LABEL,
INSTRUCTION_PUSH, 12345678,
INSTRUCTION_PUSH, 1,
INSTRUCTION_POP,  C,
INSTRUCTION_POP,  D,
INSTRUCTION_JG ,  0,
```
LABEL got the index of 0

registers:
    A = 0, B = 0, C = 12345678, D = 1

##  instruction: jge
jumps to a label if the value in register C is greater or equal the value in D

example code:
```
INSTRUCTION_LABEL,
INSTRUCTION_PUSH, 12345678,
INSTRUCTION_PUSH, 12345678,
INSTRUCTION_POP , C,
INSTRUCTION_POP , D,
INSTRUCTION_JGE , 0,
```
LABEL got the index of 0

registers:
    A = 0, B = 0, C = 12345678, D = 12345678

##  instruction: jl
jumps to a label if the value in register C is less the value in D

example code:
```
INSTRUCTION_LABEL,
INSTRUCTION_PUSH, 1,
INSTRUCTION_PUSH, 12345678,
INSTRUCTION_POP,  C,
INSTRUCTION_POP,  D,
INSTRUCTION_JL ,  0,
```
LABEL got the index of 0

registers:  
    A = 0, B = 0, C = 1, D = 12345678

##  instruction: jge
jumps to a label if the value in register C is less or equal the value in D

example code:
```
INSTRUCTION_LABEL,
INSTRUCTION_PUSH, 12345678,
INSTRUCTION_PUSH, 12345678,
INSTRUCTION_POP,  C,
INSTRUCTION_POP,  D,
INSTRUCTION_JLE,  0,
```
LABEL got the index of 0

registers:
    A = 0, B = 0, C = 12345678, D = 12345678

##  instruction: jmp
jumps to a label

example code:
```
INSTRUCTION_LABEL,
INSTRUCTION_JMP  , 0
```
LABEL got the index of 0

registers:  
    A = 0, B = 0, C = 0, D = 0

##  instruction: add
adds the value in register a and b together into register c

example code:
```
INSTRUCTION_PUSH, 123,
INSTRUCTION_PUSH, 321,
INSTRUCTION_ADD ,
```

registers:  
    A = 123, B = 321, C = 444, D = 0

##  instruction: sub
subtracts the value in register a and b together into register c

example code:
```
   INSTRUCTION_PUSH, 123,
   INSTRUCTION_PUSH, 321,
   INSTRUCTION_SUB ,
```

registers:  
    A = 123, B = 321, C = -202, D = 0

##  instruction: mul
multiples the value in register a and b together into register c

example code:
```
   INSTRUCTION_PUSH, 123,
   INSTRUCTION_PUSH, 321,
   INSTRUCTION_MUL ,
```

registers:  
    A = 123, B = 321, C = 39483, D = 0

##  instruction: div
the value in register a and b together into register c
note div is integer / integer = integer

example code:
```
INSTRUCTION_PUSH, 303,
INSTRUCTION_PUSH, 321,
INSTRUCTION_MUL ,
```

registers:  
    A = 123, B = 321, C = 0, D = 0

##  instruction: dec
the value in register <register> <integer> will be in decreased

example code:
```
INSTRUCTION_PUSH, 303,
INSTRUCTION_POP , A,
INSTRUCTION_DEC , A, 303
```

registers:  
    A = 0, B = 0, C = 0, D = 0

##  instruction: inc
the value in register <register> <integer> will be in increased

example code:
```
INSTRUCTION_PUSH, 303,
INSTRUCTION_POP , A,
INSTRUCTION_INC , A, 303
```

registers:  
    A = 606, B = 0, C = 0, D = 0

##  instruction: neg
the value in register <register> will be in negate

example code:
```
INSTRUCTION_PUSH, 303,
INSTRUCTION_POP , A,
INSTRUCTION_NEG , A
```

registers:  
    A = -303, B = 0, C = 0, D = 0

##  instruction: and
the value in register A and register B operate a bitwise and result in register c

example code:
```
INSTRUCTION_PUSH, 1281141, /* 00000000000100111000110001110101 */
INSTRUCTION_POP , A,
INSTRUCTION_PUSH, 3472199, /* 00000000001101001111101101000111 */
INSTRUCTION_POP , B,
INSTRUCTION_AND ,          /* 00000000000100001000100001000101 */
```

registers:  
    A = 1281141, B = 3472199, C = 1083461, D = 0
    
##  instruction: or
the value in register A and register B operate a bitwise and result in register c

example code:
```
INSTRUCTION_PUSH, 1281141, /* 00000000000100111000110001110101 */
INSTRUCTION_POP , A,
INSTRUCTION_PUSH, 3472199, /* 00000000001101001111101101000111 */
INSTRUCTION_POP , B,
INSTRUCTION_OR  ,          /* 00000000000011011111111111011101 */
```

registers:  
    A = 1281141, B = 3472199, C = 4753340, D = 0

##  instruction: xor
the value in register A and register B operate a xor operation and result in register c

example code:
```
   INSTRUCTION_PUSH, 1281141, /* 00000000000100111000110001110101 */
   INSTRUCTION_POP , A,
   INSTRUCTION_PUSH, 3472199, /* 00000000001101001111101101000111 */
   INSTRUCTION_POP , B,
   INSTRUCTION_XOR ,          /* 00000000001001110111011100110010 */
```

registers:
    A = 1281141, B = 3472199, C = 2586418, D = 0

##  instruction: shr
the value in register A operate a shr bitwise and result in register A

example code:
```
INSTRUCTION_PUSH, 2497368, /* 00000000001001100001101101011000 */
INSTRUCTION_POP , A,
INSTRUCTION_SHR , A, 21,   /* 00000000000000000000000000000001 */
```

registers:  
    A = 2497368, B = 0, C = 0, D = 0

##  instruction: shl
the value in register A operate a shl bitwise and result in register A

example code:
```
INSTRUCTION_PUSH, 2497368, /* 00000000001001100001101101011000 */
INSTRUCTION_POP , A,
INSTRUCTION_SHR , A, 5,   /*  00000100110000110110101100000000 */
```

registers:  
    A = 79915776, B = 0, C = 0, D = 0

##  instruction: push
pushes a value on top to the stack

example code:
```
INSTRUCTION_PUSH, 2497368, /* 00000000001001100001101101011000 */
```

stack:
```
[0]         = 2497368
[1 .. 4095] = 0
```

registers:  
    A = 0, B = 0, C = 0, D = 0

##  instruction: pop
removes a value from stack into the register A .. D

example code:
```
   INSTRUCTION_PUSH, 2497368, /* 00000000001001100001101101011000 */
   INSTRUCTION_POP , A,
```

stack:
```
[0 .. 4095] = 0
```

registers:  
    A = 2497368, B = 0, C = 0, D = 0

##  instruction: save
example code:
```
   INSTRUCTION_PUSH, 2497368, /* 00000000001001100001101101011000 */
   INSTRUCTION_POP , A,
   INSTRUCTION_SAVE, A,
```

stack:
```
[0]         = 2497368
[1 .. 4095] = 0
```

registers:  
    A = 2497368, B = 0, C = 0, D = 0

##  instruction: load

example code:
```
   INSTRUCTION_PUSH, 2497368, /* 00000000001001100001101101011000 */
   INSTRUCTION_LOAD, A,
```

stack:
```
[0 .. 4095] = 0
```

registers:  
    A = 2497368, B = 0, C = 0, D = 0


## instruction: log
Outputs the given register to the console

```
INSTRUCTION_PUSH, 17,
INSTRUCTION_LOAD, D,
INSTRUCTION_LOG, D,
```

output:
```
17
```
