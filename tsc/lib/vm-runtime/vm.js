import { InstructionMap } from './instructions';
import { VmState } from './vm-state';
export class Vm {
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
//# sourceMappingURL=vm.js.map