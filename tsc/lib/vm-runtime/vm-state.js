export class VmState {
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
//# sourceMappingURL=vm-state.js.map