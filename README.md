# Js Vm
With this project, the goal was to get a better understanding of stack-based VM's. It is a simple VM with a very limited amount of instructions. I also created an online editor where you can create and run your programs. The "parser" has even fewer instructions but hey, it was a proof of concept. 

The only dependency for this project besides build tooling is the font. While it was fun writing an editor from scratch with syntax hilighting. It would have probably been easier to just use a dependency like "codemirror".

The editor can be found here. [sircremefresh.github.io/js-vm/](https://sircremefresh.github.io/js-vm/)

## Sample

Sample programm that loops from 1 to 10 and prints every number 
```
push 10
load %rd
log %rd
loop_start:
inc %rc, 1
log %rc
jl loop_start
halt
```
