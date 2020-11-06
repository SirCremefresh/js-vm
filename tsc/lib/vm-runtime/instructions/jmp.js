import { assert } from '../assert';
export function jmp(vmState) {
    const instruction = vmState.nextInstruction();
    if (process.env.NODE_ENV !== 'production') {
        assert(vmState.instructions[instruction] === 9 /* INSTRUCTION_LABEL */, 'Jump Destination is not Label');
    }
    vmState.instructionIndex = instruction;
}
//# sourceMappingURL=jmp.js.map