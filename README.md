
push 100000
load %rd
log %rd
my-label:
inc %rc 1
jl my-label
halt
