function add(vmState) {
    vmState.registers[0 /* A */] = vmState.nextInstruction();
    vmState.registers[1 /* B */] = vmState.nextInstruction();
    vmState.registers[2 /* C */] = vmState.registers[0 /* A */] + vmState.registers[1 /* B */];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function halt(vmState) {
    console.log('halt');
}

function inc(vmState) {
    vmState.registers[vmState.nextInstruction()] += vmState.nextInstruction();
}

function jmp(vmState) {
    const instruction = vmState.nextInstruction();
    vmState.instructionIndex = instruction;
}

function jl(vmState) {
    if (vmState.registers[2 /* C */] >= vmState.registers[3 /* D */]) {
        vmState.instructionIndex++;
        return;
    }
    jmp(vmState);
}

function jle(vmState) {
    if (vmState.registers[2 /* C */] > vmState.registers[3 /* D */]) {
        vmState.instructionIndex++;
        return;
    }
    jmp(vmState);
}

function load(vmState) {
    const stackValue = vmState.stack.pop();
    vmState.registers[vmState.nextInstruction()] = stackValue;
}

function log(vmState) {
    console.log(vmState.registers[vmState.nextInstruction()]);
}

function push(vmState) {
    vmState.stack.push(vmState.nextInstruction());
}

const InstructionMap = {
    [0 /* INSTRUCTION_HALT */]: halt,
    [1 /* INSTRUCTION_PUSH */]: push,
    [2 /* INSTRUCTION_LOG */]: log,
    [3 /* INSTRUCTION_ADD */]: add,
    [4 /* INSTRUCTION_LOAD */]: load,
    [5 /* INSTRUCTION_INC */]: inc,
    [6 /* INSTRUCTION_JMP */]: jmp,
    [7 /* INSTRUCTION_JLE */]: jle,
    [8 /* INSTRUCTION_JL */]: jl,
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/no-unused-vars
    [10 /* INSTRUCTION_NOP */]: function (_) {
        return null;
    },
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/no-unused-vars
    [9 /* INSTRUCTION_LABEL */]: function (_) {
        return null;
    },
};

class VmState {
    constructor(instructions) {
        this.stack = [];
        this.registers = new Int32Array(4 /* REGISTER_LENGTH */);
        this.instructionIndex = 0;
        this.instructions = instructions;
    }
    nextInstruction() {
        return this.instructions[this.instructionIndex++];
    }
}

class Vm {
    constructor(instructions) {
        this.vmState = new VmState(instructions);
    }
    run() {
        let instruction;
        do {
            instruction = this.vmState.instructions[this.vmState.instructionIndex++];
            InstructionMap[instruction](this.vmState);
        } while (instruction !== 0 /* INSTRUCTION_HALT */);
        return 0;
    }
}

console.time('vm_test');
const vm = new Vm(Int32Array.from([
    1 /* INSTRUCTION_PUSH */, 1000000,
    4 /* INSTRUCTION_LOAD */, 3 /* D */,
    2 /* INSTRUCTION_LOG */, 3 /* D */,
    9 /* INSTRUCTION_LABEL */,
    5 /* INSTRUCTION_INC */, 2 /* C */, 1,
    8 /* INSTRUCTION_JL */, 6,
    0 /* INSTRUCTION_HALT */
]));
//
vm.run();
console.log(JSON.stringify(vm.vmState));
console.timeLog('vm_test');
